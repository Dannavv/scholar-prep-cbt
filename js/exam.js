(function () {
    const CONFIDENCE_LEVELS = [
        { value: 'low', label: 'Low Confidence' },
        { value: 'medium', label: 'Medium Confidence' },
        { value: 'high', label: 'High Confidence' }
    ];

    const SESSION_SAVE_KEY = 'hpcl_active_session';

    const state = {
        filteredQuestions: [],
        currentIndex: 0,
        responses: {},
        questionMeta: [],
        timerId: null,
        secondsRemaining: 0,
        totalAllocatedSeconds: 0,
        examStartTimeMs: 0,
        currentQuestionEnteredAtMs: 0,
        activeSection: 'all',
        isActive: false,
        isSubmitted: false
    };

    function saveActiveSession() {
        if (!state.isActive || state.isSubmitted) return;
        const snapshot = {
            filteredQuestions: state.filteredQuestions,
            currentIndex: state.currentIndex,
            responses: state.responses,
            questionMeta: state.questionMeta,
            secondsRemaining: state.secondsRemaining,
            totalAllocatedSeconds: state.totalAllocatedSeconds,
            activeSection: state.activeSection,
            lastSavedAt: Date.now()
        };
        sessionStorage.setItem(SESSION_SAVE_KEY, JSON.stringify(snapshot));
    }

    function clearActiveSession() {
        sessionStorage.removeItem(SESSION_SAVE_KEY);
    }

    function getRecommendedDurations(maxCount) {
        const base = [5, 10, 25, 50, 100];
        const available = base.filter((count) => count < maxCount);
        available.push(maxCount);
        return [...new Set(available)].sort((a, b) => a - b);
    }

    function refreshExamLengthOptions() {
        const sectionSelect = document.getElementById('examSection');
        const lengthSelect = document.getElementById('examLength');
        const summary = document.getElementById('examPoolSummary');
        if (!sectionSelect || !lengthSelect || !summary) return;

        const pool = HPCLCommon.getQuestionPool(sectionSelect.value);
        const counts = getRecommendedDurations(pool.length);
        lengthSelect.innerHTML = counts.map((count, index) => {
            const label = index === counts.length - 1 ? `All available (${count})` : `${count} Questions`;
            return `<option value="${count}">${label}</option>`;
        }).join('');
        
        const defaultTarget = counts.includes(10) ? 10 : counts[0];
        lengthSelect.value = String(defaultTarget);

        const sectionLabel = sectionSelect.value === 'all' ? 'all sections' : sectionSelect.value;
        summary.textContent = `${pool.length} questions currently available for ${sectionLabel}. Session lengths are capped to match the real bank.`;
    }

    function renderHistory() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        const stats = ScholarStorage.getStats();
        if (stats.history.length === 0) {
            historyList.innerHTML = `
                <div class="card history-empty">
                    <i class="fas fa-history history-empty-icon"></i>
                    <p>No mock exams attempted yet. Start your first practice drill to see your growth.</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = stats.recentSessions.map((item) => {
            const toneClass = item.accuracy >= 80 ? 'tone-success' : item.accuracy >= 50 ? 'tone-warning' : 'tone-danger';
            return `
                <article class="card history-card ${toneClass}">
                    <div class="history-card-row">
                        <div>
                            <h4>${item.section === 'all' ? 'Mixed Practice Session' : item.section}</h4>
                            <p>${item.label} • ${item.total} Questions • ${item.skipped} skipped</p>
                        </div>
                        <div class="history-score">
                            <div>${item.score} / ${item.total}</div>
                            <div>${item.accuracy}% Accuracy</div>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    function getExamPool(section) {
        const pool = HPCLCommon.getQuestionPool(section);
        const masteredIds = ScholarStorage.getMasteredIds();
        const freshQuestions = pool.filter((question) => !masteredIds.has(question.id));

        if (freshQuestions.length >= Math.max(3, Math.ceil(pool.length * 0.6))) {
            return freshQuestions;
        }

        const prioritizedPool = [
            ...freshQuestions,
            ...pool.filter((question) => masteredIds.has(question.id))
        ];

        return prioritizedPool.length > 0 ? prioritizedPool : pool;
    }

    function createQuestionSet(section, length) {
        const pool = getExamPool(section);
        const shuffled = [...pool]
            .map((question) => ({ question, sortKey: Math.random() }))
            .sort((a, b) => a.sortKey - b.sortKey)
            .map((entry) => entry.question);

        return shuffled.slice(0, Math.min(length, shuffled.length));
    }

    function createQuestionMeta() {
        return state.filteredQuestions.map(() => ({
            timeSpentMs: 0,
            answerChanges: 0,
            viewedCount: 0,
            firstAnswer: null,
            confidence: 'none'
        }));
    }

    function prepareExam() {
        const section = document.getElementById('examSection').value;
        const length = Number.parseInt(document.getElementById('examLength').value, 10);
        const startButton = document.getElementById('startExamBtn');

        state.filteredQuestions = createQuestionSet(section, length);
        if (state.filteredQuestions.length === 0) {
            const summary = document.getElementById('examPoolSummary');
            if (summary) summary.textContent = 'No questions are available for this selection right now.';
            return;
        }

        state.currentIndex = 0;
        state.responses = {};
        state.questionMeta = createQuestionMeta();
        state.totalAllocatedSeconds = state.filteredQuestions.length * 52;
        state.secondsRemaining = state.totalAllocatedSeconds;
        state.examStartTimeMs = Date.now();
        state.currentQuestionEnteredAtMs = 0;
        state.activeSection = section;
        state.isActive = true;
        state.isSubmitted = false;

        document.getElementById('examTitle').textContent = section === 'all'
            ? 'Mixed Practice Session'
            : `${section} Practice Session`;

        if (startButton) startButton.disabled = true;
        toggleScribblePad(false);
        showPanel('active');
        saveActiveSession();
        renderQuestion(true);
        startTimer();
    }

    function syncCurrentQuestionTiming() {
        if (!state.filteredQuestions.length || !state.currentQuestionEnteredAtMs) return;
        const meta = state.questionMeta[state.currentIndex];
        if (!meta) return;

        meta.timeSpentMs += Math.max(0, performance.now() - state.currentQuestionEnteredAtMs);
        state.currentQuestionEnteredAtMs = performance.now();
    }

    function renderQuestion(countAsVisit) {
        const question = state.filteredQuestions[state.currentIndex];
        if (!question) return;

        const progress = document.getElementById('progress');
        const text = document.getElementById('qText');
        const optionsList = document.getElementById('optionsList');
        const confidenceList = document.getElementById('confidenceControls');
        const prevButton = document.getElementById('prevBtn');
        const nextButton = document.getElementById('nextBtn');
        const meta = state.questionMeta[state.currentIndex];

        if (countAsVisit) {
            meta.viewedCount += 1;
        }
        state.currentQuestionEnteredAtMs = performance.now();

        progress.textContent = `Question ${state.currentIndex + 1} / ${state.filteredQuestions.length}`;
        text.textContent = question.question;
        optionsList.innerHTML = '';
        confidenceList.innerHTML = '';

        question.options.forEach((option, index) => {
            const label = String.fromCharCode(97 + index);
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `option-item ${state.responses[state.currentIndex] === label ? 'selected' : ''}`;
            button.setAttribute('role', 'listitem');
            button.setAttribute('aria-pressed', String(state.responses[state.currentIndex] === label));
            button.innerHTML = `<span class="option-circle">${label.toUpperCase()}</span><span>${option}</span>`;
            button.addEventListener('click', () => selectAnswer(label));
            optionsList.appendChild(button);
        });

        CONFIDENCE_LEVELS.forEach((level) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `confidence-chip ${meta.confidence === level.value ? 'active' : ''}`;
            button.textContent = level.label;
            button.addEventListener('click', () => {
                syncCurrentQuestionTiming();
                meta.confidence = level.value;
                saveActiveSession();
                renderQuestion(false);
            });
            confidenceList.appendChild(button);
        });

        prevButton.disabled = state.currentIndex === 0;
        nextButton.textContent = state.currentIndex === state.filteredQuestions.length - 1 ? 'Submit' : 'Next';
    }

    function selectAnswer(label) {
        const current = state.responses[state.currentIndex];
        if (current === label) return;

        const meta = state.questionMeta[state.currentIndex];
        if (!meta.firstAnswer) {
            meta.firstAnswer = label;
        }

        meta.answerChanges += current ? 1 : 0;
        meta.confidence = 'none'; // Reset confidence on answer change to avoid misleading stats
        state.responses[state.currentIndex] = label;
        syncCurrentQuestionTiming();
        saveActiveSession();
        renderQuestion(false);
    }

    function navigateQuestion(direction) {
        syncCurrentQuestionTiming();

        if (direction === 1 && state.currentIndex === state.filteredQuestions.length - 1) {
            const unanswered = state.filteredQuestions.length - Object.keys(state.responses).length;
            const message = unanswered > 0
                ? `You have ${unanswered} unanswered questions. Are you sure you want to submit?`
                : 'Finished! Submit your exam now?';

            if (confirm(message)) submitExam();
            return;
        }

        state.currentIndex += direction;
        saveActiveSession();
        renderQuestion(true);
    }

    function updateTimer() {
        const timer = document.getElementById('timer');
        if (!timer) return;

        const minutes = Math.max(0, Math.floor(state.secondsRemaining / 60));
        const seconds = Math.max(0, state.secondsRemaining % 60);
        timer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function startTimer() {
        if (state.timerId) clearInterval(state.timerId);
        state.examStartTimeMs = Date.now();

        state.timerId = window.setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - state.examStartTimeMs) / 1000);
            state.secondsRemaining = Math.max(0, state.totalAllocatedSeconds - elapsedSeconds);
            updateTimer();
            
            if (state.secondsRemaining <= 0) {
                stopTimer();
                alert("Time is up! Your responses will now be submitted.");
                submitExam();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(state.timerId);
        state.timerId = null;
    }

    function classifyMistake(question, meta, userAnswer) {
        const correctAnswer = question.answer;
        const isSkipped = !userAnswer;
        if (isSkipped) return 'Skipped';
        if (userAnswer === correctAnswer) {
            return meta.timeSpentMs > 90000 ? 'Slow but Correct' : 'Clean Solve';
        }
        if (meta.confidence === 'high') return 'Concept Confusion';
        if (meta.answerChanges > 0) return 'Careless Change';
        if (meta.timeSpentMs > 70000) return 'Speed Pressure';
        return 'Random Guess';
    }

    function buildSessionResult() {
        syncCurrentQuestionTiming();
        stopTimer();

        const sessionItems = state.filteredQuestions.map((question, index) => {
            const userAnswer = state.responses[index] || null;
            const meta = state.questionMeta[index];
            const isSkipped = !userAnswer;
            const isCorrect = userAnswer === question.answer;

            return {
                id: question.id,
                section: question.section,
                topic: question.topic,
                difficulty: question.difficulty,
                userAnswer,
                correctAnswer: question.answer,
                firstAnswer: meta.firstAnswer,
                answerChanges: meta.answerChanges,
                timeSpentMs: Math.round(meta.timeSpentMs),
                viewedCount: meta.viewedCount,
                confidence: meta.confidence,
                isSkipped,
                isCorrect,
                mistakeType: classifyMistake(question, meta, userAnswer)
            };
        });

        const score = sessionItems.filter((item) => item.isCorrect).length;
        const totalDurationSeconds = Math.round((Date.now() - state.examStartTimeMs) / 1000);

        return {
            date: new Date().toISOString(),
            score,
            total: state.filteredQuestions.length,
            section: state.activeSection,
            plannedSeconds: state.filteredQuestions.length * 52,
            totalDurationSeconds,
            allQData: sessionItems
        };
    }

    function submitExam() {
        if (!state.isActive || state.isSubmitted) return;
        state.isSubmitted = true;
        clearActiveSession();
        const result = buildSessionResult();
        ScholarStorage.saveResult(result);
        renderResults(result);
        renderHistory();
        refreshExamLengthOptions();
        showPanel('result');
    }

    function renderResults(result) {
        const finalScore = document.getElementById('finalScore');
        const resultMeta = document.getElementById('resultMeta');
        const analysisReport = document.getElementById('analysisReport');
        const resultInsightGrid = document.getElementById('resultInsightGrid');
        const recommendationList = document.getElementById('resultRecommendationList');
        if (!finalScore || !resultMeta || !analysisReport || !resultInsightGrid || !recommendationList) return;

        const attempted = result.allQData.filter((item) => !item.isSkipped).length;
        const skipped = result.total - attempted;
        const accuracy = attempted > 0 ? Math.round((result.score / attempted) * 100) : 0;
        const avgTimeMs = result.allQData.length > 0
            ? Math.round(result.allQData.reduce((sum, item) => sum + item.timeSpentMs, 0) / result.allQData.length)
            : 0;
        const firstTryCorrect = result.allQData.filter((item) => item.firstAnswer && item.firstAnswer === item.correctAnswer).length;
        const firstTryTotal = result.allQData.filter((item) => item.firstAnswer).length;
        const confidenceMeasured = result.allQData.filter((item) => item.confidence !== 'none').length;
        const confidenceAvg = confidenceMeasured > 0
            ? (result.allQData.reduce((sum, item) => sum + confidenceValue(item.confidence), 0) / confidenceMeasured).toFixed(1)
            : '0.0';

        finalScore.textContent = `${result.score} / ${result.total}`;
        resultMeta.textContent = `${accuracy}% accuracy with ${skipped} skipped. Session time: ${Math.floor(result.totalDurationSeconds / 60)}m ${result.totalDurationSeconds % 60}s.`;

        resultInsightGrid.innerHTML = [
            insightMetricCard('Attempt Quality', `${attempted}/${result.total}`, `${skipped} skipped, ${accuracy}% accuracy on attempts`),
            insightMetricCard('First-Try Accuracy', `${firstTryTotal > 0 ? Math.round((firstTryCorrect / firstTryTotal) * 100) : 0}%`, 'How often your first instinct was right'),
            insightMetricCard('Pace', HPCLCommon.formatDurationMs(avgTimeMs), 'Average time spent per question'),
            insightMetricCard('Confidence Signal', confidenceAvg, `${confidenceMeasured} confidence-tagged answers in this session`)
        ].join('');

        const sessionRecommendations = buildSessionRecommendations(result);
        recommendationList.innerHTML = sessionRecommendations.map((item) => `
            <article class="recommendation-item">
                <h4>${item.title}</h4>
                <p>${item.detail}</p>
            </article>
        `).join('');

        analysisReport.innerHTML = result.allQData.map((item, index) => `
            <article class="analysis-item ${item.isCorrect ? 'correct' : 'wrong'}">
                <div class="analysis-header">
                    <span class="tiny-pill">${item.section}</span>
                    <span class="tiny-pill">${item.topic}</span>
                    <span class="tiny-pill">${item.difficulty}</span>
                    <span class="tiny-pill">${item.mistakeType}</span>
                </div>
                <h3>${index + 1}. ${state.filteredQuestions[index].question}</h3>
                <p><strong>Your answer:</strong> ${item.userAnswer ? item.userAnswer.toUpperCase() : 'Skipped'}</p>
                <p><strong>Correct answer:</strong> ${item.correctAnswer.toUpperCase()}</p>
                <p><strong>Time spent:</strong> ${HPCLCommon.formatDurationMs(item.timeSpentMs)} • <strong>Confidence:</strong> ${formatConfidence(item.confidence)} • <strong>Answer changes:</strong> ${item.answerChanges}</p>
                <p><strong>Explanation:</strong> ${state.filteredQuestions[index].explanation}</p>
            </article>
        `).join('');
    }

    function buildSessionRecommendations(result) {
        const items = result.allQData;
        const weakTopic = [...items]
            .filter((item) => !item.isCorrect)
            .sort((a, b) => a.timeSpentMs - b.timeSpentMs)[0];
        const hardWrong = items.filter((item) => item.difficulty === 'Hard' && !item.isCorrect).length;
        const highConfidenceWrong = items.filter((item) => item.confidence === 'high' && !item.isCorrect).length;
        const skipped = items.filter((item) => item.isSkipped).length;

        const recommendations = [];
        if (weakTopic) {
            recommendations.push({
                title: `Review ${weakTopic.topic}`,
                detail: `This was your cleanest weak signal in the session and should be the first revision target before the next mock.`
            });
        }
        if (hardWrong > 0) {
            recommendations.push({
                title: 'Rebuild hard-question composure',
                detail: `${hardWrong} hard questions were missed, so a short hard-only drill would improve readiness faster than another broad session.`
            });
        }
        if (highConfidenceWrong > 0) {
            recommendations.push({
                title: 'Audit confident errors',
                detail: `${highConfidenceWrong} answers were wrong despite high confidence. That usually points to concept confusion, not just pace.`
            });
        }
        if (skipped > 0) {
            recommendations.push({
                title: 'Reduce skips under time pressure',
                detail: `${skipped} questions were left blank. A timed 5-question sprint can help you practice committing faster.`
            });
        }
        if (recommendations.length === 0) {
            recommendations.push({
                title: 'Keep the pattern steady',
                detail: 'This session stayed balanced. The next step is to repeat the same section mix and watch whether hard-question pace improves.'
            });
        }
        return recommendations.slice(0, 4);
    }

    function showPanel(panel) {
        const home = document.getElementById('examHome');
        const active = document.getElementById('examActive');
        const result = document.getElementById('examResult');
        const startButton = document.getElementById('startExamBtn');
        if (!home || !active || !result) return;

        home.hidden = panel !== 'home';
        active.hidden = panel !== 'active';
        result.hidden = panel !== 'result';

        if (panel !== 'active') {
            stopTimer();
            state.isActive = false;
            state.currentQuestionEnteredAtMs = 0;
            toggleScribblePad(false);
            if (startButton) startButton.disabled = false;
            if (panel === 'home' || panel === 'result') clearActiveSession();
        }
    }

    function toggleScribblePad(forceOpen) {
        const pad = document.getElementById('scribblePad');
        const text = document.getElementById('scribbleText');
        if (!pad || !text) return;

        const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : pad.hidden;
        pad.hidden = !shouldOpen;
        if (shouldOpen) text.focus();
    }

    function exportCurrentProgress() {
        HPCLCommon.downloadText('hpcl-progress-summary.txt', ScholarStorage.exportProgressReport());
    }

    function bindEvents() {
        document.getElementById('examSection')?.addEventListener('change', refreshExamLengthOptions);
        document.getElementById('startExamBtn')?.addEventListener('click', prepareExam);
        document.getElementById('prevBtn')?.addEventListener('click', () => navigateQuestion(-1));
        document.getElementById('nextBtn')?.addEventListener('click', () => navigateQuestion(1));
        document.getElementById('toggleScribbleBtn')?.addEventListener('click', () => toggleScribblePad());
        document.getElementById('closeScribbleBtn')?.addEventListener('click', () => toggleScribblePad(false));
        document.getElementById('resetProgressBtn')?.addEventListener('click', () => ScholarStorage.clearHistory());
        document.getElementById('startAnotherBtn')?.addEventListener('click', () => {
            showPanel('home');
            refreshExamLengthOptions();
        });
        document.getElementById('backToSetupBtn')?.addEventListener('click', () => showPanel('home'));
        document.getElementById('exportResultBtn')?.addEventListener('click', exportCurrentProgress);
        
        window.addEventListener('beforeunload', (e) => {
            if (state.isActive && !state.isSubmitted) {
                e.preventDefault();
                e.returnValue = ''; // Standard way to trigger a confirmation dialog
            }
            stopTimer();
        });
    }

    function initExamPage() {
        if (!document.getElementById('exam')) return;
        showPanel('home');
        bindEvents();
        refreshExamLengthOptions();
        renderHistory();

        // Resume session if available
        const saved = sessionStorage.getItem(SESSION_SAVE_KEY);
        if (saved) {
            try {
                const snapshot = JSON.parse(saved);
                const timePassedSinceSave = Math.floor((Date.now() - snapshot.lastSavedAt) / 1000);
                
                state.filteredQuestions = snapshot.filteredQuestions;
                state.currentIndex = snapshot.currentIndex;
                state.responses = snapshot.responses;
                state.questionMeta = snapshot.questionMeta;
                state.totalAllocatedSeconds = snapshot.totalAllocatedSeconds;
                state.secondsRemaining = Math.max(0, snapshot.secondsRemaining - timePassedSinceSave);
                state.activeSection = snapshot.activeSection;
                state.isActive = true;
                state.examStartTimeMs = Date.now() - (state.totalAllocatedSeconds - state.secondsRemaining) * 1000;

                if (state.secondsRemaining > 0) {
                    showPanel('active');
                    renderQuestion(false);
                    startTimer();
                } else {
                    clearActiveSession();
                }
            } catch (e) {
                console.error('Failed to resume session:', e);
                clearActiveSession();
            }
        }
    }

    function confidenceValue(value) {
        if (value === 'high') return 3;
        if (value === 'medium') return 2;
        if (value === 'low') return 1;
        return 0;
    }

    function formatConfidence(value) {
        if (value === 'none') return 'Not set';
        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    }

    function insightMetricCard(label, value, detail) {
        return `
            <article class="card micro-stat-card">
                <span class="tiny-pill">${label}</span>
                <strong>${value}</strong>
                <p>${detail}</p>
            </article>
        `;
    }

    window.HPCLExam = {
        initExamPage
    };
})();
