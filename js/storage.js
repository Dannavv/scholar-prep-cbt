const ScholarStorage = {
    saveResult(result) {
        const history = this.getHistory();
        history.unshift(result);
        localStorage.setItem('hpcl_history', JSON.stringify(history.slice(0, 15)));

        const seen = this.getSeen();
        const mastery = this.getMastery();
        const masteredIds = this.getMasteredIds(); // New: Track correct IDs separately

        result.allQData.forEach(item => {
            seen.add(item.id);
            if (!mastery[item.topic]) mastery[item.topic] = { correct: 0, total: 0 };
            mastery[item.topic].total++;
            if (item.isCorrect) {
                mastery[item.topic].correct++;
                masteredIds.add(item.id); // Add to Mastered Library
            }
        });

        localStorage.setItem('hpcl_seen', JSON.stringify([...seen]));
        localStorage.setItem('hpcl_mastered', JSON.stringify([...masteredIds])); // Persist Mastered Library
        localStorage.setItem('hpcl_mastery', JSON.stringify(mastery));
    },
    getMasteredIds() {
        const raw = localStorage.getItem('hpcl_mastered');
        return new Set(raw ? JSON.parse(raw) : []);
    },
    clearHistory() {
        if (confirm("Clear all attempt history and progress?")) {
            localStorage.removeItem('hpcl_history');
            localStorage.removeItem('hpcl_seen');
            localStorage.removeItem('hpcl_mastery');
            location.reload();
        }
    },
    getHistory() {
        const raw = localStorage.getItem('hpcl_history');
        return raw ? JSON.parse(raw) : [];
    },
    getSeen() {
        const raw = localStorage.getItem('hpcl_seen');
        return new Set(raw ? JSON.parse(raw) : []);
    },
    getMastery() {
        const raw = localStorage.getItem('hpcl_mastery');
        return raw ? JSON.parse(raw) : {};
    },
    getStats() {
        const history = this.getHistory();
        const seen = this.getSeen();
        const mastery = this.getMastery();

        const sections = {
            'Quantitative Aptitude': { correct: 0, total: 0 },
            'Reasoning': { correct: 0, total: 0 },
            'English Language': { correct: 0, total: 0 }
        };

        Object.keys(mastery).forEach(topic => {
            const q = allQuestions.find(item => item.topic === topic);
            if (q && sections[q.section]) {
                sections[q.section].correct += mastery[topic].correct;
                sections[q.section].total += mastery[topic].total;
            }
        });

        const totalAttempted = history.reduce((sum, r) => sum + r.total, 0);
        const totalCorrect = history.reduce((sum, r) => sum + r.score, 0);
        const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

        return {
            history,
            coverage: seen.size,
            accuracy,
            attempts: history.length,
            sections,
            topicMastery: mastery
        };
    }
};
