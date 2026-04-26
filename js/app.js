let filteredQuestions = [];
let currentIdx = 0;
let responses = {};
let examTimer;
let secondsRemaining = 0;

function init() {
  setupMouseMotion();
  renderTopicGrid();
  renderHistory();
  updateDashboard();
}

function setupMouseMotion() {
  const finePointerQuery = window.matchMedia('(pointer: fine)');
  if (!finePointerQuery.matches) return;
  document.body.classList.add('mouse-motion');
  window.addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
    document.documentElement.style.setProperty('--my', `${e.clientY}px`);
  }, { passive: true });
}

function openModal(topicId) {
    const notes = topicNotes[topicId];
    if (!notes) return;

    const modal = document.getElementById('explanationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.innerHTML = `Cheat Sheet: ${topicId}`;

    const formulaHTML = notes.formula
        .split(/\. (?=[A-Z0-9])|\.\s*$/)
        .filter(s => s.trim().length > 0)
        .map(s => `<div style="margin-bottom: 0.8rem;">• ${s.trim()}${s.endsWith('.') ? '' : '.'}</div>`)
        .join('');

    modalBody.innerHTML = `
        <div class="topic-meta" style="margin-bottom: 2rem;">
            <span class="badge" style="background: rgba(161,136,127,0.1); color: #5d4037;">High Yield Topic</span>
        </div>
        
        <div class="modal-section-title"><i class="fas fa-bookmark"></i> Concept Summary</div>
        <p>${notes.summary}</p>
        
        <div class="modal-section-title"><i class="fas fa-scroll"></i> Standard Formula / Rule</div>
        <div class="formula-box">${formulaHTML}</div>
        
        <div class="modal-section-title"><i class="fas fa-lightbulb"></i> Key Heuristics & Details</div>
        <p>${notes.details}</p>
        
        <div class="modal-section-title"><i class="fas fa-pencil-alt"></i> Worked Example</div>
        <div class="worked-example">
            <div class="example-text">${notes.example || 'Refer to practice questions for worked examples.'}</div>
        </div>

        <button class="btn btn-primary" onclick="closeModal()" style="width: 100%; margin-top: 4rem; padding: 1.8rem; font-size: 1.6rem; border-radius: 20px;">
            <i class="fas fa-check-circle"></i> Got it, Back to Mastery
        </button>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-content').scrollTop = 0;
}

function closeModal() {
    const modal = document.getElementById('explanationModal');
    if(modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderTopicGrid() {
    const grid = document.getElementById('topicGrid');
    if(!grid) return;
    const mastery = ScholarStorage.getMastery();
    
    const topicGroups = Object.values(allQuestions.reduce((groups, q) => {
        if (!groups[q.topic]) groups[q.topic] = { topic: q.topic, section: q.section, difficulties: new Set() };
        groups[q.topic].difficulties.add(q.difficulty);
        return groups;
    }, {}));

    grid.innerHTML = topicGroups.map(group => {
        const notes = topicNotes[group.topic] || { summary: 'Detailed study of this pattern...', formula: 'See details.' };
        const stats = mastery[group.topic] || { correct: 0, total: 0 };
        const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        const diffPills = [...group.difficulties].map(d => `<span class="tiny-pill">${d}</span>`).join('');

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <span class="topic-pill">${group.section}</span>
                    <div style="display: flex; gap: 0.3rem;">${diffPills}</div>
                </div>
                <h3 style="margin: 1.5rem 0 1rem; font-size: 1.6rem;">${group.topic}</h3>
                
                <div style="margin-bottom: 2rem; border-left: 4px solid var(--accent); padding-left: 1rem;">
                    <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.5;">${notes.summary.substring(0, 90)}...</p>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 800; margin-bottom: 0.8rem; color: var(--primary);">
                        <span>Mastery Progress</span><span>${acc}%</span>
                    </div>
                    <div style="height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; border: 1px solid rgba(0,0,0,0.03);">
                        <div style="height: 100%; width: ${acc}%; background: ${acc >= 80 ? 'var(--success)' : 'var(--accent)'}; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 10px rgba(159,115,80,0.2);"></div>
                    </div>
                </div>

                <button class="btn btn-primary" style="width: 100%; padding: 1.2rem; font-size: 1.1rem;" onclick="openModal('${group.topic}')">
                   <i class="fas fa-file-invoice"></i> Open Cheat Sheet
                </button>
            </div>
        `;
    }).join('');
}

function updateDashboard() {
    const stats = ScholarStorage.getStats();
    const dashboard = document.getElementById('statRow');
    if (!dashboard) {
        renderHistory();
        return;
    }
    
    // ... existing dashboard code ...
    dashboard.innerHTML = Object.entries(stats.sections).map(([name, data]) => {
        const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        const color = acc >= 80 ? 'var(--success)' : acc >= 50 ? 'var(--warning)' : 'var(--danger)';
        return `
            <div class="stat" style="border-left-color: ${color}">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <strong style="font-size: 1rem; color: var(--text-muted);">${name}</strong>
                    <span style="font-size: 2.2rem; font-weight: 900; color: ${color};">${acc}%</span>
                </div>
                <div style="height: 6px; background: rgba(0,0,0,0.04); border-radius: 3px; margin-top: 0.5rem; overflow: hidden;">
                    <div style="height: 100%; width: ${acc}%; background: ${color}; transition: width 1s ease-out;"></div>
                </div>
            </div>
        `;
    }).join('');
    
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    const history = ScholarStorage.getHistory();
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <i class="fas fa-history" style="font-size: 3rem; color: var(--border); margin-bottom: 1.5rem;"></i>
                <p style="font-size: 1.2rem; color: var(--text-muted);">No mock exams attempted yet. Start your first practice drill to see your growth!</p>
            </div>
        `;
        return;
    }
    historyList.innerHTML = history.reverse().map(h => {
        const acc = Math.round((h.score / h.total) * 100);
        const color = acc >= 80 ? 'var(--success)' : acc >= 50 ? 'var(--warning)' : 'var(--danger)';
        return `
            <div class="card" style="margin-bottom: 1.5rem; border-left: 6px solid ${color};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 1.4rem; margin-bottom: 0.3rem;">${h.section === 'all' ? 'Full Mock Exam' : h.section}</h4>
                        <p style="font-size: 1.1rem; color: var(--text-muted);">${new Date(h.date).toLocaleDateString()} • ${h.total} Questions</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.8rem; font-weight: 900; color: ${color};">${h.score} / ${h.total}</div>
                        <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-muted);">${acc}% ACCURACY</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function prepareExam() {
    const length = parseInt(document.getElementById('examLength').value);
    const section = document.getElementById('examSection').value;
    filteredQuestions = allQuestions.filter(q => (section === 'all' || q.section === section)).sort(() => 0.5 - Math.random()).slice(0, length);
    currentIdx = 0; responses = {}; secondsRemaining = filteredQuestions.length * 52;
    document.getElementById('examHome').style.display = 'none';
    document.getElementById('examActive').style.display = 'block';
    renderQuestion(); startTimer();
}

function renderQuestion() {
    const q = filteredQuestions[currentIdx];
    document.getElementById('progress').innerText = `Question ${currentIdx + 1} / ${filteredQuestions.length}`;
    document.getElementById('qText').innerText = q.question;
    const list = document.getElementById('optionsList');
    list.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const label = String.fromCharCode(97 + idx);
        const item = document.createElement('div');
        item.className = `option-item ${responses[currentIdx] === label ? 'selected' : ''}`;
        item.innerHTML = `<div class="option-circle">${label.toUpperCase()}</div><span>${opt}</span>`;
        item.onclick = () => { responses[currentIdx] = label; renderQuestion(); };
        list.appendChild(item);
    });
    document.getElementById('prevBtn').disabled = (currentIdx === 0);
}

function navigateQuestion(dir) {
    if (dir === 1 && currentIdx === filteredQuestions.length - 1) {
        if(confirm("Submit exam?")) submitExam();
        return;
    }
    currentIdx += dir; renderQuestion();
}

function startTimer() {
    if(examTimer) clearInterval(examTimer);
    examTimer = setInterval(() => {
        secondsRemaining--;
        const mins = Math.floor(secondsRemaining / 60); const secs = secondsRemaining % 60;
        document.getElementById('timer').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (secondsRemaining <= 0) submitExam();
    }, 1000);
}

function submitExam() {
    clearInterval(examTimer);
    let score = 0;
    filteredQuestions.forEach((q, idx) => { if(responses[idx] === q.answer) score++; });
    ScholarStorage.saveResult({ date: new Date().toISOString(), score, total: filteredQuestions.length, section: document.getElementById('examSection').value, allQData: filteredQuestions.map((q, idx) => ({ id: q.id, topic: q.topic, isCorrect: responses[idx] === q.answer })) });
    location.reload();
}

window.onload = init;

function toggleScribblePad() {
    const pad = document.getElementById('scribblePad');
    if (!pad) return;
    pad.style.display = pad.style.display === 'none' ? 'flex' : 'none';
    if (pad.style.display === 'flex') {
        document.getElementById('scribbleText').focus();
    }
}
