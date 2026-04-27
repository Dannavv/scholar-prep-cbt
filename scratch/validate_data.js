
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('set1.json', 'utf8'));

data.forEach((q, index) => {
    const validAnswers = ['a', 'b', 'c', 'd'];
    if (!validAnswers.includes(q.answer)) {
        console.log(`Question ${q.id} (Index ${index}): Invalid answer key '${q.answer}'`);
    }
    if (!q.options || q.options.length !== 4) {
        console.log(`Question ${q.id} (Index ${index}): Missing or invalid options`);
    }
});
