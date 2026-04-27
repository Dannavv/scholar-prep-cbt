(function () {
    let activeModalTrigger = null;

    function buildDifficultyPills(difficulties) {
        return [...difficulties]
            .map((difficulty) => `<span class="tiny-pill">${difficulty}</span>`)
            .join('');
    }

    function renderTopicGrid() {
        const grid = document.getElementById('topicGrid');
        if (!grid) return;

        const mastery = ScholarStorage.getMastery();
        const topicGroups = Object.values(allQuestions.reduce((groups, question) => {
            if (!groups[question.topic]) {
                groups[question.topic] = {
                    topic: question.topic,
                    section: question.section,
                    difficulties: new Set()
                };
            }

            groups[question.topic].difficulties.add(question.difficulty);
            return groups;
        }, {}));

        grid.innerHTML = topicGroups.map((group) => {
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

                    <h3 class="topic-card-title">${group.topic}</h3>

                    <div class="topic-card-summary">
                        <p>${notes.summary.substring(0, 110)}...</p>
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
            button.addEventListener('click', () => openModal(button.dataset.topic, button));
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

    function openModal(topicId, trigger) {
        const notes = getTopicNote(topicId);

        const modal = document.getElementById('explanationModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        if (!modal || !title || !body) return;

        activeModalTrigger = trigger || document.activeElement;
        title.textContent = `Cheat Sheet: ${topicId}`;

        const formulaItems = notes.formula
            .split(/\. (?=[A-Z0-9(])|\.\s*$/)
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => `<li>${item}${item.endsWith('.') ? '' : '.'}</li>`)
            .join('');

        body.innerHTML = `
            <div class="topic-meta topic-meta-spaced">
                <span class="badge">High Yield Topic</span>
            </div>

            <div class="modal-section-title"><i class="fas fa-bookmark"></i> Concept Summary</div>
            <p>${notes.summary}</p>

            <div class="modal-section-title"><i class="fas fa-scroll"></i> Standard Formula / Rule</div>
            <div class="formula-box">
                <ul class="formula-list">${formulaItems}</ul>
            </div>

            <div class="modal-section-title"><i class="fas fa-lightbulb"></i> Key Heuristics & Details</div>
            <p>${notes.details}</p>

            <div class="modal-section-title"><i class="fas fa-pencil-alt"></i> Worked Example</div>
            <div class="worked-example">
                <div class="example-text">${notes.example || 'Refer to practice questions for worked examples.'}</div>
            </div>

            <button class="btn btn-primary modal-dismiss-btn" type="button">
                <i class="fas fa-check-circle"></i> Got it, Back to Mastery
            </button>
        `;

        body.querySelector('.modal-dismiss-btn')?.addEventListener('click', closeModal);
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal-content').scrollTop = 0;
        modal.querySelector('.close-modal')?.focus();
    }

    function closeModal() {
        const modal = document.getElementById('explanationModal');
        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (activeModalTrigger && typeof activeModalTrigger.focus === 'function') {
            activeModalTrigger.focus();
        }
    }

    function bindModalInteractions() {
        const modal = document.getElementById('explanationModal');
        if (!modal) return;

        modal.querySelector('.close-modal')?.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function initLearnPage() {
        if (!document.getElementById('learn')) return;
        renderTopicGrid();
        updateDashboard();
        bindModalInteractions();
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
