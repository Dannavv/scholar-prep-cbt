const allQuestions = [
  {
    "id": "QUANT_001",
    "section": "Quantitative Aptitude",
    "topic": "Time & Work",
    "question": "A is twice as efficient as B. If they together can complete a piece of work in 18 days, in how many days can A alone finish the work?",
    "options": ["27", "36", "45", "54"],
    "answer": "a",
    "explanation": "Efficiency Ratio A:B = 2:1. Total efficiency = 3. Total Work = 18 * 3 = 54 units. Time taken by A = 54 / 2 = 27 days.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_002",
    "section": "Quantitative Aptitude",
    "topic": "Mixture & Alligation",
    "question": "A vessel contains 60 liters of milk and water in the ratio 3:2. How much water should be added to make the ratio of milk to water 1:1?",
    "options": ["10 liters", "12 liters", "15 liters", "20 liters"],
    "answer": "b",
    "explanation": "Initial: Milk = 36, Water = 24. For 1:1 ratio, milk must equal water. Since milk is constant (36), water must also be 36. Water to add = 36 - 24 = 12 liters.",
    "difficulty": "Medium"
  },
  {
    "id": "REAS_DI_001",
    "section": "Reasoning",
    "topic": "Depiction & Interpretation",
    "question": "Refer to the following series: 8 H # 2 @ K L 5 % 9 1 M $ 4 * B 7 & 3 0 G P 6 Q W\n\nHow many such symbols are there in the above arrangement, each of which is immediately preceded by a number and immediately followed by a letter?",
    "options": ["One", "Two", "Three", "Four"],
    "answer": "b",
    "explanation": "Required sequence: Number -> Symbol -> Letter. Scanning the series: 8 H # (No), 2 @ K (Yes - 1), 5 % 9 (No), 1 M $ (No), 4 * B (Yes - 2). Total = 2.",
    "difficulty": "Hard"
  },
  {
    "id": "ENG_001",
    "section": "English Language",
    "topic": "Sentence Arrangement",
    "question": "Rearrange: P: Meanwhile, gov is focusing on RE. Q: Therefore, transition is inevitable. R: Consumption rising. S: However, coal remains major.",
    "options": ["RPQS", "RPSQ", "PQRS", "SQRP"],
    "answer": "b",
    "explanation": "R starts, P transitions, S adds contrast, Q concludes. RPSQ.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_003",
    "section": "Quantitative Aptitude",
    "topic": "Simple Interest",
    "question": "Sum doubles in 8 years. When will it be 4 times?",
    "options": ["16", "24", "32", "20"],
    "answer": "b",
    "explanation": "Doubles = 100% in 8y. 4 times = 300%. 3 * 8 = 24 years.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_004",
    "section": "Quantitative Aptitude",
    "topic": "Time, Speed & Distance",
    "question": "Train 150m at 72km/hr crosses platform 250m. Time?",
    "options": ["15", "20", "25", "30"],
    "answer": "b",
    "explanation": "Dist = 400. Speed = 20m/s. Time = 20s.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_001",
    "section": "Reasoning",
    "topic": "Syllogism",
    "question": "Bags are pockets. Pockets are pouches.",
    "options": ["I", "II", "Both", "Neither"],
    "answer": "b",
    "explanation": "Only II follows.",
    "difficulty": "Medium"
  },
  {
    "id": "ENG_002",
    "section": "English Language",
    "topic": "Synonyms",
    "question": "Synonym of OBSOLETE.",
    "options": ["Modern", "Current", "Outdated", "Durable"],
    "answer": "c",
    "explanation": "Outdated.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_005",
    "section": "Quantitative Aptitude",
    "topic": "Mensuration",
    "question": "Ratio radius:height = 2:3. Volume 1617. Radius?",
    "options": ["7", "10.5", "14", "3.5"],
    "answer": "a",
    "explanation": "r=7.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_006",
    "section": "Quantitative Aptitude",
    "topic": "Profit & Loss",
    "question": "Sell 720, gain 20%. CP?",
    "options": ["600", "580", "620", "640"],
    "answer": "a",
    "explanation": "600.",
    "difficulty": "Easy"
  }
];

const topicNotes = {
  'Time & Work': {
    summary: 'Analyzes the relationship between the number of workers, time taken, and total output. HPCL loves efficiency-based questions.',
    formula: 'Total Work = Time × Efficiency. Combined Efficiency = (A+B). If A does work in x days, A\'s 1-day work = 1/x.',
    details: 'Efficiency is inversely proportional to Time. If A is thrice as good as B, A takes 1/3 the time of B.',
    example: '<b>Case:</b> A in 10d, B in 15d. <br><b>Step 1:</b> Find LCM (Total Work) = 30. <br><b>Step 2:</b> Efficiency A=3, B=2. <br><b>Step 3:</b> Together = 30/5 = 6 days.'
  },
  'Mixture & Alligation': {
    summary: 'A rule to find the ratio in which two ingredients at given prices are mixed to produce a mixture at a specific price.',
    formula: '(Cheaper Quantity / Dearer Quantity) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price).',
    details: 'Always ensure all prices (Cheaper, Dearer, Mean) are in the same units (e.g., all CP or all SP).',
    example: '<b>Case:</b> Mix tea at ₹62 and ₹72 to get ₹64.5. <br><b>Step 1:</b> (72 - 64.5) = 7.5. <br><b>Step 2:</b> (64.5 - 62) = 2.5. <br><b>Step 3:</b> Ratio = 7.5 : 2.5 = 3:1.'
  },
  'Simple Interest': {
    summary: 'Interest calculated only on the principal amount for the entire period.',
    formula: 'SI = (P × R × T) / 100. Amount = P + SI.',
    details: 'In SI, interest remains constant for every year. If a sum doubles, SI = Principal.',
    example: '<b>Trick:</b> If a sum becomes "n" times in "t" years, Rate R = 100(n-1)/t.'
  },
  'Syllogism': {
    summary: 'Deductive reasoning to determine if conclusions follow logically from given statements using Venn diagrams.',
    formula: 'Rule: Some + Some = No Conclusion. All + All = All. All + Some = No Conclusion.',
    details: 'Focus on "Possibility" vs "Certainty". A conclusion is true only if it is true in 100% of possible Venn diagrams.',
    example: '<b>Case:</b> All A are B. Some B are C. <br><b>Logic:</b> No direct relation between A and C. Any conclusion between A and C is False.'
  },
  'Sentence Arrangement': {
    summary: 'Logical ordering of jumbled sentences into a coherent paragraph.',
    formula: 'Strategy: Opening Statement ➔ Mandatory Pairs ➔ Connector ➔ Conclusion.',
    details: 'Look for pronouns (he, she, they) to find what they refer to. Use transition words like "However", "Therefore" to find order.',
    example: '<b>Pairing:</b> If sentence P says "The problem is..." and Q says "To solve this...", P must come before Q.'
  },
  'Time, Speed & Distance': {
    summary: 'The study of movement over time. Crucial for Train and Boat problems.',
    formula: 'Speed = Distance / Time. To convert km/hr to m/s: Multiply by 5/18.',
    details: 'Relative Speed: Same direction (Subtract), Opposite direction (Add). Train crossing platform: Dist = Train Length + Platform Length.',
    example: '<b>Train Trick:</b> Time to cross pole = Train Length / Speed.'
  },
  'Mensuration': {
    summary: 'Calculating Geometric parameters like Area, Perimeter, and Volume.',
    formula: 'Circle: Area = πr², Perim = 2πr. Cylinder: Vol = πr²h. Sphere: Vol = 4/3πr³.',
    details: 'Always check units. If radius is in cm and height in m, convert before using the formula.',
    example: '<b>Area Change:</b> If radius doubles, Area becomes 4 times (since r is squared).'
  },
  'Profit & Loss': {
    summary: 'Comparing Cost Price (CP) and Selling Price (SP) to determine gain/loss.',
    formula: 'Profit% = (Profit/CP) × 100. SP = CP × [(100+G%)/100].',
    details: 'Profit and Loss are always calculated on CP unless stated otherwise.',
    example: '<b>Quick SP:</b> If gain is 20%, SP = 1.2 × CP. If loss is 10%, SP = 0.9 × CP.'
  },
  'Depiction & Interpretation': {
    summary: 'Scanning alphanumeric series to find patterns or counts based on specific conditions.',
    formula: 'Logic: Scan condition (e.g., Num-Sym-Let) in a single pass. Do not jump back and forth.',
    details: 'HPCL pattern: How many [target] are preceded by [A] and followed by [B]? Mark placeholders clearly.',
    example: '<b>String:</b> A 2 @ K. Target: @. Preceded by Number(2)? Yes. Followed by Letter(K)? Yes. Count = 1.'
  }
};

function getTopicNote(topic, section) {
  if (topicNotes[topic]) return topicNotes[topic];
  return {
    summary: `Detailed study of ${topic} for HPCL Paper I.`,
    formula: 'Standard thematic formula applies.',
    details: 'Focus on speed and pattern recognition.',
    example: 'Refer to mock questions for worked examples.'
  };
}
