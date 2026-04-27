const STORAGE_KEYS = {
    history: 'hpcl_history',
    seen: 'hpcl_seen',
    mastery: 'hpcl_mastery',
    mastered: 'hpcl_mastered',
    questionProgress: 'hpcl_question_progress'
};

const ScholarStorage = {
    saveResult(result) {
        const existingHistory = this.getHistory();
        const history = [result, ...existingHistory];
        localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history.slice(0, 15)));

        const seen = this.getSeen();
        const mastery = this.getMastery();
        const storedQuestionProgress = readParsedObject(STORAGE_KEYS.questionProgress);
        const questionProgress = Object.keys(storedQuestionProgress).length > 0
            ? storedQuestionProgress
            : rebuildQuestionProgressFromHistory(existingHistory);

        result.allQData.forEach((item) => {
            seen.add(item.id);

            if (!mastery[item.topic]) {
                mastery[item.topic] = {
                    correct: 0,
                    total: 0,
                    skipped: 0,
                    totalTimeMs: 0
                };
            }

            mastery[item.topic].total += 1;
            mastery[item.topic].totalTimeMs += item.timeSpentMs || 0;

            if (item.isSkipped) {
                mastery[item.topic].skipped += 1;
            }

            if (item.isCorrect) {
                mastery[item.topic].correct += 1;
            }

            updateQuestionProgressEntry(questionProgress, item);
        });

        localStorage.setItem(STORAGE_KEYS.seen, JSON.stringify([...seen]));
        localStorage.setItem(STORAGE_KEYS.mastery, JSON.stringify(mastery));
        localStorage.setItem(STORAGE_KEYS.questionProgress, JSON.stringify(questionProgress));
        localStorage.setItem(STORAGE_KEYS.mastered, JSON.stringify([...this.deriveMasteredIds(questionProgress)]));
    },

    getMasteredIds() {
        return this.deriveMasteredIds(this.getQuestionProgress());
    },

    deriveMasteredIds(questionProgress) {
        return new Set(
            Object.entries(questionProgress)
                .filter(([, stats]) => {
                    const attempts = stats.attempts || 0;
                    const correct = stats.correct || 0;
                    const streak = stats.correctStreak || 0;
                    return attempts >= 2 && correct >= 2 && streak >= 2;
                })
                .map(([id]) => id)
        );
    },

    clearHistory() {
        if (confirm('Clear all attempt history and progress?')) {
            Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
            location.reload();
        }
    },

    getHistory() {
        return readParsedArray(STORAGE_KEYS.history);
    },

    getSeen() {
        return new Set(readParsedArray(STORAGE_KEYS.seen));
    },

    getMastery() {
        return readParsedObject(STORAGE_KEYS.mastery);
    },

    getQuestionProgress() {
        const stored = readParsedObject(STORAGE_KEYS.questionProgress);
        if (Object.keys(stored).length > 0) return stored;

        const rebuilt = rebuildQuestionProgressFromHistory(this.getHistory());
        if (Object.keys(rebuilt).length > 0) {
            localStorage.setItem(STORAGE_KEYS.questionProgress, JSON.stringify(rebuilt));
        }
        return rebuilt;
    },

    getStats() {
        const history = this.getHistory();
        const seen = this.getSeen();
        const mastery = this.getMastery();
        const questionProgress = this.getQuestionProgress();
        
        const questions = allQuestions;
        if (!this._questionMap || this._lastQuestionCount !== questions.length) {
            this._questionMap = new Map(questions.map((q) => [q.id, q]));
            this._sectionNames = [...new Set(questions.map((q) => q.section))];
            this._difficultyNames = [...new Set(questions.map((q) => q.difficulty))];
            this._topicNames = [...new Set(questions.map((q) => q.topic))];
            this._lastQuestionCount = questions.length;
        }

        const questionMap = this._questionMap;
        const sectionNames = this._sectionNames;
        const difficultyNames = this._difficultyNames;
        const topicNames = this._topicNames;

        const sections = Object.fromEntries(sectionNames.map((name) => [name, createBucket(name)]));
        const difficulties = Object.fromEntries(difficultyNames.map((name) => [name, createBucket(name)]));
        const topics = Object.fromEntries(topicNames.map((name) => [name, createBucket(name)]));
        const coverageBySection = Object.fromEntries(sectionNames.map((name) => [name, { seen: 0, total: 0 }]));
        const seenByDifficulty = Object.fromEntries(difficultyNames.map((name) => [name, new Set()]));
        const seenByTopic = Object.fromEntries(topicNames.map((name) => [name, new Set()]));
        const questionSessionCounts = new Map();

        allQuestions.forEach((question) => {
            coverageBySection[question.section].total += 1;
        });

        const orderedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
        const sessionSeries = [];
        const sectionTrendSeries = Object.fromEntries(sectionNames.map((name) => [name, []]));

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

        orderedHistory.forEach((session, index) => {
            const sessionItems = normalizeSessionItems(session.allQData, questionMap);
            const attempted = sessionItems.filter((item) => !item.isSkipped).length;
            const correct = sessionItems.filter((item) => item.isCorrect).length;
            const skipped = sessionItems.length - attempted;
            const accuracy = attempted > 0 ? percent(correct, attempted) : 0;
            const avgTimeMs = average(sessionItems.map((item) => item.timeSpentMs || 0));

            sessionSeries.push({
                id: `${session.date}-${index}`,
                date: session.date,
                label: HPCLCommon.formatDate(session.date),
                score: correct,
                total: sessionItems.length,
                attempted,
                skipped,
                accuracy,
                avgTimeMs,
                section: session.section
            });

            sectionNames.forEach((sectionName) => {
                const items = sessionItems.filter((item) => item.section === sectionName);
                const sectionAttempted = items.filter((item) => !item.isSkipped).length;
                const sectionCorrect = items.filter((item) => item.isCorrect).length;
                sectionTrendSeries[sectionName].push({
                    date: session.date,
                    label: HPCLCommon.formatDate(session.date),
                    accuracy: sectionAttempted > 0 ? percent(sectionCorrect, sectionAttempted) : 0,
                    sampleSize: items.length,
                    section: session.section
                });
            });

            sessionItems.forEach((item) => {
                if (item.confidenceLevel > 0) {
                    confidenceCount += 1;
                    confidenceWeighted += item.confidenceLevel;
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

                questionSessionCounts.set(item.id, (questionSessionCounts.get(item.id) || 0) + 1);
            });
        });

        seen.forEach((id) => {
            const question = questionMap.get(id);
            if (!question) return;
            if (coverageBySection[question.section]) coverageBySection[question.section].seen += 1;
            if (seenByDifficulty[question.difficulty]) seenByDifficulty[question.difficulty].add(id);
            if (seenByTopic[question.topic]) seenByTopic[question.topic].add(id);
        });

        const overallAccuracy = totalAttempted > 0 ? percent(totalCorrect, totalAttempted) : 0;
        const totalQuestions = allQuestions.length;
        const coverage = totalQuestions > 0 ? percent(seen.size, totalQuestions) : 0;
        const averageTimePerQuestionMs = average(
            orderedHistory.flatMap((session) =>
                normalizeSessionItems(session.allQData, questionMap).map((item) => item.timeSpentMs || 0)
            )
        );
        const firstTryAccuracy = firstTryTotal > 0 ? percent(firstTryCorrect, firstTryTotal) : 0;

        const sectionArray = finalizeBuckets(sections).map((section) => ({
            ...section,
            coverage: coverageBySection[section.name].total > 0
                ? percent(coverageBySection[section.name].seen, coverageBySection[section.name].total)
                : 0
        }));
        const difficultyArray = finalizeBuckets(difficulties).map((difficulty) => ({
            ...difficulty,
            coverage: allQuestions.filter((question) => question.difficulty === difficulty.name).length > 0
                ? percent(seenByDifficulty[difficulty.name].size, allQuestions.filter((question) => question.difficulty === difficulty.name).length)
                : 0
        }));
        const topicArray = finalizeBuckets(topics).map((topic) => ({
            ...topic,
            coverage: allQuestions.filter((question) => question.topic === topic.name).length > 0
                ? percent(seenByTopic[topic.name].size, allQuestions.filter((question) => question.topic === topic.name).length)
                : 0
        }));

        const weakestTopics = [...topicArray]
            .filter((topic) => topic.attempts > 0)
            .sort((a, b) => a.accuracy - b.accuracy || b.wrong - a.wrong || a.attempts - b.attempts)
            .slice(0, 3);
        const strongestTopics = [...topicArray]
            .filter((topic) => topic.attempts > 0)
            .sort((a, b) => b.accuracy - a.accuracy || b.correct - a.correct)
            .slice(0, 3);

        const recentSessions = sessionSeries.slice(-5);
        const recentAccuracy = average(recentSessions.map((session) => session.accuracy));
        const previousSessions = sessionSeries.slice(-10, -5);
        const previousAccuracy = average(previousSessions.map((session) => session.accuracy));
        const trendDelta = recentSessions.length > 0
            ? Math.round(recentAccuracy - (previousSessions.length > 0 ? previousAccuracy : overallAccuracy))
            : 0;

        const hardBucket = difficultyArray.find((item) => item.name === 'Hard');
        const sectionBalanceScore = computeSectionBalance(sectionArray);
        const readiness = history.length === 0
            ? 0
            : Math.round(
                (recentAccuracy * 0.45)
                + (coverage * 0.25)
                + (sectionBalanceScore * 0.15)
                + ((hardBucket?.accuracy || 0) * 0.15)
            );

        const focusSection = [...sectionArray]
            .filter((section) => section.attempts > 0)
            .sort((a, b) => a.accuracy - b.accuracy || a.coverage - b.coverage)[0] || null;

        const leastPracticedSection = [...sectionArray]
            .sort((a, b) => a.coverage - b.coverage || a.total - b.total)[0] || null;

        const repeatedWeakQuestions = [...questionSessionCounts.entries()]
            .filter(([, count]) => count > 1)
            .map(([id, count]) => {
                const question = questionMap.get(id);
                return {
                    id,
                    count,
                    topic: question?.topic || 'Unknown',
                    section: question?.section || 'Unknown'
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        const latestSession = sessionSeries.at(-1) || null;
        const previousComparableSession = latestSession
            ? [...sessionSeries]
                .slice(0, -1)
                .reverse()
                .find((session) => sessionsAreComparable(session, latestSession)) || null
            : null;

        const comparison = latestSession ? {
            latest: latestSession,
            previous: previousComparableSession,
            deltaAccuracy: previousComparableSession ? latestSession.accuracy - previousComparableSession.accuracy : 0,
            deltaAttempted: previousComparableSession ? latestSession.attempted - previousComparableSession.attempted : 0
        } : null;

        const confidenceStats = {
            measured: confidenceCount,
            averageLevel: confidenceCount > 0 ? round1(confidenceWeighted / confidenceCount) : 0,
            highConfidenceWrong,
            highConfidenceWrongRate: confidenceCount > 0 ? percent(highConfidenceWrong, confidenceCount) : 0
        };

        const mistakeBreakdown = [
            { label: 'Concept Confusion', count: conceptualWrong },
            { label: 'Speed Pressure', count: speedPressureWrong },
            { label: 'Careless Change', count: carelessWrong },
            { label: 'Random Guess', count: guessedFastWrong }
        ];

        const recommendations = buildRecommendations({
            coverage,
            sectionArray,
            difficultyArray,
            weakestTopics,
            confidenceStats,
            comparison,
            leastPracticedSection
        });

        return {
            history,
            attempts: history.length,
            coverage,
            seenCount: seen.size,
            accuracy: overallAccuracy,
            totalQuestions,
            totalAttempted,
            totalCorrect,
            totalSkipped,
            averageTimePerQuestionMs,
            firstTryAccuracy,
            readiness,
            trendDelta,
            sections,
            sectionArray,
            difficulties,
            difficultyArray,
            topics,
            topicArray,
            topicMastery: mastery,
            questionProgress,
            coverageBySection,
            strongestTopics,
            weakestTopics,
            focusSection,
            leastPracticedSection,
            sessionSeries,
            recentSessions: [...recentSessions].reverse(),
            sectionTrendSeries,
            comparison,
            confidenceStats,
            mistakeBreakdown,
            repeatedWeakQuestions,
            recommendations,
            dataQuality: {
                enoughHistory: history.length >= 3,
                enoughCoverage: seen.size >= Math.max(4, Math.ceil(totalQuestions * 0.4)),
                confidenceCoverage: confidenceCount >= 3,
                note: buildDataQualityNote(history.length, seen.size, totalQuestions)
            }
        };
    },

    exportProgressReport() {
        const stats = this.getStats();
        const weakest = stats.weakestTopics.map((topic) => `${topic.name} (${topic.accuracy}% accuracy)`).join(', ') || 'No weak-topic signal yet';
        const strongest = stats.strongestTopics.map((topic) => `${topic.name} (${topic.accuracy}% accuracy)`).join(', ') || 'No strong-topic signal yet';
        const recommendations = stats.recommendations.map((item, index) => `${index + 1}. ${item.title}: ${item.detail}`).join('\n');

        return [
            'HPCL Scholar Progress Summary',
            `Generated: ${new Date().toLocaleString()}`,
            '',
            `Readiness Score: ${stats.readiness}`,
            `Overall Accuracy: ${stats.accuracy}%`,
            `Coverage: ${stats.coverage}% (${stats.seenCount} of ${stats.totalQuestions} questions seen)`,
            `Practice Sessions: ${stats.attempts}`,
            `First-Try Accuracy: ${stats.firstTryAccuracy}%`,
            `Average Time per Question: ${HPCLCommon.formatDurationMs(stats.averageTimePerQuestionMs)}`,
            '',
            `Strongest Topics: ${strongest}`,
            `Weakest Topics: ${weakest}`,
            '',
            'Recommendations:',
            recommendations || '1. Build more attempt history to unlock stronger recommendations.'
        ].join('\n');
    }
};

function readParsedArray(key) {
    const parsed = safeParseStorage(key, []);
    return Array.isArray(parsed) ? parsed : [];
}

function readParsedObject(key) {
    const parsed = safeParseStorage(key, {});
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

function safeParseStorage(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    try {
        return JSON.parse(raw);
    } catch {
        localStorage.removeItem(key);
        return fallback;
    }
}

function rebuildQuestionProgressFromHistory(history) {
    const progress = {};
    const questionMap = new Map(allQuestions.map((question) => [question.id, question]));
    const orderedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    orderedHistory.forEach((session) => {
        normalizeSessionItems(session.allQData, questionMap).forEach((item) => {
            updateQuestionProgressEntry(progress, item);
        });
    });

    return progress;
}

function updateQuestionProgressEntry(progress, item) {
    if (!progress[item.id]) {
        progress[item.id] = {
            attempts: 0,
            correct: 0,
            skipped: 0,
            correctStreak: 0,
            lastResult: 'unseen',
            totalTimeMs: 0
        };
    }

    const entry = progress[item.id];
    entry.attempts += 1;
    entry.totalTimeMs += item.timeSpentMs || 0;

    if (item.isSkipped) {
        entry.skipped += 1;
        entry.correctStreak = 0;
        entry.lastResult = 'skipped';
        return;
    }

    if (item.isCorrect) {
        entry.correct += 1;
        entry.correctStreak += 1;
        entry.lastResult = 'correct';
    } else {
        entry.correctStreak = 0;
        entry.lastResult = 'wrong';
    }
}

function createBucket(name) {
    return {
        name,
        total: 0,
        attempts: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
        totalTimeMs: 0,
        totalAnswerChanges: 0,
        highConfidenceWrong: 0
    };
}

function incrementBucket(bucket, item) {
    if (!bucket) return;

    bucket.total += 1;
    bucket.totalTimeMs += item.timeSpentMs || 0;
    bucket.totalAnswerChanges += item.answerChanges || 0;

    if (item.isSkipped) {
        bucket.skipped += 1;
        return;
    }

    bucket.attempts += 1;
    if (item.isCorrect) {
        bucket.correct += 1;
    } else {
        bucket.wrong += 1;
    }

    if (item.confidence === 'high' && !item.isCorrect) {
        bucket.highConfidenceWrong += 1;
    }
}

function finalizeBuckets(collection) {
    return Object.values(collection).map((bucket) => ({
        ...bucket,
        accuracy: bucket.attempts > 0 ? percent(bucket.correct, bucket.attempts) : 0,
        coverage: bucket.total > 0 ? percent(bucket.attempts + bucket.skipped, bucket.total) : 0,
        avgTimeMs: bucket.total > 0 ? Math.round(bucket.totalTimeMs / bucket.total) : 0,
        avgAnswerChanges: bucket.total > 0 ? round1(bucket.totalAnswerChanges / bucket.total) : 0
    }));
}

function normalizeSessionItems(items = [], questionMap) {
    const safeItems = Array.isArray(items) ? items : [];

    return safeItems.map((item) => {
        const question = questionMap.get(item.id) || {};
        const isSkipped = typeof item.isSkipped === 'boolean'
            ? item.isSkipped
            : !item.userAnswer;
        const correctAnswer = item.correctAnswer || question.answer || '';
        const confidence = item.confidence || 'none';
        const confidenceLevel = confidence === 'high' ? 3 : confidence === 'medium' ? 2 : confidence === 'low' ? 1 : 0;

        return {
            ...item,
            section: item.section || question.section || 'Unknown',
            topic: item.topic || question.topic || 'Unknown',
            difficulty: item.difficulty || question.difficulty || 'Unknown',
            correctAnswer,
            isSkipped,
            confidence,
            confidenceLevel,
            timeSpentMs: item.timeSpentMs || 0,
            answerChanges: item.answerChanges || 0,
            firstAnswer: item.firstAnswer || null
        };
    });
}

function buildRecommendations(input) {
    const recommendations = [];

    if (input.weakestTopics[0]) {
        recommendations.push({
            title: `Revise ${input.weakestTopics[0].name}`,
            detail: `${input.weakestTopics[0].accuracy}% accuracy across ${input.weakestTopics[0].attempts} attempted questions makes this your clearest revision target.`
        });
    }

    if (input.leastPracticedSection && input.leastPracticedSection.coverage < 60) {
        recommendations.push({
            title: `Increase ${input.leastPracticedSection.name} coverage`,
            detail: `Only ${input.leastPracticedSection.coverage}% of this section has been seen so far, so your signal is still shallow here.`
        });
    }

    const hardBucket = input.difficultyArray.find((item) => item.name === 'Hard');
    if (hardBucket && hardBucket.attempts > 0 && hardBucket.accuracy < 50) {
        recommendations.push({
            title: 'Strengthen hard-question conversion',
            detail: `Hard-question accuracy is ${hardBucket.accuracy}%, which is the clearest advanced-area drag right now.`
        });
    }

    if (input.confidenceStats.highConfidenceWrong > 0) {
        recommendations.push({
            title: 'Review confident mistakes',
            detail: `${input.confidenceStats.highConfidenceWrong} wrong answers were marked high-confidence, so revisit concepts you felt sure about.`
        });
    }

    if (input.comparison && input.comparison.previous && input.comparison.deltaAccuracy < 0) {
        recommendations.push({
            title: 'Stabilize recent form',
            detail: `Your latest comparable session dropped ${Math.abs(input.comparison.deltaAccuracy)} points versus the previous one.`
        });
    }

    if (input.coverage < 50) {
        recommendations.push({
            title: 'Broaden question exposure',
            detail: `Only ${input.coverage}% of the bank has been seen so far, so topic rankings can still move around.`
        });
    }

    if (recommendations.length === 0) {
        recommendations.push({
            title: 'Keep momentum steady',
            detail: 'Current signals look balanced. Keep practicing mixed sessions and protect your accuracy on hard questions.'
        });
    }

    return recommendations.slice(0, 4);
}

function buildDataQualityNote(attempts, seenCount, totalQuestions) {
    if (attempts === 0) return 'No attempts yet. Complete one session to unlock analytics.';
    if (attempts < 3) return 'Early signal only. Trends become more reliable after at least 3 sessions.';
    if (seenCount < Math.ceil(totalQuestions * 0.5)) return 'Coverage is still limited, so topic rankings may shift as you attempt more unique questions.';
    return 'Sample size is strong enough for directional coaching.';
}

function computeSectionBalance(sectionArray) {
    if (sectionArray.every((section) => section.coverage === 0)) return 0;
    const coverages = sectionArray.map((section) => section.coverage);
    const spread = Math.max(...coverages, 0) - Math.min(...coverages, 0);
    return Math.max(0, 100 - spread);
}

function sessionsAreComparable(a, b) {
    if (!a || !b) return false;
    return a.section === b.section || a.section === 'all' || b.section === 'all';
}

function average(values) {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percent(part, total) {
    return total > 0 ? Math.round((part / total) * 100) : 0;
}

function round1(value) {
    return Math.round(value * 10) / 10;
}
