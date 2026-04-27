const HISTORY_LIMIT = 200;

const STORAGE_KEYS = {
    history: 'hpcl_history_v1',
    seen: 'hpcl_seen_questions_v1',
    mastery: 'hpcl_topic_mastery_v1',
    questionProgress: 'hpcl_q_progress_v1',
    mastered: 'hpcl_mastered_questions_v1'
};

const ScholarStorage = {
    saveResult(result) {
        if (!result || !result.allQData) {
            console.error('Invalid result object passed to saveResult');
            return;
        }

        const existingHistory = this.getHistory();
        const history = [result, ...existingHistory];
        try {
            localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
        } catch (e) {
            console.error('Failed to save history to localStorage:', e);
        }

        const seen = this.getSeen();
        const mastery = this.getMastery();
        const questionProgress = this.getQuestionProgress();

        result.allQData.forEach((item) => {
            if (!item) return;
            seen.add(item.id);
            updateTopicMastery(mastery, item);
            updateQuestionProgressEntry(questionProgress, item);
        });

        try {
            localStorage.setItem(STORAGE_KEYS.seen, JSON.stringify([...seen]));
            localStorage.setItem(STORAGE_KEYS.mastery, JSON.stringify(mastery));
            localStorage.setItem(STORAGE_KEYS.questionProgress, JSON.stringify(questionProgress));
            localStorage.setItem(STORAGE_KEYS.mastered, JSON.stringify([...this.deriveMasteredIds(questionProgress)]));
        } catch (e) {
            console.error('Failed to save progress to localStorage:', e);
        }
    },

    getMasteredIds() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.mastered);
            return new Set(stored ? JSON.parse(stored) : []);
        } catch (e) {
            console.error('Failed to parse mastered IDs:', e);
            return new Set();
        }
    },

    getHistory() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.history);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse history:', e);
            return [];
        }
    },

    getSeen() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.seen);
            return new Set(stored ? JSON.parse(stored) : []);
        } catch (e) {
            console.error('Failed to parse seen questions:', e);
            return new Set();
        }
    },

    getMastery() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.mastery);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Failed to parse mastery:', e);
            return {};
        }
    },

    getQuestionProgress() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.questionProgress);
            const existingHistory = this.getHistory();
            const storedQuestionProgress = stored ? JSON.parse(stored) : {};

            const questionProgress = Object.keys(storedQuestionProgress).length > 0
                ? storedQuestionProgress
                : rebuildQuestionProgressFromHistory(existingHistory);

            return questionProgress;
        } catch (e) {
            console.error('Failed to parse question progress:', e);
            return {};
        }
    },

    getStats() {
        const history = this.getHistory();
        const seen = this.getSeen();
        const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

        const sections = {};
        const topics = {};
        const difficulties = {};
        const coverageBySection = {};
        const totalByDifficulty = { 'Easy': 0, 'Medium': 0, 'Hard': 0 };
        const seenByDifficulty = { 'Easy': new Set(), 'Medium': new Set(), 'Hard': new Set() };
        const totalByTopic = {};
        const seenByTopic = {};
        const questionSessionCounts = new Map();

        allQuestions.forEach((question) => {
            if (!sections[question.section]) sections[question.section] = createBucket(question.section);
            if (!topics[question.topic]) topics[question.topic] = createBucket(question.topic);
            if (!difficulties[question.difficulty]) difficulties[question.difficulty] = createBucket(question.difficulty);

            if (!coverageBySection[question.section]) {
                coverageBySection[question.section] = { seen: 0, total: 0 };
            }
            coverageBySection[question.section].total += 1;

            if (!totalByTopic[question.topic]) totalByTopic[question.topic] = 0;
            totalByTopic[question.topic] += 1;

            if (!seenByTopic[question.topic]) seenByTopic[question.topic] = new Set();
            
            if (totalByDifficulty[question.difficulty] !== undefined) totalByDifficulty[question.difficulty] += 1;
        });

        const orderedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
        const sessionSeries = [];
        const recentSessions = [];

        let totalAttempted = 0;
        let totalCorrect = 0;
        let totalSkipped = 0;
        let firstTryTotal = 0;
        let firstTryCorrect = 0;
        let highConfidenceWrong = 0;
        let confidenceCount = 0;
        let confidenceWeighted = 0;
        let guessedFastWrong = 0;
        let carelessWrong = 0;
        let speedPressureWrong = 0;
        let conceptualWrong = 0;

        let recentAttempts = 0;
        let recentCorrect = 0;
        let previousAttempts = 0;
        let previousCorrect = 0;

        orderedHistory.forEach((session, index) => {
            try {
                if (!session || !session.allQData || !Array.isArray(session.allQData)) return;
                
                const sessionItems = normalizeSessionItems(session.allQData, questionMap);
                const attempted = sessionItems.filter((item) => !item.isSkipped).length;
                const correct = sessionItems.filter((item) => item.isCorrect).length;
                const skipped = sessionItems.length - attempted;
                const accuracy = attempted > 0 ? percent(correct, attempted) : 0;

                const isRecent = (orderedHistory.length - index) <= 15;
                const isPrevious = (orderedHistory.length - index) === 2;

                sessionSeries.push({
                    id: `${session.date}-${index}`,
                    date: session.date,
                    label: HPCLCommon.formatDate(session.date),
                    score: correct,
                    total: sessionItems.length,
                    attempted,
                    skipped,
                    accuracy,
                    avgTimeMs: session.totalDurationSeconds ? Math.round((session.totalDurationSeconds * 1000) / sessionItems.length) : 0,
                    section: session.section
                });

                if (isRecent) {
                    recentSessions.unshift(formatSessionSummary(session, accuracy, correct, skipped));
                }

                sessionItems.forEach((item) => {
                    const confidenceVal = confidenceValue(item.confidence);
                    if (confidenceVal > 0) {
                        confidenceCount += 1;
                        confidenceWeighted += confidenceVal;
                    }

                    incrementBucket(sections[item.section], item);
                    incrementBucket(difficulties[item.difficulty], item);
                    incrementBucket(topics[item.topic], item);

                    if (!item.isSkipped) {
                        totalAttempted += 1;
                    } else {
                        totalSkipped += 1;
                    }

                    if (item.isCorrect) {
                        totalCorrect += 1;
                    }

                    if (item.firstAnswer) {
                        firstTryTotal += 1;
                        if (item.firstAnswer === item.correctAnswer) {
                            firstTryCorrect += 1;
                        }
                    }

                    if (item.confidence === 'high' && !item.isCorrect) {
                        highConfidenceWrong += 1;
                    }

                    if (item.mistakeType === 'Random Guess') guessedFastWrong += 1;
                    if (item.mistakeType === 'Careless Change') carelessWrong += 1;
                    if (item.mistakeType === 'Speed Pressure') speedPressureWrong += 1;
                    if (item.mistakeType === 'Concept Confusion') conceptualWrong += 1;

                    if (isRecent) {
                        recentAttempts++;
                        if (item.isCorrect) recentCorrect++;
                    }

                    if (isPrevious) {
                        previousAttempts++;
                        if (item.isCorrect) previousCorrect++;
                    }

                    questionSessionCounts.set(item.id, (questionSessionCounts.get(item.id) || 0) + 1);
                });
            } catch (err) {
                console.error(`Skipping corrupted session at index ${index}:`, err);
            }
        });

        seen.forEach((id) => {
            const question = questionMap.get(id);
            if (!question) return;
            if (coverageBySection[question.section]) coverageBySection[question.section].seen += 1;
            if (seenByDifficulty[question.difficulty]) seenByDifficulty[question.difficulty].add(id);
            if (seenByTopic[question.topic]) seenByTopic[question.topic].add(id);
        });

        const overallAccuracy = totalAttempted > 0 ? percent(totalCorrect, totalAttempted) : 0;
        const recentAccuracy = recentAttempts > 0 ? percent(recentCorrect, recentAttempts) : 0;
        const previousAccuracy = previousAttempts > 0 ? percent(previousCorrect, previousAttempts) : 0;
        
        const totalQuestions = allQuestions.length;
        const coverage = totalQuestions > 0 ? percent(seen.size, totalQuestions) : 0;
        const firstTryAccuracy = firstTryTotal > 0 ? percent(firstTryCorrect, firstTryTotal) : 0;

        const sectionArray = finalizeBuckets(sections).map((section) => ({
            ...section,
            coverage: percent(coverageBySection[section.name].seen, coverageBySection[section.name].total)
        }));

        const topicPerformance = finalizeBuckets(topics).map((topic) => {
            const masteredIds = this.deriveMasteredIds(this.getQuestionProgress());
            const topicQuestionIds = allQuestions.filter(q => q.topic === topic.name).map(q => q.id);
            const isMastered = topicQuestionIds.length > 0 && topicQuestionIds.every(id => masteredIds.has(id));
            
            return {
                topic: topic.name,
                count: topic.attempts,
                accuracy: topic.accuracy,
                isMastered
            };
        });

        const sectionBalanceScore = computeSectionBalance(sectionArray);
        const volumeMultiplier = Math.min(1, history.length / 5);

        const readiness = history.length === 0
            ? 0
            : Math.round(
                ((recentAccuracy * 0.45)
                    + (coverage * 0.25)
                    + (sectionBalanceScore * 0.15)
                    + ((finalizeBuckets(difficulties).find(d => d.name === 'Hard')?.accuracy || 0) * 0.15)) * volumeMultiplier
            );

        return {
            readiness,
            accuracy: overallAccuracy,
            coverage,
            history,
            attempts: history.length,
            totalQuestions,
            totalCorrect,
            totalSkipped,
            recentSessions: recentSessions.slice(0, 15),
            trendDelta: recentAccuracy - previousAccuracy,
            firstTryAccuracy,
            focusSection: sectionArray.sort((a, b) => a.accuracy - b.accuracy)[0],
            recommendations: buildRecommendations({
                accuracy: overallAccuracy,
                coverage,
                sectionArray,
                mistakes: {
                    guessedFastWrong,
                    carelessWrong,
                    speedPressureWrong,
                    conceptualWrong
                }
            }),
            strongestTopics: finalizeBuckets(topics).sort((a, b) => b.accuracy - a.accuracy).slice(0, 3),
            weakestTopics: finalizeBuckets(topics).filter(t => t.attempts >= 3).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3),
            sectionArray,
            difficultyArray: finalizeBuckets(difficulties).map(d => ({
                ...d,
                coverage: percent(seenByDifficulty[d.name].size, totalByDifficulty[d.name])
            })),
            topicPerformance,
            confidenceStats: {
                averageLevel: (confidenceCount > 0 ? (confidenceWeighted / confidenceCount) : 0).toFixed(1),
                highConfidenceWrong,
                measured: confidenceCount
            },
            mistakeBreakdown: [
                { label: 'Concept Confusion', count: conceptualWrong },
                { label: 'Speed Pressure', count: speedPressureWrong },
                { label: 'Careless Change', count: carelessWrong },
                { label: 'Random Guess', count: guessedFastWrong }
            ],
            dataQuality: {
                enoughHistory: history.length >= 3,
                note: history.length < 3 ? 'Add more sessions for reliable trends.' : 'Trends are becoming stable.'
            },
            comparison: history.length >= 2 ? {
                latest: recentSessions[0],
                previous: recentSessions[1],
                deltaAccuracy: recentAccuracy - previousAccuracy
            } : null
        };
    },

    clearHistory() {
        if (confirm('Are you sure you want to clear all history and mastery data?')) {
            localStorage.removeItem(STORAGE_KEYS.history);
            localStorage.removeItem(STORAGE_KEYS.seen);
            localStorage.removeItem(STORAGE_KEYS.mastery);
            localStorage.removeItem(STORAGE_KEYS.questionProgress);
            localStorage.removeItem(STORAGE_KEYS.mastered);
            window.location.reload();
        }
    },

    deriveMasteredIds(questionProgress) {
        const mastered = new Set();
        if (!questionProgress) return mastered;
        Object.entries(questionProgress).forEach(([id, stats]) => {
            if (stats && stats.streak >= 3) {
                mastered.add(id);
            }
        });
        return mastered;
    }
};

// Helper Functions
function createBucket(name) {
    return { name, attempts: 0, correct: 0, skipped: 0, totalTime: 0 };
}

function incrementBucket(bucket, item) {
    if (!bucket) return;
    bucket.attempts += 1;
    if (item.isCorrect) bucket.correct += 1;
    if (item.isSkipped) bucket.skipped += 1;
    bucket.totalTime += (item.timeSpentMs || 0);
}

function finalizeBuckets(bucketMap) {
    return Object.values(bucketMap).map((b) => ({
        ...b,
        accuracy: b.attempts > 0 ? Math.round((b.correct / b.attempts) * 100) : 0,
        avgTimeMs: b.attempts > 0 ? Math.round(b.totalTime / b.attempts) : 0
    }));
}

function normalizeSessionItems(allQData, questionMap) {
    if (!Array.isArray(allQData)) return [];
    return allQData.map((item) => {
        const q = questionMap.get(item.id);
        return {
            ...item,
            section: q?.section || item.section,
            topic: q?.topic || item.topic,
            difficulty: q?.difficulty || item.difficulty
        };
    });
}

function updateTopicMastery(mastery, item) {
    if (!item || !item.topic) return;
    if (!mastery[item.topic]) mastery[item.topic] = { correct: 0, total: 0 };
    mastery[item.topic].total += 1;
    if (item.isCorrect) mastery[item.topic].correct += 1;
}

function updateQuestionProgressEntry(progress, item) {
    if (!item || !item.id) return;
    if (!progress[item.id]) progress[item.id] = { streak: 0, total: 0, correct: 0 };
    const p = progress[item.id];
    p.total += 1;
    if (item.isCorrect) {
        p.correct += 1;
        p.streak += 1;
    } else {
        p.streak = 0;
    }
}

function rebuildQuestionProgressFromHistory(history) {
    const progress = {};
    if (!Array.isArray(history)) return progress;
    [...history].reverse().forEach((session) => {
        if (!session || !Array.isArray(session.allQData)) return;
        session.allQData.forEach((item) => {
            updateQuestionProgressEntry(progress, item);
        });
    });
    return progress;
}

function formatSessionSummary(session, accuracy, score, skipped) {
    return {
        label: HPCLCommon.formatDate(session.date),
        accuracy,
        score,
        total: session.total,
        skipped,
        section: session.section,
        avgTimeMs: session.totalDurationSeconds ? Math.round((session.totalDurationSeconds * 1000) / session.total) : 0
    };
}

function computeSectionBalance(sectionArray) {
    if (!Array.isArray(sectionArray) || sectionArray.length === 0) return 0;
    const coverages = sectionArray.map((s) => s.coverage || 0);
    const min = Math.min(...coverages);
    const max = Math.max(...coverages);
    return Math.max(0, 100 - (max - min));
}

function buildRecommendations(data) {
    const recs = [];
    if (data.accuracy < 60) recs.push({ title: 'Focus on Fundamentals', detail: 'Your accuracy is below 60%. Try shorter, untimed sessions to build conceptual depth.' });
    if (data.coverage < 30) recs.push({ title: 'Expand Syllabus Reach', detail: 'You have seen less than 30% of the bank. Take "Mixed Practice" sessions to discover new topics.' });
    
    if (Array.isArray(data.sectionArray)) {
        data.sectionArray.filter(s => s.accuracy < 50 && s.attempts > 0).forEach(s => {
            recs.push({ title: `Drill ${s.name}`, detail: `Accuracy in ${s.name} is low. Focused practice here will boost your readiness significantly.` });
        });
    }

    if (data.mistakes && data.mistakes.guessedFastWrong > 5) recs.push({ title: 'Slow Down on Guesses', detail: 'You are making too many fast, incorrect guesses. Use the "Skip" feature instead of guessing.' });
    
    if (recs.length === 0) recs.push({ title: 'Maintain Momentum', detail: 'Consistency is key. Keep taking full-length mock exams to sharpen your competitive edge.' });
    return recs.slice(0, 3);
}

function percent(n, total) {
    return total > 0 ? Math.round((n / total) * 100) : 0;
}

function average(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function confidenceValue(value) {
    if (value === 'high') return 3;
    if (value === 'medium') return 2;
    if (value === 'low') return 1;
    return 0;
}
