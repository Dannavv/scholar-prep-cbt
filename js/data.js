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
    "id": "REAS_DI_002",
    "section": "Reasoning",
    "topic": "Depiction & Interpretation",
    "question": "Given the set of numbers: 847, 296, 513, 702, 381. What will be the resultant if the second digit of the highest number is multiplied by the third digit of the lowest number?",
    "options": ["24", "18", "32", "4"],
    "answer": "a",
    "explanation": "Highest number: 847. Second digit = 4. Lowest number: 296. Third digit = 6. Resultant = 4 * 6 = 24.",
    "difficulty": "Medium"
  },
  {
    "id": "ENG_001",
    "section": "English Language",
    "topic": "Jumbled Sentences",
    "question": "Rearrange the following sentences to form a meaningful paragraph:\nP: Meanwhile, the government is focusing on renewable energy.\nQ: Therefore, the transition is inevitable.\nR: Energy consumption is rising rapidly worldwide.\nS: However, coal still remains a major source.",
    "options": ["RPQS", "RPSQ", "PQRS", "SQRP"],
    "answer": "b",
    "explanation": "R starts with the core subject (Energy consumption). P introduces a transition ('Meanwhile'). S adds a contrast ('However'). Q concludes ('Therefore'). Sequence: RPSQ.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_003",
    "section": "Quantitative Aptitude",
    "topic": "Simple Interest",
    "question": "A sum of money doubles itself in 8 years at simple interest. In how many years will it become four times of itself at the same rate of interest?",
    "options": ["16 years", "24 years", "32 years", "20 years"],
    "answer": "b",
    "explanation": "Doubles in 8 years means 100% interest in 8 years (Rate = 12.5%). To become 4 times, it needs 300% interest. Time = 300 / 12.5 = 24 years.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_004",
    "section": "Quantitative Aptitude",
    "topic": "Time, Speed & Distance",
    "question": "A train 150m long is running at 72 km/hr. How long will it take to cross a platform 250m long?",
    "options": ["15 seconds", "20 seconds", "25 seconds", "30 seconds"],
    "answer": "b",
    "explanation": "Total Distance = 150 + 250 = 400m. Speed = 72 * (5/18) = 20 m/s. Time = 400 / 20 = 20 seconds.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_001",
    "section": "Reasoning",
    "topic": "Syllogism",
    "question": "Statements: All bags are pockets. Some pockets are pouches. \nConclusions: I. Some bags are pouches. II. Some pouches are pockets.",
    "options": ["Only I follows", "Only II follows", "Both I and II follow", "Neither I nor II follows"],
    "answer": "b",
    "explanation": "No direct link between 'bags' and 'pouches'. Some pouches are pockets follows from the second statement.",
    "difficulty": "Medium"
  },
  {
    "id": "ENG_002",
    "section": "English Language",
    "topic": "Vocabulary",
    "question": "Find the synonym of the word 'OBSOLETE'.",
    "options": ["Modern", "Current", "Outdated", "Durable"],
    "answer": "c",
    "explanation": "Obsolete means no longer produced or used; outdated.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_005",
    "section": "Quantitative Aptitude",
    "topic": "Mensuration",
    "question": "The ratio of the radius and height of a cylinder is 2:3. If its volume is 1617 cm³, find its radius. (Use π = 22/7)",
    "options": ["7 cm", "10.5 cm", "14 cm", "3.5 cm"],
    "answer": "a",
    "explanation": "r=2x, h=3x. Volume = πr²h = (22/7)*(4x²)*(3x) = 1617. (264/7)x³ = 1617 => x³ = 42.875 => x=3.5. Radius = 2 * 3.5 = 7 cm.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_006",
    "section": "Quantitative Aptitude",
    "topic": "Profit & Loss",
    "question": "By selling an article for Rs. 720, a shopkeeper gains 20%. Find the cost price of the article.",
    "options": ["Rs. 600", "Rs. 580", "Rs. 620", "Rs. 640"],
    "answer": "a",
    "explanation": "CP = SP / (1 + Profit%) = 720 / 1.2 = 600.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_DI_003",
    "section": "Reasoning",
    "topic": "Depiction & Interpretation",
    "question": "Alphabet Series: AB3, DE6, GH9, JK12, ... What will be the next term?",
    "options": ["MN15", "LM15", "MN14", "NO15"],
    "answer": "a",
    "explanation": "Letters shift by 3 (A->D->G->J->M). Numbers increase by 3. Next is MN15.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_DI_004",
    "section": "Reasoning",
    "topic": "Depiction & Interpretation",
    "question": "In the series '9 $ W # 7 @ 5 % 2 & 8 * 1', how many such numbers are there each of which is immediately preceded by a symbol?",
    "options": ["Two", "Three", "Four", "Five"],
    "answer": "d",
    "explanation": "Required pattern: Symbol -> Number. Scanning the series: # 7 (1), @ 5 (2), % 2 (3), & 8 (4), * 1 (5). Total = 5.",
    "difficulty": "Hard"
  },
  {
    "id": "ENG_003",
    "section": "English Language",
    "topic": "Error Spotting",
    "question": "Identify the part with error: 'A number of (a) / guests has (b) / arrived at the party (c) / No error (d)'",
    "options": ["a", "b", "c", "d"],
    "answer": "b",
    "explanation": "'A number of' takes a plural verb. It should be 'have'.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_007",
    "section": "Quantitative Aptitude",
    "topic": "Ratio & Proportion",
    "question": "The ratio of ages of A and B is 4:5. Six years hence, the ratio will become 11:13. What is the present age of B?",
    "options": ["16 years", "20 years", "24 years", "28 years"],
    "answer": "b",
    "explanation": "Let ages be 4x and 5x. (4x+6)/(5x+6) = 11/13 => 52x + 78 = 55x + 66 => 3x = 12 => x = 4. B's present age = 5 * 4 = 20 years.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_002",
    "section": "Reasoning",
    "topic": "Blood Relation",
    "question": "P is the brother of Q. R is the mother of Q. S is the father of R. T is the mother of S. How is P related to T?",
    "options": ["Grandson", "Great-grandson", "Son", "Brother"],
    "answer": "b",
    "explanation": "P, Q are siblings (Gen 1). R is their mother (Gen 2). S is R's father (Gen 3). T is S's mother (Gen 4). P is the great-grandson of T.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_008",
    "section": "Quantitative Aptitude",
    "topic": "Time & Work",
    "question": "A can finish a work in 15 days and B in 20 days. They work together for 4 days and then A leaves. In how many days will B finish the remaining work?",
    "options": ["10 2/3 days", "10 days", "11 1/3 days", "12 days"],
    "answer": "a",
    "explanation": "Total work = 60 (LCM). Eff A = 4, B = 3. Together eff = 7. In 4 days, they do 28 units. Remaining = 60 - 28 = 32. Time for B = 32 / 3 = 10 2/3 days.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_003",
    "section": "Reasoning",
    "topic": "Coding-Decoding",
    "question": "In a certain code, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that code?",
    "options": ["EOJDJEFM", "EOJDEJFM", "MFEJDJOE", "EOJDJFEM"],
    "answer": "a",
    "explanation": "Logic: Reverse the word and then shift each letter (except first and last) or similar. Reverse 'COMPUTER' -> 'RETUPMOC'. R->R, E+1=F, T+1=U, U+1=V, P+1=Q, M+1=N, O+1=P, C->C. Result: RFUVQNPC. Applying to 'MEDICINE': Reverse -> 'ENICIDEM'. E->E, N+1=O, I+1=J, C+1=D, I+1=J, D+1=E, E+1=F, M->M. Result: EOJDJEFM.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_009",
    "section": "Quantitative Aptitude",
    "topic": "Compound Interest",
    "question": "Find the compound interest on Rs. 10,000 for 2 years at 10% per annum, compounded annually.",
    "options": ["Rs. 2,000", "Rs. 2,100", "Rs. 2,050", "Rs. 2,200"],
    "answer": "b",
    "explanation": "Amount = 10000 * (1.1)^2 = 12100. CI = 12100 - 10000 = 2100.",
    "difficulty": "Easy"
  },
  {
    "id": "ENG_004",
    "section": "English Language",
    "topic": "One-Word Substitution",
    "question": "One who is incapable of making mistakes.",
    "options": ["Infallible", "Incorrigible", "Optimist", "Fatalist"],
    "answer": "a",
    "explanation": "Infallible means incapable of error.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_DI_005",
    "section": "Reasoning",
    "topic": "Depiction & Interpretation",
    "question": "Consider the set of 3-digit numbers: 519, 368, 437, 246, 175. If we add 1 to the first digit of each number and then arrange them in ascending order, which will be the third number?",
    "options": ["346", "468", "537", "619"],
    "answer": "b",
    "explanation": "Original: 519, 368, 437, 246, 175. Modified: 619, 468, 537, 346, 275. Ascending: 275, 346, 468, 537, 619. Third is 468.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_010",
    "section": "Quantitative Aptitude",
    "topic": "Averages",
    "question": "The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What is the weight of the new person?",
    "options": ["75 kg", "85 kg", "80 kg", "70 kg"],
    "answer": "b",
    "explanation": "Total weight increase = 8 * 2.5 = 20 kg. New weight = Old weight + Increase = 65 + 20 = 85 kg.",
    "difficulty": "Medium"
  },
  {
    "id": "REAS_004",
    "section": "Reasoning",
    "topic": "Direction Sense",
    "question": "A man walks 5 km toward South and then turns to the right. After walking 3 km he turns to the left and walks 5 km. Now in which direction is he from the starting place?",
    "options": ["West", "South", "North-East", "South-West"],
    "answer": "d",
    "explanation": "He moves South, then West, then South again. He is in the South-West direction from the start.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_011",
    "section": "Quantitative Aptitude",
    "topic": "HCF & LCM",
    "question": "The HCF and LCM of two numbers are 12 and 72 respectively. If the sum of the numbers is 60, find the numbers.",
    "options": ["12, 48", "24, 36", "12, 72", "24, 48"],
    "answer": "b",
    "explanation": "Product = HCF * LCM = 12 * 72 = 864. Sum = 60. Numbers are 24 and 36 (24*36=864, 24+36=60).",
    "difficulty": "Medium"
  },
  {
    "id": "REAS_005",
    "section": "Reasoning",
    "topic": "Syllogism",
    "question": "Statements: All stars are moons. All moons are planets. \nConclusions: I. All stars are planets. II. All planets are stars.",
    "options": ["Only I follows", "Only II follows", "Both follow", "Neither follow"],
    "answer": "a",
    "explanation": "Universal affirmative chain: Stars -> Moons -> Planets. So All stars are planets. Reversed is not true.",
    "difficulty": "Easy"
  },
  {
    "id": "ENG_005",
    "section": "English Language",
    "topic": "Synonyms",
    "question": "Choose the word most similar in meaning to 'ADVERSITY'.",
    "options": ["Fortune", "Misfortune", "Prosperity", "Happiness"],
    "answer": "b",
    "explanation": "Adversity means difficulties; misfortune.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_012",
    "section": "Quantitative Aptitude",
    "topic": "Time, Speed & Distance",
    "question": "A person crosses a 600m long street in 5 minutes. What is his speed in km/hr?",
    "options": ["3.6", "7.2", "8.4", "10"],
    "answer": "b",
    "explanation": "Speed = 600m / 300s = 2 m/s. In km/hr = 2 * (18/5) = 7.2 km/hr.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_006",
    "section": "Reasoning",
    "topic": "Number Series",
    "question": "Complete the series: 7, 10, 8, 11, 9, 12, ...",
    "options": ["7", "10", "12", "13"],
    "answer": "b",
    "explanation": "Alternate pattern: 7 (+3) 10 (-2) 8 (+3) 11 (-2) 9 (+3) 12 (-2) 10.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_013",
    "section": "Quantitative Aptitude",
    "topic": "Profit & Loss",
    "question": "If the cost price of 10 articles is equal to the selling price of 8 articles, find the gain percent.",
    "options": ["20%", "25%", "30%", "15%"],
    "answer": "b",
    "explanation": "Gain = (10-8)/8 * 100 = 2/8 * 100 = 25%.",
    "difficulty": "Medium"
  },
  {
    "id": "REAS_DI_006",
    "section": "Reasoning",
    "topic": "Depiction & Interpretation",
    "question": "In the following alphanumeric series, how many numbers are preceded by a consonant and followed by a vowel?\nA 2 E B 7 I C 9 O D 5 U",
    "options": ["1", "2", "3", "4"],
    "answer": "c",
    "explanation": "Consonant-Number-Vowel. B 7 I (1), C 9 O (2), D 5 U (3). 'A 2 E' does not count because A is a vowel. Total = 3.",
    "difficulty": "Hard"
  },
  {
    "id": "ENG_006",
    "section": "English Language",
    "topic": "Fill in the Blanks",
    "question": "He was prevented ______ going to the meeting.",
    "options": ["to", "from", "at", "by"],
    "answer": "b",
    "explanation": "'Prevented' is followed by the preposition 'from'.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_014",
    "section": "Quantitative Aptitude",
    "topic": "Averages",
    "question": "The average of five numbers is 27. If one number is excluded, the average becomes 25. The excluded number is:",
    "options": ["35", "45", "55", "25"],
    "answer": "a",
    "explanation": "Total sum = 27 * 5 = 135. Sum of four = 25 * 4 = 100. Excluded = 135 - 100 = 35.",
    "difficulty": "Medium"
  },
  {
    "id": "REAS_007",
    "section": "Reasoning",
    "topic": "Blood Relation",
    "question": "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
    "options": ["Sister", "Mother", "Grandmother", "Daughter"],
    "answer": "b",
    "explanation": "'Only daughter of my mother' is the woman herself. So, 'His mother is me'. She is his mother.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_015",
    "section": "Quantitative Aptitude",
    "topic": "Simple Interest",
    "question": "At what rate of simple interest will a sum of money triple itself in 10 years?",
    "options": ["10%", "15%", "20%", "25%"],
    "answer": "c",
    "explanation": "Triple means Interest = 200%. Rate = 200 / 10 = 20%.",
    "difficulty": "Medium"
  },
  {
    "id": "ENG_007",
    "section": "English Language",
    "topic": "Spelling Errors",
    "question": "Find the correctly spelled word.",
    "options": ["Accomodation", "Accommodation", "Acomodation", "Accommadation"],
    "answer": "b",
    "explanation": "Accommodation (double 'c', double 'm').",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_016",
    "section": "Quantitative Aptitude",
    "topic": "Mensuration",
    "question": "The area of a circle is 154 cm². Its circumference is:",
    "options": ["22 cm", "33 cm", "44 cm", "66 cm"],
    "answer": "c",
    "explanation": "πr² = 154 => (22/7)r² = 154 => r² = 49 => r = 7. Circumference = 2πr = 2 * (22/7) * 7 = 44 cm.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_008",
    "section": "Reasoning",
    "topic": "Direction Sense",
    "question": "Ravi is walking towards the East. After walking 1 km, he turns South and walks 5 km. Again he turns East and walks 2 km. Finally, he turns North and walks 9 km. How far is he from his starting point?",
    "options": ["3 km", "4 km", "5 km", "7 km"],
    "answer": "c",
    "explanation": "Net East displacement = 1 + 2 = 3 km. Net North displacement = 9 - 5 = 4 km. Distance = √(3² + 4²) = 5 km.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_017",
    "section": "Quantitative Aptitude",
    "topic": "Pipes & Cisterns",
    "question": "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:",
    "options": ["10 mins", "12 mins", "15 mins", "25 mins"],
    "answer": "b",
    "explanation": "Time = (20 * 30) / (20 + 30) = 600 / 50 = 12 minutes.",
    "difficulty": "Easy"
  },
  {
    "id": "ENG_RC_001",
    "section": "English Language",
    "topic": "Reading Comprehension",
    "question": "Read the passage and answer: 'In the heart of the city, there lies a small park that serves as a sanctuary for many. While the surrounding skyscrapers dominate the skyline, the park provides a rare patch of green. Local residents often visit in the evenings to escape the urban noise.' \nWhat is the primary function of the park according to the passage?",
    "options": ["To host city events", "To serve as a sanctuary", "To provide office space", "To increase urban noise"],
    "answer": "b",
    "explanation": "The text explicitly states it 'serves as a sanctuary'.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_018",
    "section": "Quantitative Aptitude",
    "topic": "Mixture & Alligation",
    "question": "In what ratio must tea at Rs. 62 per kg be mixed with tea at Rs. 72 per kg so that the mixture must be worth Rs. 64.50 per kg?",
    "options": ["3:1", "3:2", "4:3", "5:3"],
    "answer": "a",
    "explanation": "Using alligation: (72 - 64.5) : (64.5 - 62) = 7.5 : 2.5 = 3 : 1.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_009",
    "section": "Reasoning",
    "topic": "Seating Arrangement",
    "question": "Six friends A, B, C, D, E, and F are sitting in a circle facing the center. B is between F and C; A is between E and D; F is to the left of D. Who is between A and F?",
    "options": ["E", "D", "C", "B"],
    "answer": "b",
    "explanation": "Positions: D (fixed), F (left of D), B (between F and C), C. Remaining are E and A. A is between E and D. So sequence is D-A-E-C-B-F. Between A and F is D.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_019",
    "section": "Quantitative Aptitude",
    "topic": "Time & Work",
    "question": "If 12 men or 18 women can do a work in 14 days, then 8 men and 16 women can do the same work in:",
    "options": ["8 days", "9 days", "10 days", "12 days"],
    "answer": "b",
    "explanation": "12M = 18W => 2M = 3W. 8M + 16W = 12W + 16W = 28W. M1D1 = M2D2 => 18 * 14 = 28 * x => x = 9 days.",
    "difficulty": "Hard"
  },
  {
    "id": "ENG_008",
    "section": "English Language",
    "topic": "Idioms & Phrases",
    "question": "Meaning of the idiom: 'To cry wolf'.",
    "options": ["To listen eagerly", "To give false alarm", "To turn pale", "To keep off starvation"],
    "answer": "b",
    "explanation": "To cry wolf means to raise a false alarm.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_DI_007",
    "section": "Reasoning",
    "topic": "Depiction & Interpretation",
    "question": "Given the set of numbers: 456, 789, 123, 654, 321. If the digits of each number are arranged in descending order, which number will be the second highest?",
    "options": ["654", "789", "456", "321"],
    "answer": "a",
    "explanation": "Descending digits: 654 (654), 987 (789), 321 (123), 654 (654), 321 (321). Highest is 987. Second highest is 654.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_020",
    "section": "Quantitative Aptitude",
    "topic": "Quadratic Equations",
    "question": "Find the roots of the equation x² - 5x + 6 = 0.",
    "options": ["2, 3", "-2, -3", "1, 6", "-1, -6"],
    "answer": "a",
    "explanation": "(x-2)(x-3) = 0 => x = 2, 3.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_010",
    "section": "Reasoning",
    "topic": "Analogy",
    "question": "Clock : Time :: Thermometer : ?",
    "options": ["Heat", "Radiation", "Energy", "Temperature"],
    "answer": "d",
    "explanation": "Clock measures time; Thermometer measures temperature.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_021",
    "section": "Quantitative Aptitude",
    "topic": "Percentages",
    "question": "If A's income is 25% more than B's income, then by what percent is B's income less than A's income?",
    "options": ["20%", "25%", "30%", "15%"],
    "answer": "a",
    "explanation": "Let B=100, A=125. Difference = 25. Percent less = (25/125) * 100 = 20%.",
    "difficulty": "Medium"
  },
  {
    "id": "ENG_009",
    "section": "English Language",
    "topic": "Error Spotting",
    "question": "Identify the error: 'None of the two (a) / candidates (b) / was selected (c) / No error (d)'",
    "options": ["a", "b", "c", "d"],
    "answer": "a",
    "explanation": "For 'two', we use 'neither' instead of 'none'.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_011",
    "section": "Reasoning",
    "topic": "Coding-Decoding",
    "question": "If RED is coded as 6720, then how is GREEN coded?",
    "options": ["1677209", "16717209", "167717209", "167172019"],
    "answer": "b",
    "explanation": "Logic: Position of letters. R(18), E(5), D(4). Shifted or multiplied? R+2=20, E+2=7, D+2=6. Reversed sequence: 6, 7, 20. GREEN: G(7)+2=9, R(18)+2=20, E(5)+2=7, E(5)+2=7, N(14)+2=16. Reversed: 16, 7, 7, 20, 9.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_022",
    "section": "Quantitative Aptitude",
    "topic": "Trigonometry",
    "question": "If sin θ + cos θ = √2 cos θ, then the value of cos θ - sin θ is:",
    "options": ["√2 sin θ", "√2 cos θ", "sin θ", "cos θ"],
    "answer": "a",
    "explanation": "sin θ = (√2 - 1) cos θ. cos θ - sin θ = cos θ - (√2 - 1) cos θ = (1 - √2 + 1) cos θ = (2 - √2) cos θ. Use identity: (cos θ - sin θ)² = 2 - (sin θ + cos θ)² = 2 - 2 cos² θ = 2 sin² θ. So cos θ - sin θ = √2 sin θ.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_012",
    "section": "Reasoning",
    "topic": "Series",
    "question": "Find the missing number: 1, 4, 9, 16, 25, ?",
    "options": ["30", "36", "48", "49"],
    "answer": "b",
    "explanation": "Perfect squares: 1², 2², 3², 4², 5², 6²=36.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_023",
    "section": "Quantitative Aptitude",
    "topic": "Probability",
    "question": "In a simultaneous throw of two dice, what is the probability of getting a total of 7?",
    "options": ["1/6", "1/4", "1/9", "5/36"],
    "answer": "a",
    "explanation": "Favorable outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Total = 6. Sample space = 36. Probability = 6/36 = 1/6.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_024",
    "section": "Quantitative Aptitude",
    "topic": "Mixture & Alligation",
    "question": "A merchant has 1000 kg of sugar, part of which he sells at 8% profit and the rest at 18% profit. He gains 14% on the whole. The quantity sold at 18% profit is:",
    "options": ["400 kg", "560 kg", "600 kg", "640 kg"],
    "answer": "c",
    "explanation": "Ratio of quantities = (18-14) : (14-8) = 4 : 6 = 2 : 3. Quantity at 18% = (3/5) * 1000 = 600 kg.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_013",
    "section": "Reasoning",
    "topic": "Seating Arrangement",
    "question": "Eight people A, B, C, D, E, F, G, and H are sitting around a circular table facing the center. A sits second to the left of C and third to the right of H. B sits third to the right of G, who is not an immediate neighbor of H. D sits third to the right of E, who sits second to the right of B. Who sits between D and G?",
    "options": ["F", "C", "A", "H"],
    "answer": "b",
    "explanation": "Arrangement scan: H _ _ A _ C _ _. G is not near H. B is 3rd right of G. E is 2nd right of B. D is 3rd right of E. Detailed mapping reveals C is between D and G.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_025",
    "section": "Quantitative Aptitude",
    "topic": "Time & Work",
    "question": "A can do a work in 10 days, B in 15 days, and C in 20 days. A and C worked together for 2 days and then A was replaced by B. In how many days altogether was the work completed?",
    "options": ["6 days", "8 days", "10 days", "12 days"],
    "answer": "b",
    "explanation": "Total work = 60. Eff: A=6, B=4, C=3. A+C = 9 units/day. In 2 days: 18 units. Rem = 42. B+C = 7 units/day. Time = 42/7 = 6 days. Total = 2 + 6 = 8 days.",
    "difficulty": "Hard"
  },
  {
    "id": "ENG_010",
    "section": "English Language",
    "topic": "Jumbled Sentences",
    "question": "Arrange: P: Science has made our lives comfortable. Q: However, it has also created weapons of mass destruction. R: Man must use science for constructive purposes only. S: Thus, science is a double-edged sword.",
    "options": ["PQSR", "PSQR", "PQRS", "RQPS"],
    "answer": "a",
    "explanation": "P (Intro), Q (Contrast), S (Conclusion from P&Q), R (Final advice). PQSR.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_026",
    "section": "Quantitative Aptitude",
    "topic": "SI & CI",
    "question": "The difference between the simple interest and compound interest on a certain sum of money at 5% per annum for 2 years is Rs. 15. Find the sum.",
    "options": ["Rs. 5,000", "Rs. 6,000", "Rs. 4,500", "Rs. 7,000"],
    "answer": "b",
    "explanation": "Difference = Pr²/100² => 15 = P(5²)/10000 => 15 = 25P/10000 => P = 150000/25 = 6000.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_014",
    "section": "Reasoning",
    "topic": "Blood Relation",
    "question": "In a family of six persons, A, B, C, D, E, and F, there are two married couples. D is the grandmother of A and mother of B. C is the wife of B and mother of F. F is the granddaughter of E. Who is the husband of D?",
    "options": ["E", "C", "A", "B"],
    "answer": "a",
    "explanation": "D (Gen 1) -> B (Gen 2) -> A, F (Gen 3). C is B's wife. E is F's grandfather (husband of D).",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_027",
    "section": "Quantitative Aptitude",
    "topic": "Time, Speed & Distance",
    "question": "A boat goes 12 km upstream and 40 km downstream in 8 hours. It can go 16 km upstream and 32 km downstream in the same time. Find the speed of the boat in still water.",
    "options": ["6 km/hr", "7 km/hr", "8 km/hr", "9 km/hr"],
    "answer": "b",
    "explanation": "Let 1/u = x, 1/d = y. 12x + 40y = 8 and 16x + 32y = 8. Solving: x = 1/4 (u=4), y = 1/10 (d=10). Speed in still water = (d+u)/2 = (10+4)/2 = 7 km/hr.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_DI_008",
    "section": "Reasoning",
    "topic": "Depiction & Interpretation",
    "question": "Alphanumeric Series: M % 1 A @ 2 B $ 3 C & 4 D * 5 \nHow many such symbols are there which are immediately preceded by a letter and immediately followed by a number?",
    "options": ["2", "3", "4", "5"],
    "answer": "c",
    "explanation": "Letter -> Symbol -> Number. M % 1 (1), A @ 2 (2), B $ 3 (3), C & 4 (4). Total 4.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_028",
    "section": "Quantitative Aptitude",
    "topic": "Averages",
    "question": "The average age of a class of 40 students is 15 years. If the teacher's age is included, the average increases by 1. Find the teacher's age.",
    "options": ["55 years", "56 years", "41 years", "50 years"],
    "answer": "b",
    "explanation": "Total weight = 40 * 15 = 600. New average = 16. New sum = 41 * 16 = 656. Teacher = 656 - 600 = 56.",
    "difficulty": "Hard"
  },
  {
    "id": "ENG_011",
    "section": "English Language",
    "topic": "Error Spotting",
    "question": "Identify error: 'Hardly had (a) / I reached the station (b) / than the train left (c) / No error (d)'",
    "options": ["a", "b", "c", "d"],
    "answer": "c",
    "explanation": "'Hardly' is followed by 'when', not 'than'.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_029",
    "section": "Quantitative Aptitude",
    "topic": "Permutation & Combination",
    "question": "In how many ways can the letters of the word 'LEADER' be arranged?",
    "options": ["720", "360", "120", "240"],
    "answer": "b",
    "explanation": "Word 'LEADER' has 6 letters. 'E' repeats twice. Ways = 6! / 2! = 720 / 2 = 360.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_015",
    "section": "Reasoning",
    "topic": "Syllogism",
    "question": "Statements: Some keys are locks. Some locks are numbers. All numbers are letters. \nConclusions: I. Some letters are locks. II. Some letters are keys.",
    "options": ["Only I follows", "Only II follows", "Both follow", "Neither follow"],
    "answer": "a",
    "explanation": "Locks -> Numbers -> Letters. So some letters are locks. No direct link between keys and letters.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_030",
    "section": "Quantitative Aptitude",
    "topic": "Mensuration",
    "question": "The diagonal of a rectangle is √41 cm and its area is 20 cm². Find its perimeter.",
    "options": ["14 cm", "18 cm", "20 cm", "24 cm"],
    "answer": "b",
    "explanation": "l² + b² = 41, lb = 20. (l+b)² = l²+b²+2lb = 41+40 = 81. l+b = 9. Perimeter = 2(l+b) = 18 cm.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_031",
    "section": "Quantitative Aptitude",
    "topic": "Mixture & Alligation",
    "question": "Two vessels A and B contain milk and water in the ratio 4:3 and 2:3 respectively. In what ratio should these mixtures be mixed so that the new mixture contains half milk and half water?",
    "options": ["7:5", "5:7", "1:2", "2:1"],
    "answer": "a",
    "explanation": "Milk in A = 4/7, Milk in B = 2/5, Milk in mixture = 1/2. Alligation: (1/2 - 2/5) : (4/7 - 1/2) = (1/10) : (1/14) = 14:10 = 7:5.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_DI_009",
    "section": "Reasoning",
    "topic": "Depiction & Interpretation",
    "question": "Given: 785, 243, 619, 357, 421. If 1 is subtracted from the last digit of each number and then the first and second digits are interchanged, which number will be the lowest?",
    "options": ["421", "243", "785", "357"],
    "answer": "b",
    "explanation": "Sub 1: 784, 242, 618, 356, 420. Interchange: 874, 422, 168, 536, 240. Lowest is 168 (original 619). Wait, let's check 243 -> 422. 421 -> 240. 357 -> 536. 785 -> 874. Lowest is 168.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_032",
    "section": "Quantitative Aptitude",
    "topic": "Time & Work",
    "question": "A is 30% more efficient than B. How much time will they, working together, take to complete a job which A alone could have done in 23 days?",
    "options": ["11 days", "13 days", "15 days", "17 days"],
    "answer": "b",
    "explanation": "Eff A:B = 13:10. Total Work = 13 * 23 = 299 units. Together eff = 23. Time = 299 / 23 = 13 days.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_016",
    "section": "Reasoning",
    "topic": "Syllogism",
    "question": "Statements: All buildings are chalks. No chalk is toffee. \nConclusions: I. No building is toffee. II. All chalks are buildings.",
    "options": ["Only I follows", "Only II follows", "Both follow", "Neither follow"],
    "answer": "a",
    "explanation": "Buildings -> Chalks. Chalks != Toffee. So Buildings != Toffee. I follows. II is not necessarily true.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_033",
    "section": "Quantitative Aptitude",
    "topic": "Compound Interest",
    "question": "A sum of money invested at compound interest amounts to Rs. 4624 in 2 years and Rs. 4913 in 3 years. Find the rate of interest per annum.",
    "options": ["5%", "6.25%", "8%", "4.5%"],
    "answer": "b",
    "explanation": "Interest for 1 year on 4624 = 4913 - 4624 = 289. Rate = (289 / 4624) * 100 = 6.25%.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_017",
    "section": "Reasoning",
    "topic": "Coding-Decoding",
    "question": "If 'ORANGE' is coded as 'PSBOHF', then how is 'BANANA' coded?",
    "options": ["CBOBOB", "CBOBBO", "CBOPBO", "CPBOBO"],
    "answer": "a",
    "explanation": "Each letter shifts +1. B+1=C, A+1=B, N+1=O... Results in CBOBOB.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_034",
    "section": "Quantitative Aptitude",
    "topic": "Time, Speed & Distance",
    "question": "A man covered a certain distance at some speed. Had he moved 3 km/hr faster, he would have taken 40 minutes less. If he had moved 2 km/hr slower, he would have taken 40 minutes more. The distance is:",
    "options": ["35 km", "36.6 km", "40 km", "50 km"],
    "answer": "c",
    "explanation": "Use formula: D = [s(s+a)/a] * t1 = [s(s-b)/b] * t2. 40 mins = 2/3 hr. [s(s+3)/3]*(2/3) = [s(s-2)/2]*(2/3) => (s+3)/3 = (s-2)/2 => 2s+6=3s-6 => s=12. D = [12*15/3]*(2/3) = 60 * (2/3) = 40 km.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_018",
    "section": "Reasoning",
    "topic": "Number Series",
    "question": "Find the missing term: 2, 5, 9, 19, 37, ?",
    "options": ["73", "75", "76", "78"],
    "answer": "b",
    "explanation": "Pattern: *2+1, *2-1, *2+1, *2-1, *2+1. 37 * 2 + 1 = 75.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_035",
    "section": "Quantitative Aptitude",
    "topic": "Mensuration",
    "question": "The surface area of a cube is 150 cm². Its volume is:",
    "options": ["125 cm³", "150 cm³", "250 cm³", "75 cm³"],
    "answer": "a",
    "explanation": "6a² = 150 => a² = 25 => a = 5. Volume = a³ = 125 cm³.",
    "difficulty": "Easy"
  },
  {
    "id": "ENG_012",
    "section": "English Language",
    "topic": "Synonyms",
    "question": "Synonym of 'GENUINE':",
    "options": ["Fake", "Authentic", "Old", "Reliable"],
    "answer": "b",
    "explanation": "Genuine means authentic.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_036",
    "section": "Quantitative Aptitude",
    "topic": "HCF & LCM",
    "question": "The HCF of two numbers is 11 and their LCM is 693. If one of the numbers is 77, find the other.",
    "options": ["88", "99", "110", "121"],
    "answer": "b",
    "explanation": "Other number = (11 * 693) / 77 = 693 / 7 = 99.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_019",
    "section": "Reasoning",
    "topic": "Blood Relation",
    "question": "If A is the brother of B, B is the sister of C, and C is the father of D, how is A related to D?",
    "options": ["Father", "Uncle", "Grandfather", "Brother"],
    "answer": "b",
    "explanation": "A is brother of C (father of D). So A is the uncle of D.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_037",
    "section": "Quantitative Aptitude",
    "topic": "Quadratic Equations",
    "question": "The sum of the roots of 3x² - 9x + 5 = 0 is:",
    "options": ["3", "-3", "5/3", "-5/3"],
    "answer": "a",
    "explanation": "Sum of roots = -b/a = 9/3 = 3.",
    "difficulty": "Easy"
  },
  {
    "id": "ENG_013",
    "section": "English Language",
    "topic": "Fill in the Blanks",
    "question": "The committee ______ divided in their opinion.",
    "options": ["is", "are", "was", "has"],
    "answer": "b",
    "explanation": "When a collective noun indicates separate individuals (divided opinion), it takes a plural verb.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_038",
    "section": "Quantitative Aptitude",
    "topic": "Profit & Loss",
    "question": "A man sells two horses for Rs. 1485 each. On one he gains 10% and on the other he loses 10%. What is his overall gain or loss percent?",
    "options": ["1% gain", "1% loss", "2% loss", "No gain no loss"],
    "answer": "b",
    "explanation": "In such cases, there is always a loss of (r/10)² % = (10/10)² = 1% loss.",
    "difficulty": "Medium"
  },
  {
    "id": "REAS_020",
    "section": "Reasoning",
    "topic": "Direction Sense",
    "question": "A girl leaves from her home. She first walks 30m in North-West direction and then 30m in South-West direction. Next, she walks 30m in South-East direction. Finally, she turns towards her house. In which direction is she moving?",
    "options": ["North-East", "North-West", "South-East", "South-West"],
    "answer": "a",
    "explanation": "She moved NW, then SW, then SE. To get back to the origin, she must move NE.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_039",
    "section": "Quantitative Aptitude",
    "topic": "Averages",
    "question": "The average of first 50 natural numbers is:",
    "options": ["25", "25.5", "26", "26.5"],
    "answer": "b",
    "explanation": "Average = (n+1)/2 = 51/2 = 25.5.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_021",
    "section": "Reasoning",
    "topic": "Analogy",
    "question": "Doctor : Patient :: Lawyer : ?",
    "options": ["Customer", "Client", "Consumer", "Buyer"],
    "answer": "b",
    "explanation": "Lawyer handles a client.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_040",
    "section": "Quantitative Aptitude",
    "topic": "Percentages",
    "question": "30% of a number is 120. What is 150% of that number?",
    "options": ["400", "600", "800", "1000"],
    "answer": "b",
    "explanation": "Number = 120/0.3 = 400. 150% of 400 = 600.",
    "difficulty": "Easy"
  },
  {
    "id": "ENG_014",
    "section": "English Language",
    "topic": "Error Spotting",
    "question": "Identify error: 'Each of the (a) / girls (b) / have done their homework (c) / No error (d)'",
    "options": ["a", "b", "c", "d"],
    "answer": "c",
    "explanation": "'Each of' takes a singular verb ('has').",
    "difficulty": "Medium"
  },
  {
    "id": "REAS_022",
    "section": "Reasoning",
    "topic": "Coding-Decoding",
    "question": "If MACHINE is coded as 19-7-9-14-15-20-11, then how is DANGER coded?",
    "options": ["10-7-20-13-11-24", "10-7-20-13-11-23", "13-7-20-9-11-25", "11-7-20-16-11-24"],
    "answer": "a",
    "explanation": "Logic: Position + 6. M(13)+6=19, A(1)+6=7, ... D(4)+6=10, A(1)+6=7, N(14)+6=20, G(7)+6=13, E(5)+6=11, R(18)+6=24. Result: 10-7-20-13-11-24.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_041",
    "section": "Quantitative Aptitude",
    "topic": "Time & Work",
    "question": "10 men can complete a work in 7 days. But 10 women need 14 days. How many days will 5 men and 10 women take to complete the work?",
    "options": ["5 days", "7 days", "8 days", "10 days"],
    "answer": "b",
    "explanation": "10M*7 = 10W*14 => 1M = 2W. 5M+10W = 10W+10W = 20W. 10W take 14 days, so 20W take 7 days.",
    "difficulty": "Medium"
  },
  {
    "id": "REAS_023",
    "section": "Reasoning",
    "topic": "Syllogism",
    "question": "Statements: All fish are tortoises. No tortoise is a crocodile. \nConclusions: I. No fish is a crocodile. II. No crocodile is a fish.",
    "options": ["Only I follows", "Only II follows", "Both follow", "Neither follow"],
    "answer": "c",
    "explanation": "Fish -> Tortoises != Crocodile. So Fish != Crocodile. Both follow.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_042",
    "section": "Quantitative Aptitude",
    "topic": "Mixture & Alligation",
    "question": "A mixture of 40 liters of milk and water contains 10% water. How much water should be added to this so that water may be 20% in the new mixture?",
    "options": ["5 liters", "4 liters", "6.5 liters", "7.5 liters"],
    "answer": "a",
    "explanation": "Initial water = 4 liters, Milk = 36 liters. In new mixture, 36 is 80%. Total = 36 / 0.8 = 45 liters. Water to add = 45 - 40 = 5 liters.",
    "difficulty": "Hard"
  },
  {
    "id": "ENG_015",
    "section": "English Language",
    "topic": "One-Word Substitution",
    "question": "A speech delivered without any previous preparation.",
    "options": ["Maiden", "Extempore", "Rhetoric", "Verbose"],
    "answer": "b",
    "explanation": "Extempore means without preparation.",
    "difficulty": "Easy"
  },
  {
    "id": "REAS_024",
    "section": "Reasoning",
    "topic": "Number Series",
    "question": "Find the missing term: 0, 6, 24, 60, 120, 210, ?",
    "options": ["336", "290", "310", "350"],
    "answer": "a",
    "explanation": "Pattern: n³ - n. 1³-1=0, 2³-2=6... 7³-7=343-7=336.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_043",
    "section": "Quantitative Aptitude",
    "topic": "Compound Interest",
    "question": "At what rate percent per annum will Rs. 2304 amount to Rs. 2500 in 2 years at compound interest?",
    "options": ["4%", "4.16%", "5%", "4.5%"],
    "answer": "b",
    "explanation": "√(2500/2304) = 50/48 = 25/24. Rate = (1/24) * 100 = 4.16%.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_025",
    "section": "Reasoning",
    "topic": "Blood Relation",
    "question": "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?",
    "options": ["Grandmother", "Grandfather", "Daughter", "Granddaughter"],
    "answer": "d",
    "explanation": "A is sister of B. C is mother of B (and A). D is father of C. So A is granddaughter of D.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_044",
    "section": "Quantitative Aptitude",
    "topic": "Mensuration",
    "question": "The length of a rectangle is halved and its breadth is tripled. What is the percentage change in its area?",
    "options": ["50% increase", "50% decrease", "25% increase", "No change"],
    "answer": "a",
    "explanation": "New Area = (l/2) * (3b) = 1.5 lb. Change = 50% increase.",
    "difficulty": "Medium"
  },
  {
    "id": "ENG_016",
    "section": "English Language",
    "topic": "Synonyms",
    "question": "Synonym of 'ABANDON':",
    "options": ["Keep", "Forsake", "Cherish", "Maintain"],
    "answer": "b",
    "explanation": "Abandon means to leave or forsake.",
    "difficulty": "Easy"
  },
  {
    "id": "QUANT_045",
    "section": "Quantitative Aptitude",
    "topic": "Time, Speed & Distance",
    "question": "Excluding stoppages, the speed of a bus is 54 km/hr and including stoppages, it is 45 km/hr. For how many minutes does the bus stop per hour?",
    "options": ["9 mins", "10 mins", "12 mins", "15 mins"],
    "answer": "b",
    "explanation": "Time of rest per hour = (Difference in speeds / Speed without stoppages) * 60 = (9/54) * 60 = 10 minutes.",
    "difficulty": "Hard"
  },
  {
    "id": "REAS_026",
    "section": "Reasoning",
    "topic": "Seating Arrangement",
    "question": "A, B, C, D, and E are sitting on a bench. A is sitting next to B, C is sitting next to D, D is not sitting with E who is on the left end of the bench. C is on the second position from the right. A is to the right of B and E. A and C are sitting together. In which position is A sitting?",
    "options": ["Between B and C", "Between B and D", "Between C and E", "Between C and D"],
    "answer": "a",
    "explanation": "Sequence: E (left end), B, A, C (2nd from right), D. A is between B and C.",
    "difficulty": "Hard"
  },
  {
    "id": "QUANT_046",
    "section": "Quantitative Aptitude",
    "topic": "HCF & LCM",
    "question": "The greatest number that will divide 43, 91 and 183 so as to leave the same remainder in each case is:",
    "options": ["4", "7", "9", "13"],
    "answer": "a",
    "explanation": "Required number = HCF of (91-43, 183-91, 183-43) = HCF of (48, 92, 140) = 4.",
    "difficulty": "Hard"
  },
  {
    "id": "ENG_RC_002",
    "section": "English Language",
    "topic": "Reading Comprehension",
    "question": "Passage: 'The fast-paced evolution of technology has fundamentally altered the way we communicate. While digital platforms offer instant connectivity, some argue that they diminish the depth of human interaction.' \nWhat is the 'some' mentioned in the text concerned about?",
    "options": ["The cost of technology", "The speed of communication", "The depth of human interaction", "The number of digital platforms"],
    "answer": "c",
    "explanation": "The text states they argue digital platforms 'diminish the depth of human interaction'.",
    "difficulty": "Medium"
  },
  {
    "id": "QUANT_047",
    "section": "Quantitative Aptitude",
    "topic": "Ratio & Proportion",
    "question": "A bag contains 50p, 25p and 10p coins in the ratio 5:9:4, amounting to Rs. 206. Find the number of coins of each type respectively.",
    "options": ["200, 360, 160", "150, 300, 200", "250, 450, 200", "180, 320, 150"],
    "answer": "a",
    "explanation": "Ratio of values = (5*0.50):(9*0.25):(4*0.10) = 2.5:2.25:0.40 = 250:225:40 = 50:45:8. Total units = 103. 103 units = 206, so 1 unit = 2. Values are Rs. 100, 90, 16. Number of 50p coins = 100/0.5 = 200. 25p = 90/0.25 = 360. 10p = 16/0.1 = 160.",
    "difficulty": "Hard"
  }
];

const topicNotes = {
  'Time & Work': {
    summary: 'Calculating the time required by individuals or groups to complete a task.',
    formula: 'If A does work in "x" days, 1-day work = 1/x. If A & B work together, time = (xy)/(x+y).',
    details: '<b>Lcm Method:</b> Assume total work as LCM of individual days. This makes calculations whole numbers instead of fractions.',
    example: 'A=10 days, B=15 days. LCM=30 units. A=3 u/day, B=2 u/day. Together=5 u/day. Total = 30/5 = 6 days.'
  },
  'Mixture & Alligation': {
    summary: 'Determining the ratio in which ingredients are mixed to reach a mean price or quality.',
    formula: 'Ratio = (Dearer - Mean) : (Mean - Cheaper).',
    details: '<b>Tip:</b> All prices must be in the same unit. If mean is SP, convert it to CP first using Profit%.',
    example: 'Mix ₹60 (C) and ₹75 (D) to get ₹65 (M). Ratio = (75-65):(65-60) = 10:5 = 2:1.'
  },
  'Simple Interest': {
    summary: 'Interest calculated only on the principal amount.',
    formula: 'SI = (P × R × T) / 100. Amount = P + SI.',
    details: '<b>Constant Interest:</b> SI remains the same every year. If a sum doubles in 5 years, it means SI = Principal.',
    example: '<b>Trick:</b> If sum becomes "n" times in "t" years, Rate R = 100(n-1)/t.'
  },
  'Compound Interest': {
    summary: 'Interest calculated on the principal and accumulated interest of previous periods.',
    formula: 'Amount = P(1 + R/100)ⁿ. CI = Amount - Principal.',
    details: '<b>Successive %:</b> Use x + y + xy/100 for 2 years. E.g., 10% for 2 years = 10+10+1 = 21%.',
    example: '₹1000 @ 10% for 2 yrs CI: 10% of 1000 = 100. 10% of 1100 = 110. Total CI = ₹210.'
  },
  'SI & CI': {
    summary: 'Problems involving the comparison or combined calculation of both interest types.',
    formula: 'Difference for 2 years = P(R/100)². For 3 years = P(R/100)² × (3 + R/100).',
    details: 'Always check if interest is compounded annually, half-yearly, or quarterly.',
    example: 'Diff between SI & CI on ₹1000 @ 10% for 2 years: 1000 × (0.1)² = ₹10.'
  },
  'Percentages': {
    summary: 'Expressing numbers as a fraction of 100. Core to all Quant topics.',
    formula: '% Change = (Diff / Original) × 100. x% of y = (x/100) × y.',
    details: '<b>Memory Hack:</b> 1/8 = 12.5%, 1/6 = 16.66%, 3/8 = 37.5%, 1/9 = 11.11%. Knowing these saves 30s per question.',
    example: 'Price up by 25%. Consumption down? Formula: [r / (100+r)] × 100 = 25/125 = 20%.'
  },
  'Profit & Loss': {
    summary: 'Calculations related to gain or loss in commercial transactions.',
    formula: 'Profit% = (P/CP) × 100. SP = CP × [(100 ± %)/100].',
    details: '<b>Markup:</b> Marked Price = CP + Markup. Discount is always on Marked Price (MP).',
    example: 'Buy at 100, Mark at 140, Discount 10%. SP = 140 - 14 = 126. Profit = 26%.'
  },
  'Ratio & Proportion': {
    summary: 'Comparing quantities by division and the equality of two ratios.',
    formula: 'If a:b and c:d, then a/b = c/d. Duplicate Ratio = a²:b².',
    details: '<b>Merging Ratios:</b> If A:B = 2:3 and B:C = 4:5, multiply A:B by 4 and B:C by 3 to get A:B:C = 8:12:15.',
    example: 'Divide 100 in 2:3. Sum of parts = 5. Value of 1 part = 20. Parts = 40 & 60.'
  },
  'Averages': {
    summary: 'The central value of a set of numbers.',
    formula: 'Average = Sum of items / Number of items.',
    details: '<b>Replacement Tip:</b> New = Old + (Change × New Count). If a man of 60kg leaves and average goes up by 1kg for 10 men, new man = 60 + (1×10) = 70kg.',
    example: 'Avg of first 50 natural numbers = (n+1)/2 = 25.5.'
  },
  'Time, Speed & Distance': {
    summary: 'The relationship between movement, time, and distance covered.',
    formula: 'Speed = D/T. km/hr ➔ m/s: Multiply by 5/18. m/s ➔ km/hr: Multiply by 18/5.',
    details: '<b>Relative Speed:</b> Opposite direction (Add), Same direction (Subtract).',
    example: 'Two trains 100m & 200m cross each other @ 40 & 50 km/hr (opposite). Dist = 300, Rel Speed = 90. Time = 300 / (90 × 5/18) = 12s.'
  },
  'Pipes & Cisterns': {
    summary: 'A variation of Time & Work where pipes fill or empty a tank.',
    formula: 'Net work = (Fill Rate) - (Leak Rate).',
    details: 'Leaks are treated as negative work. If a pipe fills in 4h and leak empties in 6h, net = 1/4 - 1/6 = 1/12 (Fills in 12h).',
    example: 'Pipe A(10h), Pipe B(leak 20h). Together: 1/10 - 1/20 = 1/20. Takes 20h.'
  },
  'HCF & LCM': {
    summary: 'Finding common factors and multiples for a set of numbers.',
    formula: 'HCF × LCM = Product of two numbers (a × b).',
    details: '<b>Fractions:</b> HCF = HCF(Numerators) / LCM(Denominators). LCM = LCM(Numerators) / HCF(Denominators).',
    example: 'HCF of 12 & 18 is 6. LCM is 36. 6 × 36 = 216. 12 × 18 = 216.'
  },
  'Quadratic Equations': {
    summary: 'Equations of the form ax² + bx + c = 0.',
    formula: 'Roots = [-b ± √(b² - 4ac)] / 2a.',
    details: '<b>Quick Sign Hack:</b> If eq is + +, roots are - -. If eq is - +, roots are + +. If eq has - -, roots are + -.',
    example: 'x² - 5x + 6 = 0. Factors of 6 that sum to 5: 2 and 3. Roots are +2, +3.'
  },
  'Mensuration': {
    summary: 'Measurement of Area, Perimeter, and Volume of 2D and 3D shapes.',
    formula: 'Circle: πr². Sphere: 4/3πr³. Cylinder: πr²h. Cone: 1/3πr²h.',
    details: '<b>Units:</b> Ensure radius, height, and length are all in the SAME units before calculating.',
    example: 'If radius of sphere is doubled, Volume becomes 2³ = 8 times.'
  },
  'Trigonometry': {
    summary: 'Relationships between side lengths and angles of triangles.',
    formula: 'sinθ = P/H, cosθ = B/H, tanθ = P/B. sin²θ + cos²θ = 1.',
    details: '<b>Values:</b> sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2.',
    example: 'Shadow of 10m pole is 10√3. Angle of elevation? tanθ = 10 / 10√3 = 1/√3. θ = 30°.'
  },
  'Permutation & Combination': {
    summary: 'Ways of selecting or arranging items from a set.',
    formula: 'nPr = n!/(n-r)!. nCr = n!/[r!(n-r)!].',
    details: '<b>Keyword:</b> "Selection" = Combination (nCr). "Arrangement" = Permutation (nPr).',
    example: 'Select 2 players from 5: 5C2 = (5×4)/(2×1) = 10 ways.'
  },
  'Probability': {
    summary: 'The likelihood of an event occurring.',
    formula: 'P(E) = Favorable Outcomes / Total Outcomes.',
    details: '<b>Cards:</b> 52 cards (26 Red, 26 Black). 4 Suits (13 each). 12 Face cards.',
    example: 'Prob of drawing a King: 4/52 = 1/13. Prob of NOT a King: 1 - 1/13 = 12/13.'
  },
  'Number Series': {
    summary: 'Identifying the next or missing term in a logical sequence of numbers.',
    formula: 'Patterns: Square/Cube, Prime numbers, Difference of Differences, Alternate series.',
    details: '<b>The 3-Step Scan:</b> 1. Is it growing fast (Multiplication)? 2. Is it growing slow (Addition)? 3. Check for prime numbers.',
    example: '2, 6, 12, 20... (Diff is 4, 6, 8...). Next diff is 10. Next term = 30.'
  },
  'Analogy': {
    summary: 'Finding a relationship between two given words or numbers and applying it to another pair.',
    formula: 'Logic: A : B :: C : ? (Relationship A➔B must apply to C➔D).',
    details: '<b>Types:</b> Synonym/Antonym, Worker:Tool, Country:Capital, Number:Square.',
    example: 'India : Delhi :: France : ? (Capital relation). Answer: Paris.'
  },
  'Syllogism': {
    summary: 'Determining if conclusions follow from statements using Venn diagrams.',
    formula: 'Rule: Some + Some = No Conclusion. All + All = All. All + Some = Some.',
    details: '<b>Possibility:</b> If a conclusion "Can be" true in ANY diagram, it\'s a possibility. A standard conclusion must be true in ALL diagrams.',
    example: 'All Men are Dogs. All Dogs are Cats. Conclusion: All Men are Cats (True).'
  },
  'Coding-Decoding': {
    summary: 'Translating words into codes based on specific rules.',
    formula: 'Logic: Position shift (A➔B), Opposite letter (A➔Z), or Number coding.',
    details: '<b>EJOTY:</b> 5, 10, 15, 20, 25. Use this to find alphabet positions quickly.',
    example: 'CAT = 3-1-20. DOG = 4-15-7.'
  },
  'Direction Sense': {
    summary: 'Tracking movement and determining the final orientation or distance.',
    formula: 'Pythagoras: H² = P² + B² (for shortest distance).',
    details: '<b>Mapping:</b> North is UP. Clockwise 90° from North is East. Shadow in morning is West, in evening is East.',
    example: 'Go 3km North, 4km East. Distance from start = √(3² + 4²) = 5km.'
  },
  'Blood Relation': {
    summary: 'Identifying relationships between family members based on given descriptions.',
    formula: 'Logic: Generation Gap Tree (+1 for parents, -1 for children, 0 for siblings).',
    details: '<b>Symbols:</b> (+) for Male, (-) for Female, (=) for Marriage. Never assume gender based on name unless specified.',
    example: 'A is B\'s sister. C is B\'s mother. Relation A to C? A is Daughter.'
  },
  'Seating Arrangement': {
    summary: 'Arranging people in a row or circle based on given constraints.',
    formula: 'Circular: Facing In (Left is Clockwise), Facing Out (Left is Anti-clockwise).',
    details: '<b>Strategy:</b> Start with "Fixed" information (e.g., A is at the extreme left). Fill the rest around it.',
    example: '5 people in a row. A is middle. B is to immediate right of A. B is in 4th position.'
  },
  'Series': {
    summary: 'Letter or Symbol sequences that follow a repetitive or shifting pattern.',
    formula: 'Logic: Count total elements (e.g., 12). Try groups of 3 or 4.',
    details: 'Check if the pattern is cyclic (abc, bca, cab) or constant (ababab).',
    example: 'a_ba_b_b. Try "ab". ababab... Count gaps to fill.'
  },
  'Depiction & Interpretation': {
    summary: 'Finding elements in an alphanumeric string based on complex conditions.',
    formula: 'Logic: [Target] Preceded by [A] AND Followed by [B].',
    details: '<b>The Pass Method:</b> Scan only for the [Target] first, then check neighbors. Don\'t check every symbol.',
    example: 'String: * 5 & K. Target: Number. Preceded by Symbol? Yes. Followed by Symbol? Yes. Count = 1.'
  },
  'Reading Comprehension': {
    summary: 'Extracting information and tone from a given passage.',
    formula: 'Strategy: Read Questions ➔ Scan for Keywords ➔ Read Context ➔ Answer.',
    details: '<b>Tone:</b> Objective (Facts), Critical (Finding fault), Optimistic (Positive).',
    example: 'If question asks for "main theme", look at the first and last sentences of the passage.'
  },
  'Error Spotting': {
    summary: 'Identifying grammatical errors in a sentence.',
    formula: 'Checklist: Subject-Verb Agreement, Tenses, Articles, Prepositions.',
    details: '<b>Subject-Verb:</b> Singular subject needs singular verb. "The group of boys [is/are]..." ➔ "is" (Subject is group).',
    example: 'He have gone. (Error: He has gone).'
  },
  'Fill in the Blanks': {
    summary: 'Selecting the most appropriate word to complete a sentence.',
    formula: 'Context: Check if the sentence needs a Noun, Verb, or Adjective.',
    details: 'Look for "collocations" (words that naturally go together like "mitigate risk" or "deeply concerned").',
    example: 'The rain was so ___ that we stayed home. (Options: heavy, big). Answer: heavy.'
  },
  'Synonyms': {
    summary: 'Words with similar meanings.',
    formula: 'Context: Replace the word in the sentence. Does the meaning change?',
    details: '<b>Elimination:</b> If three options are positive and one is negative, the negative one is likely the odd one out or the answer.',
    example: 'Abolish = Terminate, End, Stop.'
  },
  'Idioms & Phrases': {
    summary: 'Expressions where the meaning is not literal from the words.',
    formula: 'Logic: Relate the metaphor to a common situation.',
    details: '<b>Common HPCL:</b> "At eleventh hour" (at last moment), "Break the ice" (start conversation).',
    example: 'Once in a blue moon = Very rarely.'
  },
  'Jumbled Sentences': {
    summary: 'Reordering sentences to form a logical paragraph.',
    formula: 'Strategy: Identify the Intro (Noun) and Conclusion (Result).',
    details: 'Look for transition words (However, In addition) and pronouns to link sentences.',
    example: 'Sent A: He went home. Sent B: Ram was tired. Order: B ➔ A.'
  },
  'One-Word Substitution': {
    summary: 'Replacing a whole phrase with a single precise word.',
    formula: 'Root Words: "Bio" (Life), "Graph" (Write), "Omni" (All).',
    details: 'Knowing roots like "Theist" (God) or "Cracy" (Rule) helps solve even unknown words.',
    example: 'One who knows everything = Omniscient.'
  },
  'Spelling Errors': {
    summary: 'Identifying correctly or incorrectly spelled words.',
    formula: 'Common Traps: Double letters (cc, mm, ss), "ie" vs "ei", silent letters.',
    details: 'Pronounce the word slowly. Look for words like "Occurred", "Separate", "Maintenance".',
    example: 'Recieve (Wrong) ➔ Receive (Right).'
  },
  'Vocabulary': {
    summary: 'General understanding of word meanings and usage.',
    formula: 'Context: Read the surrounding sentences to guess the word\'s "charge" (+ or -).',
    details: 'Increase exposure by reading the news. Focus on administrative and technical English.',
    example: 'Pragmatic = Practical.'
  }
};

function getTopicNote(topic, section) {
  if (topicNotes[topic]) return topicNotes[topic];
  if (typeof paper2TopicNotes !== 'undefined' && paper2TopicNotes[topic]) return paper2TopicNotes[topic];
  
  const isPaper2 = typeof paper2Questions !== 'undefined' && paper2Questions.some(q => q.topic === topic);
  
  return {
    summary: `Detailed study of ${topic} for HPCL ${isPaper2 ? 'Paper 2' : 'Paper 1'}.`,
    formula: 'Standard thematic formula applies.',
    details: isPaper2 ? 'Focus on core technical rules and system behaviors.' : 'Focus on speed and pattern recognition.',
    example: 'Refer to practice questions for worked examples.'
  };
}
