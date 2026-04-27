const ScholarStorage = {
    saveResult(result) {
        const history = this.getHistory();
        history.unshift(result);
        localStorage.setItem('hpcl_history', JSON.stringify(history.slice(0, 15)));

        const seen = this.getSeen();
        const mastery = this.getMastery();
        const masteredIds = this.getMasteredIds();

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
                masteredIds.add(item.id);
            }
        });

        localStorage.setItem('hpcl_seen', JSON.stringify([...seen]));
        localStorage.setItem('hpcl_mastered', JSON.stringify([...masteredIds]));
        localStorage.setItem('hpcl_mastery', JSON.stringify(mastery));
    },

    getMasteredIds() {
        const raw = localStorage.getItem('hpcl_mastered');
        return new Set(raw ? JSON.parse(raw) : []);
    },

    clearHistory() {
        if (confirm('Clear all attempt history and progress?')) {
            localStorage.removeItem('hpcl_history');
            localStorage.removeItem('hpcl_seen');
            localStorage.removeItem('hpcl_mastery');
            localStorage.removeItem('hpcl_mastered');
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
        const questionMap = new Map(allQuestions.map((question) => [question.id, question]));
        const sectionNames = [...new Set(allQuestions.map((question) => question.section))];
        const difficultyNames = [...new Set(allQuestions.map((question) => question.difficulty))];
        const topicNames = [...new Set(allQuestions.map((question) => question.topic))];
        const totalsByDifficulty = Object.fromEntries(difficultyNames.map((name) => [name, allQuestions.filter((question) => question.difficulty === name).length]));
        const totalsByTopic = Object.fromEntries(topicNames.map((name) => [name, allQuestions.filter((question) => question.topic === name).length]));

        const sections = Object.fromEntries(sectionNames.map((name) => [name, createBucket(name)]));
        const difficulties = Object.fromEntries(difficultyNames.map((name) => [name, createBucket(name)]));
        const topics = Object.fromEntries(topicNames.map((name) => [name, createBucket(name)]));
        const coverageBySection = Object.fromEntries(sectionNames.map((name) => [name, { seen: 0, total: 0 }]));
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
        let totalTimeMs = 0;
        let totalAnswerChanges = 0;
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
                    sampleSize: items.length
                });
            });

            sessionItems.forEach((item) => {
                totalTimeMs += item.timeSpentMs || 0;
                totalAnswerChanges += item.answerChanges || 0;
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
            if (question && coverageBySection[question.section]) {
                coverageBySection[question.section].seen += 1;
            }
        });

        const overallAccuracy = totalAttempted > 0 ? percent(totalCorrect, totalAttempted) : 0;
        const totalQuestions = allQuestions.length;
        const coverage = totalQuestions > 0 ? percent(seen.size, totalQuestions) : 0;
        const averageTimePerQuestionMs = average(orderedHistory.flatMap((session) => normalizeSessionItems(session.allQData, questionMap).map((item) => item.timeSpentMs || 0)));
        const firstTryAccuracy = firstTryTotal > 0 ? percent(firstTryCorrect, firstTryTotal) : 0;

        const sectionArray = finalizeBuckets(sections).map((section) => ({
            ...section,
            coverage: coverageBySection[section.name].total > 0
                ? percent(coverageBySection[section.name].seen, coverageBySection[section.name].total)
                : 0
        }));
        const difficultyArray = finalizeBuckets(difficulties).map((difficulty) => ({
            ...difficulty,
            coverage: totalsByDifficulty[difficulty.name] > 0
                ? Math.min(100, percent(difficulty.attempts + difficulty.skipped, totalsByDifficulty[difficulty.name]))
                : 0
        }));
        const topicArray = finalizeBuckets(topics).map((topic) => ({
            ...topic,
            coverage: totalsByTopic[topic.name] > 0
                ? Math.min(100, percent(topic.attempts + topic.skipped, totalsByTopic[topic.name]))
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

        const hardestBucket = difficultyArray.find((item) => item.name === 'Hard');
        const sectionBalanceScore = computeSectionBalance(sectionArray);
        const readiness = history.length === 0
            ? 0
            : Math.round(
                (recentAccuracy * 0.35)
                + (coverage * 0.2)
                + (sectionBalanceScore * 0.15)
                + ((hardestBucket?.accuracy || 0) * 0.15)
                + (computeConsistencyScore(sessionSeries) * 0.15)
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
        const previousSession = sessionSeries.at(-2) || null;
        const comparison = latestSession ? {
            latest: latestSession,
            previous: previousSession,
            deltaAccuracy: previousSession ? latestSession.accuracy - previousSession.accuracy : 0,
            deltaAttempted: previousSession ? latestSession.attempted - previousSession.attempted : 0
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
            totalQuestions,
            coverage,
            sectionArray,
            difficultyArray,
            weakestTopics,
            confidenceStats,
            comparison,
            focusSection,
            leastPracticedSection,
            repeatedWeakQuestions
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
            coverageBySection,
            strongestTopics,
            weakestTopics,
            focusSection,
            leastPracticedSection,
            sessionSeries,
            recentSessions: recentSessions.reverse(),
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
    return items.map((item) => {
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
            detail: `${input.weakestTopics[0].accuracy}% accuracy across ${input.weakestTopics[0].attempts} attempted questions makes this your clearest weak area.`
        });
    }

    if (input.leastPracticedSection && input.leastPracticedSection.coverage < 60) {
        recommendations.push({
            title: `Increase ${input.leastPracticedSection.name} coverage`,
            detail: `Only ${input.leastPracticedSection.coverage}% of this section has meaningful history, so your performance signal is still shallow.`
        });
    }

    const hardBucket = input.difficultyArray.find((item) => item.name === 'Hard');
    if (hardBucket && hardBucket.attempts > 0 && hardBucket.accuracy < 50) {
        recommendations.push({
            title: 'Strengthen hard-question conversion',
            detail: `Hard-question accuracy is ${hardBucket.accuracy}%, which suggests advanced problems are dragging your readiness score down.`
        });
    }

    if (input.confidenceStats.highConfidenceWrong > 0) {
        recommendations.push({
            title: 'Audit high-confidence mistakes',
            detail: `${input.confidenceStats.highConfidenceWrong} wrong answers were marked with high confidence, which usually points to concept confusion rather than speed alone.`
        });
    }

    if (input.comparison && input.comparison.previous && input.comparison.deltaAccuracy < 0) {
        recommendations.push({
            title: 'Stabilize recent form',
            detail: `Your latest session dropped ${Math.abs(input.comparison.deltaAccuracy)} points versus the previous one. A shorter, focused drill may help recover consistency.`
        });
    }

    if (input.coverage < 50) {
        recommendations.push({
            title: 'Broaden syllabus coverage',
            detail: `Only ${input.coverage}% of the bank has been seen so far, so your current insights still reflect a partial picture.`
        });
    }

    if (recommendations.length === 0) {
        recommendations.push({
            title: 'Keep momentum steady',
            detail: 'Your current signals look balanced. The next best gain is to keep practicing mixed sessions and watch whether hard-question speed improves.'
        });
    }

    return recommendations.slice(0, 5);
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

function computeConsistencyScore(sessionSeries) {
    if (sessionSeries.length < 2) return sessionSeries[0]?.accuracy || 0;
    const values = sessionSeries.map((session) => session.accuracy);
    const mean = average(values);
    const variance = average(values.map((value) => (value - mean) ** 2));
    return Math.max(0, Math.round(100 - Math.sqrt(variance)));
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
