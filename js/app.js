let filteredQuestions = [];
let currentIdx = 0;
let responses = {};
let examTimer;
let secondsRemaining = 0;
let mobileScrollMode = false;
const mobileModeQuery = window.matchMedia('(max-width: 980px)');
const finePointerQuery = window.matchMedia('(pointer: fine)');

function init() {
  applyViewportMode();
  bindViewportListeners();
  setupActiveSectionTracking();
  setupMouseMotion();
  renderTopicGrid();
  updateDashboard();
}

function bindViewportListeners() {
  mobileModeQuery.addEventListener('change', () => {
    applyViewportMode();
    updateMobileFullscreenPrompt();
  });
  document.addEventListener('fullscreenchange', updateMobileFullscreenPrompt);
}

function applyViewportMode() {
  mobileScrollMode = mobileModeQuery.matches;
  document.body.classList.toggle('mobile-scroll-mode', mobileScrollMode);
  if (!mobileScrollMode) {
    const activeView = document.querySelector('.view.active') || document.getElementById('learn');
    if (activeView) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        activeView.classList.add('active');
    }
  }
}

function updateMobileFullscreenPrompt() {
  const isFS = !!document.fullscreenElement;
  document.body.classList.toggle('app-mode', isFS);
}

function requestFullscreen() {
  if (!document.fullscreenEnabled) return;
  document.documentElement.requestFullscreen().then(() => {
    updateMobileFullscreenPrompt();
  }).catch(err => console.error(err));
}

function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
}

function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
}

function setupActiveSectionTracking() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    if (!mobileScrollMode) return;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === id);
      });
    });
  }, { rootMargin: '-40% 0px -45% 0px', threshold: 0.05 });
  document.querySelectorAll('.view').forEach(section => observer.observe(section));
}

function setupMouseMotion() {
  if (!finePointerQuery.matches) return;
  document.body.classList.add('mouse-motion');
  window.addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
    document.documentElement.style.setProperty('--my', `${e.clientY}px`);
  }, { passive: true });
  bindTiltCards();
}

function bindTiltCards() {
  if (!finePointerQuery.matches) return;
  const cards = document.querySelectorAll('.card, .stat, .strategy-card, .exam-note, .topic-summary, .insight-card');
  cards.forEach(card => {
    if (card.dataset.motionBound === 'true') return;
    card.dataset.motionBound = 'true';
    card.classList.add('tilt-card');
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 5;
      const rotateX = (0.5 - (y / rect.height)) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
}

function switchView(viewId, element) {
  if (mobileScrollMode) {
    const section = document.getElementById(viewId);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const target = document.getElementById(viewId);
  if(target) target.classList.add('active');
  if(element) element.classList.add('active');
}

function updateDashboard() {
    const stats = ScholarStorage.getStats();
    const dashboard = document.getElementById('statRow');
    if (dashboard) {
        const coveragePct = Math.round((stats.coverage / 100) * 100);
        const sectionHTML = Object.entries(stats.sections).map(([name, data]) => {
            const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            const color = acc >= 80 ? 'var(--success)' : acc >= 50 ? 'var(--warning)' : 'var(--danger)';
            return `
                <div style="flex: 1; min-width: 150px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.25rem;">
                        <strong>${name.split(' ')[0]}</strong>
                        <span style="color: ${color}">${acc}% Acc</span>
                    </div>
                    <div style="height: 4px; background: #e2e8f0; border-radius: 2px;">
                        <div style="height: 100%; width: ${acc}%; background: ${color}; transition: width 0.5s;"></div>
                    </div>
                </div>
            `;
        }).join('');

        dashboard.innerHTML = `
            <div class="stat" style="grid-column: span 1; min-height: 120px;">
                <strong>Mastery Score</strong>
                <span style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${stats.accuracy}%</span>
                <span style="font-size: 0.75rem; display: block;">Across ${stats.attempts} practice drills</span>
            </div>
            <div class="stat" style="grid-column: span 1; min-height: 120px;">
                <strong>Bank Coverage</strong>
                <div style="height: 8px; background: #e2e8f0; border-radius: 4px; margin: 0.5rem 0; overflow: hidden;">
                    <div style="height: 100%; width: ${coveragePct}%; background: var(--accent); transition: width 1s ease-out;"></div>
                </div>
                <span style="font-size: 0.75rem;">${stats.coverage} / 100 Unique Qs</span>
            </div>
            <div class="stat" style="grid-column: span 2; display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: space-around;">
                ${sectionHTML}
            </div>
        `;
    }
    renderHistory();
    renderTopicGrid();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    const history = ScholarStorage.getHistory();
    if (history.length === 0) {
        historyList.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No attempts logged yet.</p>';
        return;
    }
    historyList.innerHTML = history.map(h => `
        <div style="display: flex; justify-content: space-between; padding: 0.75rem; border-bottom: 1px solid var(--border); font-size: 0.85rem;">
            <span><strong>${h.score}/${h.total}</strong> on ${h.section === 'all' ? 'Full Mock' : h.section}</span>
            <span style="color: var(--text-muted)">${new Date(h.date).toLocaleDateString()}</span>
        </div>
    `).join('');
}

function renderTopicGrid() {
    const grid = document.getElementById('topicGrid');
    if(!grid) return;
    const mastery = ScholarStorage.getMastery();
    const topicGroups = Object.values(allQuestions.reduce((groups, q) => {
        if (!groups[q.topic]) groups[q.topic] = { topic: q.topic, section: q.section, questions: [], difficulties: new Set() };
        groups[q.topic].questions.push(q);
        groups[q.topic].difficulties.add(q.difficulty);
        return groups;
    }, {}));

    const sectionRank = { 'Quantitative Aptitude': 0, 'Reasoning': 1, 'English Language': 2 };
    topicGroups.sort((a, b) => (sectionRank[a.section] ?? 9) - (sectionRank[b.section] ?? 9) || a.topic.localeCompare(b.topic));

    grid.innerHTML = topicGroups.map(group => {
        const preview = group.questions[0];
        const note = getTopicNote(group.topic, group.section);
        const stats = mastery[group.topic] || { correct: 0, total: 0 };
        const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        const diffPills = [...group.difficulties].map(level => `<span class="tiny-pill">${level}</span>`).join('');

        return `
            <div class="card">
                <span class="topic-pill">${group.section}</span>
                <h3 style="margin: 0.85rem 0 0.5rem;">${group.topic}</h3>
                <div class="topic-meta" style="margin-bottom: 1rem;">${diffPills}</div>
                
                <div style="margin-bottom: 1.25rem;">
                    <p style="font-size: 0.85rem; font-weight: 700; color: var(--primary); margin-bottom: 0.25rem;">The Core Idea:</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${note.summary}</p>
                </div>

                <div style="background: #f1f5f9; padding: 0.75rem; border-radius: 8px; margin-bottom: 1.25rem;">
                    <p style="font-size: 0.75rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Logic / Formula:</p>
                    <code style="font-size: 0.8rem; color: #1e293b; display: block; line-height: 1.4;">${note.formula}</code>
                </div>

                <div style="margin: 1rem 0 1.5rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.3rem;">
                        <span>Topic Mastery</span><span style="color: ${acc >= 80 ? 'var(--success)' : 'var(--warning)'}">${acc}%</span>
                    </div>
                    <div style="height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; width: ${acc}%; background: ${acc >= 80 ? 'var(--success)' : 'var(--accent)'}; transition: width 0.5s;"></div>
                    </div>
                </div>

                <button class="btn btn-primary" style="width: 100%;" onclick="openModal('${preview.id}')">
                   <i class="fas fa-file-invoice"></i> Open Cheat Sheet
                </button>
            </div>
        `;
    }).join('');
    bindTiltCards();
}

function openModal(qid) {
    const q = allQuestions.find(item => item.id === qid);
    const note = getTopicNote(q.topic, q.section);
    const modal = document.getElementById('explanationModal');
    if (!modal) return;
    
    document.getElementById('modalTitle').innerText = `Cheat Sheet: ${q.topic}`;
    document.getElementById('modalBody').innerHTML = `
        <div class="topic-badges" style="margin-bottom: 1.5rem;">
            <span class="badge">${q.section}</span>
            <span class="badge" style="background: #eff6ff; color: #1d4ed8;">High Yield Topic</span>
        </div>
        
        <div class="insight-card" style="background: #fff; padding: 1.25rem; border-left: 6px solid var(--primary); box-shadow: var(--shadow); border-radius: 0 12px 12px 0; margin-bottom: 2rem;">
            <h4 style="margin-bottom: 0.5rem; color: var(--primary);">Concept Summary</h4>
            <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-main);">${note.summary}</p>
        </div>

        <div style="background: #0f172a; color: #f8fafc; padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem; box-shadow: 0 10px 25px -10px rgba(15, 23, 42, 0.4);">
            <h4 style="color: #38bdf8; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem;">Standard Formula / Rule</h4>
            <div style="font-family: 'SFMono-Regular', Consolas, monospace; font-size: 1rem; line-height: 1.5;">${note.formula}</div>
        </div>

        <div style="margin-bottom: 2rem;">
            <h4 style="margin-bottom: 0.75rem; color: var(--primary);">Key Heuristics & Details</h4>
            <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-muted);">${note.details || 'Focus on speed and pattern recognition.'}</p>
        </div>

        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border);">
            <h4 style="margin-bottom: 1rem; color: var(--accent); display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-lightbulb"></i> Worked Example
            </h4>
            <div style="font-size: 0.92rem; line-height: 1.6;">
                ${note.example || '<i>Refer to mock questions for worked examples.</i>'}
            </div>
            <div style="margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px dashed var(--border); font-size: 0.85rem; color: var(--text-muted);">
                <strong>Practice Q:</strong> ${q.question}
            </div>
        </div>

        <div style="margin-top: 2rem; text-align: center;">
            <button class="btn btn-outline" style="width: 100%;" onclick="closeModal()">Close Sheet</button>
        </div>
    `;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('explanationModal');
    if(modal) modal.classList.remove('active');
}

function prepareExam() {
    const length = parseInt(document.getElementById('examLength').value);
    const section = document.getElementById('examSection').value;
    filteredQuestions = allQuestions.filter(q => (section === 'all' || q.section === section)).sort(() => 0.5 - Math.random()).slice(0, length);
    currentIdx = 0; responses = {}; secondsRemaining = filteredQuestions.length * 52;
    document.getElementById('examHome').style.display = 'none';
    document.getElementById('examActive').style.display = 'block';
    document.getElementById('examTitle').innerText = `HPCL Mock (${filteredQuestions.length} Qs)`;
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
    document.getElementById('nextBtn').innerText = (currentIdx === filteredQuestions.length - 1) ? 'Finish & Analyze' : 'Next';
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
    clearInterval(examTimer); let score = 0;
    const report = document.getElementById('analysisReport'); report.innerHTML = '';
    filteredQuestions.forEach((q, idx) => {
        const isCorrect = responses[idx] === q.answer; if(isCorrect) score++;
        const item = document.createElement('div');
        item.className = `analysis-item ${isCorrect ? 'correct' : 'wrong'}`;
        item.innerHTML = `
            <div class="analysis-header" style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 0.5rem;">
                <span>Q${idx+1} (${q.section})</span>
                <span style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}">${isCorrect ? 'CORRECT' : 'WRONG'}</span>
            </div>
            <p style="font-weight: 500; margin-bottom: 1rem;">${q.question}</p>
            <div class="insight-box" style="background: #f1f5f9; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary);">
                <strong>HPCL Logic:</strong> ${q.explanation}
            </div>
        `;
        report.appendChild(item);
    });
    ScholarStorage.saveResult({ date: new Date().toISOString(), score, total: filteredQuestions.length, section: document.getElementById('examSection').value, allQData: filteredQuestions.map((q, idx) => ({ id: q.id, topic: q.topic, isCorrect: responses[idx] === q.answer })) });
    document.getElementById('examActive').style.display = 'none'; document.getElementById('examResult').style.display = 'block';
    document.getElementById('finalScore').innerText = `${score} / ${filteredQuestions.length}`;
    updateDashboard();
}

window.onload = init;
