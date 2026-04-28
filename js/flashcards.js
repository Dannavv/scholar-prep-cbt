(function () {
    let currentCards = [];
    let currentIndex = 0;

    const paperFilter = document.getElementById('fc-paper-filter');
    const subjectFilter = document.getElementById('fc-subject-filter');
    const wrapper = document.getElementById('flashcard-wrapper');
    const progressText = document.getElementById('fc-progress');
    const prevBtn = document.getElementById('fc-prev');
    const nextBtn = document.getElementById('fc-next');

    function populateSubjects() {
        const selectedPaper = paperFilter.value;
        let subjects = new Set();
        
        window.FLASHCARDS_DATA.forEach(card => {
            if (selectedPaper === 'all' || card.paper === selectedPaper) {
                subjects.add(card.subject);
            }
        });

        const currentSubject = subjectFilter.value;
        subjectFilter.innerHTML = '<option value="all">All Subjects</option>';
        
        Array.from(subjects).sort().forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub;
            opt.textContent = sub;
            subjectFilter.appendChild(opt);
        });

        if (subjects.has(currentSubject)) {
            subjectFilter.value = currentSubject;
        } else {
            subjectFilter.value = 'all';
        }
    }

    function filterCards() {
        const selectedPaper = paperFilter.value;
        const selectedSubject = subjectFilter.value;

        currentCards = window.FLASHCARDS_DATA.filter(card => {
            const matchPaper = selectedPaper === 'all' || card.paper === selectedPaper;
            const matchSubject = selectedSubject === 'all' || card.subject === selectedSubject;
            return matchPaper && matchSubject;
        });

        // Shuffle cards for varied practice
        for (let i = currentCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
        }

        currentIndex = 0;
        renderCard();
    }

    function renderCard() {
        if (currentCards.length === 0) {
            wrapper.innerHTML = `<div class="empty-state">No flashcards found for this selection.</div>`;
            progressText.textContent = `0 / 0`;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

        const card = currentCards[currentIndex];
        
        // Remove old card if exists to reset flip state
        wrapper.innerHTML = `
            <div class="flashcard" onclick="this.classList.toggle('flipped')">
                <div class="fc-face fc-front">
                    <div class="fc-meta">
                        <span>${card.subject}</span>
                        <span>${card.topic}</span>
                    </div>
                    <div class="fc-content">${card.front}</div>
                    <div style="position:absolute; bottom:1.5rem; font-size:12px; color:var(--text-muted);"><i class="fas fa-hand-pointer"></i> Click to flip</div>
                </div>
                <div class="fc-face fc-back">
                    <div class="fc-meta">
                        <span>Answer</span>
                    </div>
                    <div class="fc-content">${card.back}</div>
                </div>
            </div>
        `;

        progressText.textContent = `${currentIndex + 1} / ${currentCards.length}`;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === currentCards.length - 1;
    }

    if (paperFilter && subjectFilter && wrapper) {
        paperFilter.addEventListener('change', () => {
            populateSubjects();
            filterCards();
        });

        subjectFilter.addEventListener('change', filterCards);

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                renderCard();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < currentCards.length - 1) {
                currentIndex++;
                renderCard();
            }
        });

        // Initialize
        if (window.FLASHCARDS_DATA) {
            populateSubjects();
            filterCards();
        }
    }
})();
