function setupMouseMotion() {
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    if (!finePointerQuery.matches) return;

    document.body.classList.add('mouse-motion');
    window.addEventListener('pointermove', (e) => {
        document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
        document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    }, { passive: true });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getQuestionPool(section = 'all') {
    return allQuestions.filter((question) => section === 'all' || question.section === section);
}

function formatDurationMs(ms) {
    const totalSeconds = Math.max(0, Math.round((ms || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}

function downloadText(filename, content, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

window.HPCLCommon = {
    downloadText,
    formatDate,
    formatDurationMs,
    getQuestionPool,
    setupMouseMotion
};
