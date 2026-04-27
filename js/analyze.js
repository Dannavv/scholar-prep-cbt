(function () {
    function renderOverview(stats) {
        const grid = document.getElementById('analyticsOverviewGrid');
        if (!grid) return;

        grid.innerHTML = [
            overviewCard('Readiness', `${stats.readiness}`, stats.dataQuality.enoughHistory ? 'Composite readiness score' : 'Readiness is still stabilizing'),
            overviewCard('Overall Accuracy', `${stats.accuracy}%`, `${stats.totalCorrect} correct, ${stats.totalSkipped} skipped overall`),
            overviewCard('Coverage', `${stats.coverage}%`, `${stats.totalQuestions} total questions in the current bank`),
            overviewCard('Trend', `${stats.trendDelta >= 0 ? '+' : ''}${stats.trendDelta} pts`, 'Recent sessions vs previous baseline')
        ].join('');
    }

    function renderRecommendations(stats) {
        const panel = document.getElementById('recommendationsPanel');
        if (!panel) return;

        panel.innerHTML = stats.recommendations.map((item) => `
            <article class="recommendation-item">
                <h4>${item.title}</h4>
                <p>${item.detail}</p>
            </article>
        `).join('');
    }

    function renderMasterMeter(stats) {
        const tick = document.getElementById('readinessTick');
        const val = document.getElementById('readinessTickValue');
        if (!tick) return;

        const progress = stats.readiness;

        if (val) val.textContent = `${progress}%`;

        // Delay slightly for entry animation
        setTimeout(() => {
            tick.style.left = `${progress}%`;
        }, 100);
    }

    function renderComparison(stats) {
        const note = document.getElementById('dataQualityNote');
        const panel = document.getElementById('comparisonPanel');
        if (!note || !panel) return;

        note.textContent = stats.dataQuality.note;

        const latest = stats.comparison?.latest;
        const previous = stats.comparison?.previous;
        if (!latest) {
            panel.innerHTML = `<p class="helper-text">Complete a session to unlock comparison analytics.</p>`;
            return;
        }

        panel.innerHTML = [
            simpleMetricCard('Latest Accuracy', `${latest.accuracy}%`, latest.label),
            simpleMetricCard('Latest Pace', HPCLCommon.formatDurationMs(latest.avgTimeMs), `${latest.attempted} attempted, ${latest.skipped} skipped`),
            simpleMetricCard(
                'Comparable Delta',
                previous ? `${stats.comparison.deltaAccuracy >= 0 ? '+' : ''}${stats.comparison.deltaAccuracy} pts` : 'Not enough data',
                previous ? `Compared with ${previous.label} in a similar session type` : 'Needs a comparable previous session'
            ),
            simpleMetricCard('First-Try Accuracy', `${stats.firstTryAccuracy}%`, 'Measures whether your first instinct is usually right')
        ].join('');
    }

    function renderTopicSignals(stats) {
        renderTopicList('strongTopicsPanel', stats.strongestTopics, 'No strong-topic signal yet.');
        renderTopicList('weakTopicsPanel', stats.weakestTopics, 'No weak-topic signal yet.');
    }

    function renderCoverage(stats) {
        const panel = document.getElementById('coveragePanel');
        if (!panel) return;

        panel.innerHTML = stats.sectionArray.map((section) => `
            <article class="metric-row-card">
                <div class="metric-row-head">
                    <strong>${section.name}</strong>
                    <span>${section.coverage}% coverage</span>
                </div>
                <div class="mini-progress" aria-hidden="true">
                    <div class="mini-progress-fill" style="width: ${section.coverage}%;"></div>
                </div>
                <p>${section.accuracy}% accuracy, ${section.skipped} skipped, ${HPCLCommon.formatDurationMs(section.avgTimeMs)} average pace</p>
            </article>
        `).join('');
    }

    function renderDifficulty(stats) {
        const panel = document.getElementById('difficultyPanel');
        if (!panel) return;

        panel.innerHTML = stats.difficultyArray.map((difficulty) => `
            <article class="metric-row-card">
                <div class="metric-row-head">
                    <strong>${difficulty.name}</strong>
                    <span>${difficulty.accuracy}% accuracy</span>
                </div>
                <p>${difficulty.attempts} attempted, ${difficulty.skipped} skipped, ${HPCLCommon.formatDurationMs(difficulty.avgTimeMs)} average time</p>
            </article>
        `).join('');
    }

    function renderRecentSessions(stats) {
        const panel = document.getElementById('recentSessionsPanel');
        if (!panel) return;

        if (stats.recentSessions.length === 0) {
            panel.innerHTML = `<p class="helper-text">No sessions yet. Finish a practice set to start your trend line.</p>`;
            return;
        }

        panel.innerHTML = stats.recentSessions.map((session) => `
            <article class="session-trend-card">
                <div class="session-trend-top">
                    <strong>${session.section === 'all' ? 'Mixed Practice Session' : session.section}</strong>
                    <span>${session.label}</span>
                </div>
                <div class="session-trend-metrics">
                    <span>${session.score}/${session.total}</span>
                    <span>${session.accuracy}% accuracy</span>
                    <span>${session.skipped} skipped</span>
                    <span>${HPCLCommon.formatDurationMs(session.avgTimeMs)} average pace</span>
                </div>
            </article>
        `).join('');
    }

    function renderTopicList(id, list, emptyMsg) {
        const container = document.getElementById(id);
        if (!container) return;

        if (list.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card">
                    <i class="fas fa-satellite-dish"></i>
                    <p>${emptyMsg}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = list.map((topic) => `
            <article class="topic-signal-card">
                <div class="metric-row-head">
                    <strong>${topic.name}</strong>
                    <span>${topic.accuracy}%</span>
                </div>
                <p>${topic.correct}/${topic.attempts} correct, ${topic.skipped} skipped, ${HPCLCommon.formatDurationMs(topic.avgTimeMs)} average pace</p>
            </article>
        `).join('');
    }

    function bindExport() {
        document.getElementById('exportAnalyticsBtn')?.addEventListener('click', () => {
            HPCLCommon.downloadText('hpcl-analytics-summary.txt', ScholarStorage.exportProgressReport());
        });
        document.getElementById('resetAnalyticsBtn')?.addEventListener('click', () => {
            ScholarStorage.clearHistory();
        });
    }

    function initAnalyzePage() {
        const stats = ScholarStorage.getStats();

        if (!stats || !stats.dataQuality) {
            return;
        }

        // Handle Analytics View
        if (document.getElementById('analyticsView')) {
            renderOverview(stats);
            renderMasterMeter(stats);
            renderRecommendations(stats);
            renderTopicSignals(stats);
            renderCoverage(stats);
            renderDifficulty(stats);
            renderComparison(stats);
            renderConfidenceStats(stats);
            renderMistakeBreakdown(stats);
            renderRecentSessions(stats);
            bindExport();
        }

        // Handle Strategy/Vault View
        if (document.getElementById('strategyView')) {
            renderVault(stats);
        }
    }

    function renderVault(stats) {
        const container = document.getElementById('vaultContent');
        if (!container) return;

        const masteredTopics = stats.topicPerformance.filter(t => t.isMastered);

        if (masteredTopics.length === 0) {
            container.innerHTML = `
                <div class="card history-empty" style="background: var(--bg-main); border: 1px dashed var(--border-subtle);">
                    <i class="fas fa-lock history-empty-icon" style="opacity: 0.3;"></i>
                    <p>Your vault is empty. Achieve a 3-question correct streak in any topic to archive it here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = masteredTopics.map(topic => `
            <div class="topic-signal-item">
                <div class="topic-signal-info">
                    <span class="topic-name">${topic.topic}</span>
                    <span class="topic-meta">${topic.count} Attempts • ${topic.accuracy}% Accuracy</span>
                </div>
                <span class="signal-tag signal-tag-success">MASTERED</span>
            </div>
        `).join('');
    }

    function renderMistakeBreakdown(stats) {
        const panel = document.getElementById('mistakePanel');
        if (!panel) return;

        panel.innerHTML = stats.mistakeBreakdown.map((m) => `
            <article class="stat">
                <div class="stat-head">
                    <strong>${m.label}</strong>
                    <span class="stat-accuracy">${m.count}</span>
                </div>
                <p>${getMistakeDetail(m.label)}</p>
            </article>
        `).join('');
    }

    function renderConfidenceStats(stats) {
        const panel = document.getElementById('confidencePanel');
        if (!panel) return;

        panel.innerHTML = [
            simpleMetricCard('Avg Confidence', stats.confidenceStats.averageLevel, 'Scaled 0.0 to 3.0'),
            simpleMetricCard('Confident Errors', stats.confidenceStats.highConfidenceWrong, 'High-confidence wrong answers'),
            simpleMetricCard('Signal Strength', `${stats.confidenceStats.measured} tags`, 'Total questions with confidence data')
        ].join('');
    }

    function getMistakeDetail(label) {
        switch (label) {
            case 'Concept Confusion': return 'Questions where you spent enough time but still got it wrong.';
            case 'Speed Pressure': return 'Questions answered in < 25s but were incorrect.';
            case 'Careless Change': return 'You had the right answer but changed it to a wrong one.';
            case 'Random Guess': return 'Extremely fast (< 10s) incorrect answers.';
            default: return 'Needs more session history to categorize.';
        }
    }

    function overviewCard(label, value, detail) {
        return `
            <article class="stat">
                <div class="stat-head">
                    <strong>${label}</strong>
                    <span class="stat-accuracy">${value}</span>
                </div>
                <p>${detail}</p>
            </article>
        `;
    }

    function simpleMetricCard(label, value, detail) {
        return `
            <article class="metric-row-card">
                <span class="tiny-pill">${label}</span>
                <strong>${value}</strong>
                <p>${detail}</p>
            </article>
        `;
    }

    window.HPCLAnalyze = {
        initAnalyzePage
    };
})();
