(function () {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function renderCheatSheet() {
        const topicId = getQueryParam('topic');
        if (!topicId) {
            window.location.replace('learn.html');
            return;
        }

        const notes = getTopicNote(topicId);
        const container = document.getElementById('cheatsheetContent');
        
        document.getElementById('topicTitle').textContent = topicId;
        
        const formulaItems = notes.formula
            .split(/\.\s+(?=[A-Z0-9(])|\.\s*$/)
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => `<li>${item}${item.endsWith('.') ? '' : '.'}</li>`)
            .join('');

        const topics = HPCLCommon.getOrderedTopics();
        const currentIndex = topics.indexOf(topicId);
        const prevTopic = topics[currentIndex - 1];
        const nextTopic = topics[currentIndex + 1];

        container.innerHTML = `
            <div class="cheatsheet-header">
                <h1 class="cheatsheet-title">${topicId}</h1>
                <div class="topic-meta">
                    <span class="badge"><i class="fas fa-fire"></i> High Yield Topic</span>
                    <span class="badge" style="background: color-mix(in srgb, var(--accent-2) 10%, transparent); color: var(--accent-2);"><i class="fas fa-microchip"></i> Core Module</span>
                </div>
            </div>

            <div class="cheatsheet-section">
                <div class="section-header">
                    <i class="fas fa-bookmark"></i>
                    <h2>Concept Summary</h2>
                </div>
                <div class="content-card">
                    <p class="summary-text">${notes.summary}</p>
                </div>
            </div>

            <div class="cheatsheet-section">
                <div class="section-header">
                    <i class="fas fa-scroll"></i>
                    <h2>Standard Formula / Rule</h2>
                </div>
                <div class="content-card">
                    <div class="formula-box">
                        <ul class="formula-list">${formulaItems}</ul>
                    </div>
                </div>
            </div>

            <div class="cheatsheet-section">
                <div class="section-header">
                    <i class="fas fa-lightbulb"></i>
                    <h2>Key Heuristics & Details</h2>
                </div>
                <div class="content-card">
                    <p class="details-text">${notes.details}</p>
                </div>
            </div>

            <div class="cheatsheet-section">
                <div class="section-header">
                    <i class="fas fa-pencil-alt"></i>
                    <h2>Worked Example</h2>
                </div>
                <div class="content-card">
                    <div class="worked-example">
                        <div class="example-text">
                            ${notes.example ? notes.example.replace(/\n/g, '<br>') : 'Refer to practice questions for worked examples.'}
                        </div>
                    </div>
                </div>
            </div>

            <div class="cheatsheet-footer">
                ${prevTopic ? `
                    <a href="cheatsheet.html?topic=${encodeURIComponent(prevTopic)}" class="btn btn-outline">
                        <i class="fas fa-chevron-left"></i> Previous Topic
                    </a>
                ` : ''}
                
                <a href="learn.html" class="btn btn-outline">
                    <i class="fas fa-arrow-left"></i> Back to Guide
                </a>

                ${nextTopic ? `
                    <a href="cheatsheet.html?topic=${encodeURIComponent(nextTopic)}" class="btn btn-primary">
                        Next Topic <i class="fas fa-chevron-right"></i>
                    </a>
                ` : ''}
            </div>
        `;
    }

    document.addEventListener('DOMContentLoaded', renderCheatSheet);
})();
