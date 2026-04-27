(function () {

    function buildDifficultyPills(difficulties) {
        return [...difficulties]
            .map((difficulty) => `<span class="tiny-pill">${difficulty}</span>`)
            .join('');
    }

    function renderTopicGrid() {
        const grid = document.getElementById('topicGrid');
        if (!grid) return;

        const mastery = ScholarStorage.getMastery();
        const topics = HPCLCommon.getOrderedTopics();
        const topicGroups = topics.map(topicName => {
            const topicQuestions = allQuestions.filter(q => q.topic === topicName);
            return {
                topic: topicName,
                section: topicQuestions[0].section,
                difficulties: new Set(topicQuestions.map(q => q.difficulty))
            };
        });

        grid.innerHTML = topicGroups.map((group, index) => {
            const notes = getTopicNote(group.topic, group.section);
            const stats = mastery[group.topic] || { correct: 0, total: 0 };
            const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            const icon = group.section.includes('Quant')
                ? 'fa-calculator'
                : group.section.includes('English')
                    ? 'fa-book-open'
                    : 'fa-brain';

            return `
                <article class="card topic-card">
                    <div class="topic-card-top">
                        <div class="topic-card-heading">
                            <div class="topic-card-icon">
                                <i class="fas ${icon}"></i>
                            </div>
                            <span class="topic-pill topic-pill-tight">${group.section}</span>
                        </div>
                        <div class="topic-badges">${buildDifficultyPills(group.difficulties)}</div>
                    </div>

                    <h3 class="topic-card-title">${index + 1}. ${group.topic}</h3>

                    <div class="topic-card-summary">
                        <p>${HPCLCommon.stripHtml(notes.summary).length > 110 ? HPCLCommon.stripHtml(notes.summary).substring(0, 110) + '...' : HPCLCommon.stripHtml(notes.summary)}</p>
                    </div>

                    <div class="mastery-card">
                        <div class="mastery-card-head">
                            <span>Topic Mastery</span>
                            <span>${accuracy}%</span>
                        </div>
                        <div class="mastery-track" aria-hidden="true">
                            <div class="mastery-fill ${accuracy >= 80 ? 'mastery-fill-success' : ''}" style="width: ${accuracy}%;"></div>
                        </div>
                    </div>

                    <button class="btn btn-primary topic-open-btn" type="button" data-topic="${group.topic}">
                        <i class="fas fa-file-alt"></i> Open Cheat Sheet
                    </button>
                </article>
            `;
        }).join('');

        grid.querySelectorAll('[data-topic]').forEach((button) => {
            button.addEventListener('click', () => {
                sessionStorage.setItem('learnScrollPosition', window.scrollY);
                window.location.href = `cheatsheet.html?topic=${encodeURIComponent(button.dataset.topic)}`;
            });
        });
    }

    function updateDashboard() {
        const dashboard = document.getElementById('statRow');
        if (!dashboard) return;

        const stats = ScholarStorage.getStats();
        const focusText = stats.focusSection ? `${stats.focusSection.name} needs the most help right now.` : 'Start a session to identify your weakest section.';
        const weakTopicText = stats.weakestTopics[0] ? stats.weakestTopics[0].name : 'No weak-topic signal yet';

        dashboard.innerHTML = [
            summaryCard('Readiness', `${stats.readiness}`, `Overall exam-readiness signal. Trend: ${stats.trendDelta >= 0 ? '+' : ''}${stats.trendDelta} pts.`),
            summaryCard('Coverage', `${stats.coverage}%`, `${stats.attempts} sessions logged. ${focusText}`),
            summaryCard('First-Try Accuracy', `${stats.firstTryAccuracy}%`, 'Shows whether your first instinct is usually right.'),
            summaryCard('Weakest Topic', weakTopicText, stats.weakestTopics[0] ? `${stats.weakestTopics[0].accuracy}% accuracy so far.` : 'Attempt more questions for topic-level coaching.')
        ].join('');
    }

    function restoreScrollPosition() {
        const savedPosition = sessionStorage.getItem('learnScrollPosition');
        if (savedPosition) {
            window.scrollTo({
                top: parseInt(savedPosition, 10),
                behavior: 'instant'
            });
            sessionStorage.removeItem('learnScrollPosition');
        }
    }

    function renderSubjectGrid() {
        const grid = document.getElementById('subjectGrid');
        if (!grid) return;

        const subjects = [
            { name: 'Quantitative Aptitude', icon: 'fa-calculator', color: '#3b82f6', detail: '34% Weight • Arithmetic, DI, Speed Math' },
            { name: 'Reasoning', icon: 'fa-brain', color: '#8b5cf6', detail: '33% Weight • Logic, Puzzles, Series' },
            { name: 'English Language', icon: 'fa-language', color: '#10b981', detail: '33% Weight • Grammar, Vocab, RC' }
        ];

        grid.innerHTML = subjects.map(sub => `
            <div class="card topic-card subject-note-card" data-subject-link="${sub.name}" style="border-top: 6px solid ${sub.color};">
                <div class="topic-card-heading">
                    <div class="topic-card-icon" style="color: ${sub.color}; background: ${sub.color}15;">
                        <i class="fas ${sub.icon}"></i>
                    </div>
                    <h3 class="topic-card-title" style="color: ${sub.color}; margin: 0;">${sub.name}</h3>
                </div>
                <div class="topic-pill topic-pill-tight" style="font-size: 0.85rem; width: fit-content;">
                    ${sub.detail}
                </div>
                <div class="topic-card-summary" style="margin-top: 0.5rem;">
                    <p style="font-weight: 600; color: ${sub.color}; display: flex; align-items: center; gap: 0.5rem;">
                        Concept Blueprint <i class="fas fa-arrow-right"></i>
                    </p>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('[data-subject-link]').forEach(card => {
            card.addEventListener('click', () => {
                sessionStorage.setItem('learnScrollPosition', window.scrollY);
                window.location.href = `subject-notes.html?subject=${encodeURIComponent(card.dataset.subjectLink)}`;
            });
        });
    }

    function initLearnPage() {
        if (!document.getElementById('learn')) return;
        renderSubjectGrid();
        renderTopicGrid();
        updateDashboard();
        restoreScrollPosition();

        // Save scroll when navigating away via sidebar
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                sessionStorage.setItem('learnScrollPosition', window.scrollY);
            });
        });
    }

    function summaryCard(label, value, detail) {
        return `
            <div class="stat">
                <div class="stat-head">
                    <strong>${label}</strong>
                    <span class="stat-accuracy stat-accuracy-compact">${value}</span>
                </div>
                <p>${detail}</p>
            </div>
        `;
    }

    window.HPCLLearn = {
        initLearnPage
    };
})();
