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
        
        // Extract ordered topics from paper2Questions
        const topics = [];
        paper2Questions.forEach((q) => {
            if (!topics.includes(q.topic)) {
                topics.push(q.topic);
            }
        });

        const topicGroups = topics.map(topicName => {
            const topicQuestions = paper2Questions.filter(q => q.topic === topicName);
            return {
                topic: topicName,
                section: topicQuestions[0].section,
                difficulties: new Set(topicQuestions.map(q => q.difficulty))
            };
        });

        grid.innerHTML = topicGroups.map((group, index) => {
            // Check if we have paper2TopicNotes available
            const notes = typeof paper2TopicNotes !== 'undefined' && paper2TopicNotes[group.topic] 
                ? paper2TopicNotes[group.topic] 
                : { summary: `Detailed study of ${group.topic} for Paper 2.` };

            const stats = mastery[group.topic] || { correct: 0, total: 0 };
            const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            
            let icon = 'fa-microchip';
            if (group.section.includes('DBMS')) icon = 'fa-database';
            if (group.section.includes('Algorithm')) icon = 'fa-project-diagram';
            if (group.section.includes('Operating')) icon = 'fa-server';
            if (group.section.includes('Computation')) icon = 'fa-cogs';

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
                sessionStorage.setItem('paper2LearnScrollPosition', window.scrollY);
                window.location.href = `cheatsheet.html?topic=${encodeURIComponent(button.dataset.topic)}`;
            });
        });
    }

    function restoreScrollPosition() {
        const savedPosition = sessionStorage.getItem('paper2LearnScrollPosition');
        if (savedPosition) {
            window.scrollTo({
                top: parseInt(savedPosition, 10),
                behavior: 'instant'
            });
            sessionStorage.removeItem('paper2LearnScrollPosition');
        }
    }

    function renderSubjectGrid() {
        const grid = document.getElementById('subjectGrid');
        if (!grid) return;

        const subjects = [
            { name: 'Theory of Computation', icon: 'fa-cogs', color: '#ec4899', detail: 'Automata, Languages, Turing Machines' },
            { name: 'DBMS', icon: 'fa-database', color: '#14b8a6', detail: 'SQL, Normalization, Transactions' },
            { name: 'Operating Systems', icon: 'fa-server', color: '#f59e0b', detail: 'Processes, Memory, Deadlocks' },
            { name: 'COA', icon: 'fa-microchip', color: '#6366f1', detail: 'Digital Logic, Architecture, Pipelining' },
            { name: 'Algorithms', icon: 'fa-project-diagram', color: '#8b5cf6', detail: 'Greedy, DP, Graph Theory' },
            { name: 'Computer Networks', icon: 'fa-network-wired', color: '#2563eb', detail: 'OSI, IP, TCP/UDP' },
            { name: 'Software Engineering', icon: 'fa-tools', color: '#059669', detail: 'SDLC, Testing, Metrics' },
            { name: 'Programming', icon: 'fa-code', color: '#dc2626', detail: 'OOP, Java, Pointers' }
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
        
            </div>
        `).join('');

        grid.querySelectorAll('[data-subject-link]').forEach(card => {
            card.addEventListener('click', () => {
                sessionStorage.setItem('paper2LearnScrollPosition', window.scrollY);
                // Currently pointing to paper2-subject-notes.html (will ask user to build this or I can wire it)
                window.location.href = `paper2-subject-notes.html?subject=${encodeURIComponent(card.dataset.subjectLink)}`;
            });
        });
    }

    function initLearnPage() {
        if (!document.getElementById('paper2-learn')) return;
        renderSubjectGrid();
        renderTopicGrid();
        restoreScrollPosition();

        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                sessionStorage.setItem('paper2LearnScrollPosition', window.scrollY);
            });
        });
    }

    window.HPCLPaper2Learn = {
        initLearnPage
    };
})();
