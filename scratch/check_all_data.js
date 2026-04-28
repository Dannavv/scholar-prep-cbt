const fs = require('fs');

function extractArray(filename, arrayName) {
    const content = fs.readFileSync(filename, 'utf8');
    const result = eval(content + `\n${arrayName};`);
    return result;
}

try {
    const q1 = extractArray('js/data.js', 'allQuestions');
    const q2 = extractArray('js/paper2-data.js', 'paper2Questions');
    const all = [...q1, ...q2];
    
    let errors = 0;
    const ids = new Set();
    
    all.forEach((q, i) => {
        if (!q.id) { console.log('Missing id at index', i); errors++; }
        else if (ids.has(q.id)) { console.log('Duplicate id:', q.id); errors++; }
        ids.add(q.id);
        
        if (!q.options || q.options.length !== 4) { console.log('Invalid options for', q.id); errors++; }
        if (!['a', 'b', 'c', 'd'].includes(q.answer)) { console.log('Invalid answer for', q.id, q.answer); errors++; }
    });
    
    console.log(`Checked ${all.length} questions. Errors found: ${errors}`);
} catch (e) {
    console.error(e);
}
