(function () {
    const SUBJECT_CONFIG = {
        toc: { section: 'Theory of Computation', mcqMount: '#content-toc' },
        dbms: { section: 'DBMS', mcqMount: '#content-dbms' },
        os: { section: 'Operating Systems', mcqMount: '#content-os' },
        coa: { section: 'COA', mcqMount: '#content-coa' },
        algo: { section: 'Algorithms', mcqMount: '#content-algo' },
        cn: { section: 'Computer Networks', mcqMount: '#cn-pyq' },
        se: { section: 'Software Engineering', mcqMount: '#content-se' },
        prog: { section: 'Programming', mcqMount: '#content-prog' }
    };

    const state = {
        conceptsByTab: {}
    };

    const KNOWLEDGE_BOOSTERS = {
        toc: {
            mustKnow: [
                'Hierarchy order and machine mapping',
                'Closure properties of Regular and CFL',
                'Regular grammar, CNF, PDA acceptance rules'
            ],
            confuse: [
                ['Regular vs CFL', 'Regular languages need only finite memory; CFLs need stack-based memory.'],
                ['CFL vs DCFL', 'DCFL is a strict subset of CFL and cannot handle all midpoint-guess problems.'],
                ['Recursive vs RE', 'Recursive always halts; RE may accept and loop forever on non-members.']
            ],
            recall: [
                'Regular ⊂ DCFL ⊂ CFL ⊂ CSL ⊂ Recursive ⊂ RE',
                'NFA, DFA, and regular expressions are equivalent in power',
                'Pumping lemma is usually used to prove a language is not regular'
            ]
        },
        dbms: {
            mustKnow: [
                'ER notation, key types, integrity constraints',
                'Normalization path from 1NF to BCNF',
                'SQL clause order, joins, ACID properties'
            ],
            confuse: [
                ['Primary Key vs Candidate Key', 'Primary key is chosen from candidate keys; every candidate key is minimal.'],
                ['WHERE vs HAVING', 'WHERE filters rows before grouping; HAVING filters groups after GROUP BY.'],
                ['2NF vs 3NF vs BCNF', '2NF removes partial dependency, 3NF removes transitive dependency, BCNF demands determinant as superkey.']
            ],
            recall: [
                'Entity integrity means primary key cannot be NULL',
                'Projection selects columns; Selection filters rows',
                'Atomicity = all or nothing, Durability = committed means permanent'
            ]
        },
        os: {
            mustKnow: [
                'Process states, scheduler roles, PCB, system calls',
                'Paging formulas, TAT/WT formulas, deadlock conditions',
                'Semaphores, page replacement, fragmentation'
            ],
            confuse: [
                ['Paging vs Segmentation', 'Paging uses fixed-size blocks; segmentation uses variable logical blocks.'],
                ['Long-term vs Short-term scheduler', 'Long-term admits jobs; short-term selects the next running process.'],
                ['Deadlock prevention vs avoidance', 'Prevention breaks a condition; avoidance checks safe allocation states.']
            ],
            recall: [
                'Ready, Running, Waiting stay in RAM',
                'FIFO can show Belady anomaly; Optimal is theoretical best',
                'Deadlock needs all four Coffman conditions'
            ]
        },
        coa: {
            mustKnow: [
                'Memory hierarchy, addressing modes, instruction cycle',
                'Pipelining, hazards, opcode/address fields',
                'Binary complements and digital logic basics'
            ],
            confuse: [
                ['Register vs Cache', 'Registers are inside CPU core; cache sits between CPU and main memory.'],
                ['Immediate vs Direct addressing', 'Immediate stores operand in instruction; Direct stores memory address in instruction.'],
                ['Throughput vs Latency', 'Pipelining improves throughput, not single-instruction latency.']
            ],
            recall: [
                '2’s complement = 1’s complement + 1',
                'MUX with n select lines supports 2^n inputs',
                'A filled pipeline ideally completes one instruction per cycle'
            ]
        },
        algo: {
            mustKnow: [
                'BFS/DFS, BST traversal, MST, shortest paths',
                'Greedy vs DP identification',
                'Sorting complexity, binary search, hashing collisions'
            ],
            confuse: [
                ['BFS vs DFS', 'BFS uses queue and is best for unweighted shortest path; DFS uses stack/recursion.'],
                ['Greedy vs Dynamic Programming', 'Greedy commits locally; DP stores and reuses overlapping subproblems.'],
                ['O vs Ω vs Θ', 'O is upper bound, Ω is lower bound, Θ is tight bound.']
            ],
            recall: [
                'In-order traversal of BST gives sorted order',
                '0/1 knapsack is DP, fractional knapsack is Greedy',
                'Primary clustering is associated with linear probing'
            ]
        },
        cn: {
            mustKnow: [
                'OSI layers, IP classes, subnetting, TCP vs UDP',
                'Routing protocols and common port numbers',
                'Device-layer mapping: hub, switch, router'
            ],
            confuse: [
                ['Switch vs Router', 'Switch works with MAC at Layer 2; router works with IP at Layer 3.'],
                ['TCP vs UDP', 'TCP is reliable and connection-oriented; UDP is connectionless and lighter.'],
                ['Network vs Broadcast domain', 'Switch separates collision domains; router separates broadcast domains.']
            ],
            recall: [
                'IPv4 has 32 bits',
                'Usable hosts = 2^(host bits) - 2',
                'Transport layer is where TCP and UDP operate'
            ]
        },
        se: {
            mustKnow: [
                'Process models, testing hierarchy, cohesion/coupling',
                'SRS properties, maintenance types, COCOMO',
                'Verification, validation, reliability terms'
            ],
            confuse: [
                ['Verification vs Validation', 'Verification asks building right; validation asks building the right thing.'],
                ['Error vs Fault vs Failure', 'Error is human mistake, fault is defect, failure is wrong behavior.'],
                ['Unit vs Integration vs System testing', 'They differ by test scope, not just execution order.']
            ],
            recall: [
                'Best design = high cohesion + low coupling',
                'Spiral model is risk-driven',
                'Cyclomatic complexity estimates independent execution paths'
            ]
        },
        prog: {
            mustKnow: [
                'OOP pillars, memory model, pointers, parameter passing',
                'Static behavior, output tracing, storage understanding',
                'Core data structures facts used in MCQ-style questions'
            ],
            confuse: [
                ['Abstraction vs Encapsulation', 'Abstraction hides complexity; encapsulation binds data with methods and access control.'],
                ['Stack vs Heap', 'Stack is automatic call/local storage; heap is dynamic allocation space.'],
                ['Pass by value vs reference', 'Value copies data; reference/pointer updates original storage.']
            ],
            recall: [
                'Array name points to first element in most C contexts',
                'Static variable is initialized once and retains value',
                'Stack uses LIFO, queue uses FIFO'
            ]
        }
    };

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function shuffle(list) {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function sample(list, count) {
        return shuffle(list).slice(0, Math.min(count, list.length));
    }

    function answerIndex(answer) {
        return ['a', 'b', 'c', 'd'].indexOf(String(answer || '').toLowerCase());
    }

    function hideLegacyPyqs() {
        document.querySelectorAll('.pyq-box').forEach((box) => {
            if (!box.closest('.dynamic-mcq-block')) {
                box.classList.add('legacy-pyq');
            }
        });

        document.querySelectorAll('.section-title').forEach((title) => {
            const text = title.textContent.trim().toLowerCase();
            if (text.includes('past year questions') || text.startsWith('pyq')) {
                title.classList.add('legacy-pyq-title');
            }
        });
    }

    function questionsForSection(section) {
        return (typeof paper2Questions !== 'undefined' ? paper2Questions : []).filter(
            (question) => question.section === section
        );
    }

    function noteForTopic(section, topic, questionCount, firstQuestion) {
        const source = typeof paper2TopicNotes !== 'undefined' ? paper2TopicNotes[topic] : null;
        if (source) {
            return {
                topic,
                summaryHtml: source.summary || '',
                formulaHtml: source.formula || '',
                detailsHtml: source.details || '',
                exampleHtml: source.example || '',
                questionCount
            };
        }

        return {
            topic,
            summaryHtml: `${escapeHtml(topic)} is a repeatedly tested concept area in ${escapeHtml(section)} for HPCL Paper 2.`,
            formulaHtml: '',
            detailsHtml: escapeHtml(firstQuestion?.explanation || 'Revise the definition, common comparison points, and direct application-based facts.'),
            exampleHtml: 'Typical objective questions test the concept definition, a direct distinction, or one standard application.',
            questionCount
        };
    }

    function buildConceptsForSection(section) {
        const byTopic = new Map();
        questionsForSection(section).forEach((question) => {
            if (!byTopic.has(question.topic)) {
                byTopic.set(question.topic, []);
            }
            byTopic.get(question.topic).push(question);
        });

        return [...byTopic.entries()].map(([topic, questions]) =>
            noteForTopic(section, topic, questions.length, questions[0])
        );
    }

    function renderConceptExplorer(tabId, config) {
        const pane = document.getElementById(`content-${tabId}`);
        if (!pane) return;

        const header = pane.querySelector('.subject-header');
        if (!header) return;

        const concepts = buildConceptsForSection(config.section);
        if (!concepts.length) return;

        state.conceptsByTab[tabId] = concepts;

        const block = document.createElement('section');
        block.className = 'interactive-concept-block';
        block.innerHTML = `
            <div class="section-title">Interactive Concept Explorer</div>
            <div class="dynamic-mcq-note">Click a topic to inspect a sharper, high-yield note summary from the Paper 2 data layer.</div>
            <div class="topic-chip-row" id="concept-chip-row-${tabId}"></div>
            <div id="concept-note-${tabId}"></div>
        `;

        header.insertAdjacentElement('afterend', block);

        const chipRow = block.querySelector(`#concept-chip-row-${tabId}`);
        concepts.forEach((concept, index) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = `topic-chip${index === 0 ? ' active' : ''}`;
            chip.textContent = concept.topic;
            chip.dataset.topic = concept.topic;
            chip.onclick = function () {
                window.showConceptNote(tabId, concept.topic);
            };
            chipRow.appendChild(chip);
        });

        window.showConceptNote(tabId, concepts[0].topic);
    }

    function conceptCard(label, title, bodyHtml) {
        return `
            <div class="concept-note-card">
                <div class="concept-note-label">${label}</div>
                <h3>${title}</h3>
                <div>${bodyHtml}</div>
            </div>
        `;
    }

    window.showConceptNote = function (tabId, topic) {
        const concepts = state.conceptsByTab[tabId] || [];
        const concept = concepts.find((item) => item.topic === topic);
        if (!concept) return;

        const mount = document.getElementById(`concept-note-${tabId}`);
        if (!mount) return;

        document.querySelectorAll(`#concept-chip-row-${tabId} .topic-chip`).forEach((chip) => {
            chip.classList.toggle('active', chip.dataset.topic === topic);
        });

        const cards = [
            conceptCard('Topic', escapeHtml(concept.topic), concept.summaryHtml)
        ];

        if (concept.formulaHtml) {
            cards.push(conceptCard('Formula / Rule', 'Must Remember', `<code>${concept.formulaHtml}</code>`));
        }

        cards.push(conceptCard('High-Yield Note', 'Why It Matters', concept.detailsHtml));
        cards.push(conceptCard('Objective Angle', `${concept.questionCount} Data Questions`, concept.exampleHtml));

        mount.innerHTML = `<div class="concept-note-grid">${cards.join('')}</div>`;
    };

    function renderKnowledgeBooster(tabId) {
        const pane = document.getElementById(`content-${tabId}`);
        const booster = KNOWLEDGE_BOOSTERS[tabId];
        if (!pane || !booster) return;

        const existing = pane.querySelector(`.dynamic-knowledge-block[data-tab="${tabId}"]`);
        if (existing) existing.remove();

        const block = document.createElement('section');
        block.className = 'dynamic-knowledge-block interactive-concept-block';
        block.dataset.tab = tabId;

        const confuseRows = booster.confuse.map(([left, right]) => `
            <div class="concept-note-card">
                <div class="concept-note-label">Do Not Confuse</div>
                <h3>${escapeHtml(left)}</h3>
                <div>${escapeHtml(right)}</div>
            </div>
        `).join('');

        const mustKnowList = booster.mustKnow.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
        const recallList = booster.recall.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

        block.innerHTML = `
            <div class="section-title">Subject Knowledge Booster</div>
            <div class="concept-note-grid">
                <div class="concept-note-card">
                    <div class="concept-note-label">Must Know</div>
                    <h3>High-Yield Areas</h3>
                    <ul>${mustKnowList}</ul>
                </div>
                <div class="concept-note-card">
                    <div class="concept-note-label">Rapid Recall</div>
                    <h3>Memory Hooks</h3>
                    <ul>${recallList}</ul>
                </div>
                ${confuseRows}
            </div>
        `;

        const conceptBlock = pane.querySelector('.interactive-concept-block');
        if (conceptBlock) {
            conceptBlock.insertAdjacentElement('afterend', block);
        }
    }

    function renderMcqCard(question, index) {
        const correct = answerIndex(question.answer);
        const options = question.options.map((option, optionIndex) => {
            const letter = String.fromCharCode(65 + optionIndex);
            return `
                <div class="pyq-option" data-correct="${optionIndex === correct ? '1' : '0'}" onclick="markDynamicOption(this)">
                    ${letter}) ${escapeHtml(option)}
                </div>
            `;
        }).join('');

        return `
            <div class="pyq-box">
                <div class="pyq-year">Dynamic Paper 2 Drill ${index + 1}</div>
                <div class="pyq-meta-line">
                    <span class="pyq-mini-chip">${escapeHtml(question.topic)}</span>
                    <span class="pyq-mini-chip">${escapeHtml(question.difficulty || 'Mixed')}</span>
                    <span class="pyq-mini-chip">${escapeHtml(question.id)}</span>
                </div>
                <div class="pyq-q">${escapeHtml(question.question)}</div>
                <div class="pyq-options">${options}</div>
                <div class="pyq-ans"><strong>Explanation:</strong> ${escapeHtml(question.explanation || 'No explanation available.')}</div>
            </div>
        `;
    }

    function renderDynamicMcqs(tabId) {
        const config = SUBJECT_CONFIG[tabId];
        if (!config) return;

        const mount = document.querySelector(config.mcqMount);
        if (!mount) return;

        const questions = questionsForSection(config.section);
        if (!questions.length) return;

        let block = mount.querySelector(`.dynamic-mcq-block[data-tab="${tabId}"]`);
        if (!block) {
            block = document.createElement('section');
            block.className = 'dynamic-mcq-block';
            block.dataset.tab = tabId;
            mount.appendChild(block);
        }

        const chosen = sample(questions, 2);
        block.innerHTML = `
            <div class="section-title">Random Paper 2 MCQ Drill</div>
            <div class="dynamic-mcq-toolbar">
                <div class="dynamic-mcq-note">A fresh pair of Paper 2 questions is pulled from <code>paper2-data.js</code> on every load.</div>
                <button type="button" class="refresh-mcq-btn" onclick="refreshDynamicMcqs('${tabId}')">Load Another Pair</button>
            </div>
            <div class="dynamic-mcq-stack">
                ${chosen.map(renderMcqCard).join('')}
            </div>
        `;
    }

    window.refreshDynamicMcqs = function (tabId) {
        renderDynamicMcqs(tabId);
    };

    window.markDynamicOption = function (element) {
        const options = element.closest('.pyq-options');
        if (!options) return;

        const explanation = element.closest('.pyq-box').querySelector('.pyq-ans');
        options.querySelectorAll('.pyq-option').forEach((option) => {
            option.style.pointerEvents = 'none';
            if (option.dataset.correct === '1') {
                option.classList.add('correct');
            } else if (option === element) {
                option.classList.add('wrong');
            } else {
                option.classList.add('dimmed');
            }
        });

        if (explanation) {
            explanation.classList.add('show');
        }
    };

    window.initPaper2InteractiveNotes = function () {
        hideLegacyPyqs();
        Object.entries(SUBJECT_CONFIG).forEach(([tabId, config]) => {
            renderConceptExplorer(tabId, config);
            renderKnowledgeBooster(tabId);
            renderDynamicMcqs(tabId);
        });
    };
})();
