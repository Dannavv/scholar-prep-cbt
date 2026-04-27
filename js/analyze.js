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

    function renderTopicList(targetId, topics, emptyMessage) {
        const panel = document.getElementById(targetId);
        if (!panel) return;

        if (!topics.length) {
            panel.innerHTML = `<p class="helper-text">${emptyMessage}</p>`;
            return;
        }

        panel.innerHTML = topics.map((topic) => `
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
        if (!document.getElementById('analyze')) return;
        const stats = ScholarStorage.getStats();
        
        // Safety check to prevent blank page on data inconsistency
        if (!stats || !stats.dataQuality) {
            console.error('ScholarStorage.getStats() returned incomplete data.');
            return;
        }

        renderOverview(stats);
        renderRecommendations(stats);
        renderComparison(stats);
        renderTopicSignals(stats);
        renderCoverage(stats);
        renderDifficulty(stats);
        renderRecentSessions(stats);
        bindExport();
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
