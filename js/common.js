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
    const combined = (typeof paper2Questions !== 'undefined') ? [...allQuestions, ...paper2Questions] : allQuestions;
    return combined.filter((question) => {
        if (section === 'all') return true;
        if (Array.isArray(section)) return section.includes(question.section);
        return question.section === section;
    });
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

function setupSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main');
    if (!toggleBtn || !sidebar || !main) return;

    // Load initial state
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        main.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
        const nowCollapsed = sidebar.classList.toggle('collapsed');
        main.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', nowCollapsed);
    });
}

function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function getOrderedTopics(pool) {
    const topics = [];
    const source = pool || ((typeof paper2Questions !== 'undefined') ? [...allQuestions, ...paper2Questions] : allQuestions);
    source.forEach((q) => {
        if (!topics.includes(q.topic)) {
            topics.push(q.topic);
        }
    });
    return topics;
}

function logActivity(action, details = {}) {
    try {
        const data = {
            action: action,
            url: window.location.pathname,
            time: new Date().toISOString(),
            ...details
        };
        const url = '/api/sync?data=' + encodeURIComponent(JSON.stringify(data));
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url);
        } else {
            fetch(url, { method: 'GET', keepalive: true }).catch(() => {});
        }
    } catch (e) {
        // Ignore tracking errors
    }
}

document.addEventListener('DOMContentLoaded', () => {
    logActivity('page_view', { title: document.title });
});

document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a, .card, .nav-item');
    if (!el) return;
    
    let label = el.innerText || el.value || el.id || '';
    label = label.replace(/[\r\n]+/g, ' ').trim().substring(0, 50);
    
    if (el.tagName === 'A') {
        logActivity('click_link', { href: el.getAttribute('href'), label: label });
    } else if (el.tagName === 'BUTTON') {
        logActivity('click_button', { id: el.id, label: label });
    } else {
        logActivity('click_element', { classes: el.className, label: label });
    }
}, { passive: true });

window.HPCLCommon = {
    downloadText,
    formatDate,
    formatDurationMs,
    getOrderedTopics,
    getQuestionPool,
    setupMouseMotion,
    setupSidebarToggle,
    stripHtml,
    logActivity
};
