const ageButtons = document.querySelectorAll("#ageGrid button");
const registerButton = document.getElementById("registerButton");
const questionText = document.getElementById("questionText");
const questionAge = document.getElementById("questionAge");
const optionsContainer = document.getElementById("optionsContainer");
const inputContainer = document.getElementById("inputContainer");
const submitButton = document.getElementById("submitAnswer");
const nextButton = document.getElementById("nextQuestion");
const feedbackEl = document.getElementById("questionFeedback");
const scoreCount = document.getElementById("scoreCount");
const comboText = document.getElementById("comboText");
const levelRing = document.getElementById("levelRing");
const levelNumber = document.getElementById("levelNumber");
const xpFill = document.getElementById("xpFill");
const xpText = document.getElementById("xpText");
const questionCard = document.getElementById("questionCard");
const dailyBoard = document.getElementById("dailyBoard");
const weeklyBoard = document.getElementById("weeklyBoard");

let currentAge = null;
let currentQuestion = null;
let selectedOption = null;
let awaitingAnswer = false;
let totalScore = parseInt(localStorage.getItem("yb_score") ?? "0", 10);
let level = parseInt(localStorage.getItem("yb_level") ?? "1", 10);
let levelXp = parseInt(localStorage.getItem("yb_levelXp") ?? "0", 10);
let playerName = localStorage.getItem("yb_player") || null;
let askedIndex = {
  "3-5": 0,
  "6-8": 0,
  "9-12": 0,
  "12+": 0,
};

const baseDailyLeaders = [
  { name: "Անի", score: 260 },
  { name: "Մարկ", score: 220 },
  { name: "Էվա", score: 210 },
  { name: "Սիմոն", score: 180 },
  { name: "Նարե", score: 160 },
];

const baseWeeklyLeaders = [
  { name: "Լիլիթ", score: 1200 },
  { name: "Հենրիկ", score: 980 },
  { name: "Արամ", score: 950 },
  { name: "Մարի", score: 900 },
  { name: "Գայանե", score: 880 },
];

const questionSets = {
  "3-5": [
    {
      type: "visual",
      question: "Ո՞ր խնձորն է կարմիր",
      visualType: "apples",
      options: [
        { label: "🍎", color: "#ff4444", emoji: "🍎" },
        { label: "🍏", color: "#44ff44", emoji: "🍏" },
        { label: "🍋", color: "#ffff44", emoji: "🍋" },
      ],
      answer: "🍎",
    },
    {
      type: "visual",
      question: "Ո՞ր պատկերն է շրջան",
      visualType: "shapes",
      options: [
        { label: "⭕", shape: "circle", emoji: "⭕" },
        { label: "⬜", shape: "square", emoji: "⬜" },
        { label: "🔺", shape: "triangle", emoji: "🔺" },
      ],
      answer: "⭕",
    },
    {
      type: "visual",
      question: "Ո՞ր կենդանին է ասում «miaw»",
      visualType: "animals",
      options: [
        { label: "🐱", emoji: "🐱" },
        { label: "🐶", emoji: "🐶" },
        { label: "🐴", emoji: "🐴" },
      ],
      answer: "🐱",
    },
    {
      type: "visual",
      question: "Ո՞ր գույնն է կապույտ",
      visualType: "colors",
      options: [
        { label: "🔵", color: "#4488ff", emoji: "🔵" },
        { label: "🔴", color: "#ff4444", emoji: "🔴" },
        { label: "🟡", color: "#ffff44", emoji: "🟡" },
      ],
      answer: "🔵",
    },
    {
      type: "visual",
      question: "Ո՞րն է արևը",
      visualType: "nature",
      options: [
        { label: "☀️", emoji: "☀️" },
        { label: "🌙", emoji: "🌙" },
        { label: "⭐", emoji: "⭐" },
      ],
      answer: "☀️",
    },
    {
      type: "visual",
      question: "Քանի՞ խնձոր կա?",
      visualType: "counting",
      options: [
        { label: "3", emoji: "🍎🍎🍎", count: 3 },
        { label: "4", emoji: "🍎🍎🍎🍎", count: 4 },
        { label: "5", emoji: "🍎🍎🍎🍎🍎", count: 5 },
      ],
      answer: "3",
    },
    {
      type: "visual",
      question: "Ո՞ր տառով է սկսվում «բալիկ» բառը",
      visualType: "letters",
      options: [
        { label: "Բ", emoji: "🔤", letter: "Բ" },
        { label: "Մ", emoji: "🔤", letter: "Մ" },
        { label: "Ք", emoji: "🔤", letter: "Ք" },
      ],
      answer: "Բ",
    },
    {
      type: "visual",
      question: "Ո՞ր խնձորը ավելի մեծ է",
      visualType: "size",
      options: [
        { label: "🍎🍎🍎", emoji: "🍎🍎🍎", size: "big" },
        { label: "🍎🍎", emoji: "🍎🍎", size: "medium" },
        { label: "🍎", emoji: "🍎", size: "small" },
      ],
      answer: "🍎🍎🍎",
    },
    {
      type: "visual",
      question: "Ո՞ր կենդանին է թռչում",
      visualType: "animals",
      options: [
        { label: "🐦", emoji: "🐦" },
        { label: "🐟", emoji: "🐟" },
        { label: "🐢", emoji: "🐢" },
      ],
      answer: "🐦",
    },
  ],
  "6-8": [
    {
      type: "visual",
      question: "Ընտրիր ճիշտ երկրաչափական պատկերը",
      visualType: "shapes",
      options: [
        { label: "Շրջան", shape: "circle", emoji: "⭕" },
        { label: "Ուղղանկյուն", shape: "rectangle", emoji: "▭" },
        { label: "Աստղ", shape: "star", emoji: "⭐" },
      ],
      answer: "Շրջան",
    },
    {
      type: "visual",
      question: "Ո՞ր մրգն է դեղին",
      visualType: "fruits",
      options: [
        { label: "Բանան", emoji: "🍌" },
        { label: "Խնձոր", emoji: "🍎" },
        { label: "Նարինջ", emoji: "🍊" },
      ],
      answer: "Բանան",
    },
    {
      type: "input",
      question: "Գրի՛ր հայերենով «book» բառի թարգմանությունը.",
      answer: "գիրք",
    },
    {
      type: "options",
      question: "Ընտրիր նախադասությունը առանց սխալի.",
      options: [
        "Ես սիրում եմ խաղալ",
        "Ես սիրում եմ խաղամ",
        "Ես սիրեմ խաղալ",
      ],
      answer: "Ես սիրում եմ խաղալ",
    },
    {
      type: "input",
      question: "Լուծիր. 15 - 6 = ?",
      answer: "9",
    },
    {
      type: "visual",
      question: "Ո՞րն է ծաղիկը",
      visualType: "nature",
      options: [
        { label: "Ծաղիկ", emoji: "🌸" },
        { label: "Ծառ", emoji: "🌳" },
        { label: "Խոտ", emoji: "🌱" },
      ],
      answer: "Ծաղիկ",
    },
    {
      type: "options",
      question: "«Ծաղիկ» բառի ռուսերենը…",
      options: ["цветок", "река", "окно"],
      answer: "цветок",
    },
    {
      type: "options",
      question: "Ո՞ր քաղաքն է Հայաստանի մայրաքաղաքը։",
      options: ["Գյումրի", "Երևան", "Վանաձոր"],
      answer: "Երևան",
    },
  ],
  "9-12": [
    {
      type: "options",
      question: "Ընտրիր «արագ» բառի հականիշը.",
      options: ["դանդաղ", "հրաշալի", "վճռական"],
      answer: "դանդաղ",
    },
    {
      type: "input",
      question: "Գրի՛ր «հերոս» բառի ռուսերեն թարգմանությունը.",
      answer: "герой",
    },
    {
      type: "options",
      question: "Արարատ լեռը գտնվում է …",
      options: ["Տավուշում", "Արարատյան դաշտում", "Սյունիքում"],
      answer: "Արարատյան դաշտում",
    },
    {
      type: "input",
      question: "Լուծիր. 48 ÷ 6 = ?",
      answer: "8",
    },
    {
      type: "options",
      question: "Ինչպե՞ս է ասում «hello»-ն ռուսերեն.",
      options: ["привет", "спасибо", "пока"],
      answer: "привет",
    },
  ],
  "12+": [
    {
      type: "input",
      question: "Գրի՛ր «մշակույթ» բառի անգլերեն թարգմանությունը.",
      answer: "culture",
    },
    {
      type: "options",
      question: "Ընտրիր ճիշտ շարադրանքն ունեցող նախադասությունը.",
      options: [
        "Մենք կարդում ենք բոլորով",
        "Մենք կարդում ենք բոլորս",
        "Մենք կարդում ենք բոլորս միասին",
      ],
      answer: "Մենք կարդում ենք բոլորս միասին",
    },
    {
      type: "input",
      question: "Լուծիր. 96 ÷ 8 = ?",
      answer: "12",
    },
    {
      type: "options",
      question: "Which word matches «հպարտ»?",
      options: ["proud", "silent", "gentle"],
      answer: "proud",
    },
    {
      type: "options",
      question: "«Memory» բառի հայերենը…",
      options: ["Հիշողություն", "Մտածողություն", "Կյանք"],
      answer: "Հիշողություն",
    },
  ],
};

function levelThreshold(lvl) {
  return 150 + (lvl - 1) * 60;
}

function updateLevelUI() {
  const threshold = levelThreshold(level);
  const percent = Math.min(levelXp / threshold, 1);
  
  // Анимация при изменении уровня
  const oldLevel = parseInt(levelNumber.textContent) || 1;
  if (level > oldLevel) {
    levelNumber.style.animation = "none";
    setTimeout(() => {
      levelNumber.style.animation = "numberBounce 0.6s ease";
    }, 10);
  }
  
  levelNumber.textContent = level;
  xpFill.style.width = `${percent * 100}%`;
  xpText.textContent = `${levelXp} / ${threshold} XP`;
  levelRing.style.setProperty("--progress", `${percent * 360}deg`);
  
  // Анимация заполнения XP
  xpFill.style.transition = "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
}

function persistState() {
  localStorage.setItem("yb_score", totalScore);
  localStorage.setItem("yb_level", level);
  localStorage.setItem("yb_levelXp", levelXp);
  if (playerName) {
    localStorage.setItem("yb_player", playerName);
  }
}

function addExperience(amount) {
  levelXp += amount;
  let threshold = levelThreshold(level);
  while (levelXp >= threshold) {
    levelXp -= threshold;
    level += 1;
    threshold = levelThreshold(level);
  }
  updateLevelUI();
  persistState();
}

function updateScore(points) {
  totalScore += points;
  scoreCount.textContent = totalScore;
  persistState();
  refreshLeaderboards();
}

function refreshLeaderboards() {
  const dayData = [...baseDailyLeaders];
  const weekData = [...baseWeeklyLeaders];

  if (playerName) {
    dayData.push({ name: playerName, score: totalScore });
    weekData.push({ name: playerName, score: totalScore * 4 });
  }

  dayData.sort((a, b) => b.score - a.score);
  weekData.sort((a, b) => b.score - a.score);

  renderBoard(dailyBoard, dayData.slice(0, 5));
  renderBoard(weeklyBoard, weekData.slice(0, 5));
}

function renderBoard(target, data) {
  target.innerHTML = "";
  data.forEach((row) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = row.name;
    const score = document.createElement("strong");
    score.textContent = row.score;
    li.append(name, score);
    target.appendChild(li);
  });
}

function shuffle(array) {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function nextStaticQuestion(age) {
  const set = questionSets[age];
  if (!set?.length) return null;
  const index = askedIndex[age] % set.length;
  askedIndex[age] += 1;
  return set[index];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMathQuestion(age) {
  let a;
  let b;
  let operation;
  switch (age) {
    case "3-5":
      a = randomInt(1, 5);
      b = randomInt(1, 4);
      operation = "+";
      break;
    case "6-8":
      a = randomInt(5, 15);
      b = randomInt(1, 10);
      operation = Math.random() > 0.4 ? "+" : "-";
      break;
    case "9-12":
      if (Math.random() > 0.5) {
        a = randomInt(3, 12);
        b = randomInt(3, 12);
        operation = "×";
      } else {
        a = randomInt(20, 60);
        b = randomInt(2, 10);
        operation = "-";
      }
      break;
    default:
      if (Math.random() > 0.5) {
        a = randomInt(12, 30);
        b = randomInt(3, 12);
        operation = "×";
      } else {
        b = randomInt(2, 12);
        const result = randomInt(2, 12);
        a = b * result;
        operation = "÷";
      }
      break;
  }

  let answer;
  switch (operation) {
    case "+":
      answer = a + b;
      break;
    case "-":
      answer = a - b;
      break;
    case "×":
      answer = a * b;
      break;
    case "÷":
      answer = a / b;
      break;
  }

  return {
    type: "math",
    question: `Լուծիր՝ ${a} ${operation} ${b} = ?`,
    answer: answer.toString(),
  };
}

function pickQuestion(age) {
  if (!age) return null;
  // Для группы 3-5 не используем математические вопросы с текстовым вводом
  if (age === "3-5") {
    return nextStaticQuestion(age);
  }
  const useMath = Math.random() < 0.5;
  return useMath ? generateMathQuestion(age) : nextStaticQuestion(age);
}

function setActiveAgeButton(age) {
  ageButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.age === age);
  });
}

function renderQuestion(question) {
  optionsContainer.innerHTML = "";
  inputContainer.innerHTML = "";
  feedbackEl.textContent = "";
  questionCard.classList.remove("correct", "wrong");
  selectedOption = null;
  nextButton.classList.remove("next-ready");

  if (!question) {
    questionText.textContent = "Սկսելու համար ընտրեք տարիքային խումբը";
    questionAge.textContent = "-";
    submitButton.disabled = true;
    nextButton.disabled = true;
    return;
  }

  questionText.textContent = question.question;
  questionAge.textContent = `${currentAge} տարեկանների հարց`;

  if (question.type === "visual" && question.options) {
    optionsContainer.classList.add("visual-options");
    const shuffled = shuffle(question.options);
    shuffled.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "visual-option";
      
      // Create visual content
      const visualContent = document.createElement("div");
      visualContent.className = "visual-content";
      
      if (option.emoji) {
        const emoji = document.createElement("span");
        emoji.className = "visual-emoji";
        emoji.textContent = option.emoji;
        emoji.style.fontSize = "3rem";
        visualContent.appendChild(emoji);
      }
      
      if (option.color) {
        const colorBox = document.createElement("div");
        colorBox.className = "visual-color";
        colorBox.style.backgroundColor = option.color;
        colorBox.style.width = "60px";
        colorBox.style.height = "60px";
        colorBox.style.borderRadius = "50%";
        colorBox.style.margin = "0 auto 0.5rem";
        visualContent.insertBefore(colorBox, visualContent.firstChild);
      }
      
      if (option.shape) {
        const shapeBox = document.createElement("div");
        shapeBox.className = "visual-shape";
        shapeBox.style.width = "60px";
        shapeBox.style.height = "60px";
        shapeBox.style.margin = "0 auto 0.5rem";
        shapeBox.style.backgroundColor = "var(--accent-soft)";
        
        if (option.shape === "circle") {
          shapeBox.style.borderRadius = "50%";
        } else if (option.shape === "square") {
          shapeBox.style.borderRadius = "8px";
        } else if (option.shape === "triangle") {
          shapeBox.style.width = "0";
          shapeBox.style.height = "0";
          shapeBox.style.borderLeft = "30px solid transparent";
          shapeBox.style.borderRight = "30px solid transparent";
          shapeBox.style.borderBottom = "52px solid var(--accent-soft)";
          shapeBox.style.backgroundColor = "transparent";
        } else if (option.shape === "rectangle") {
          shapeBox.style.width = "80px";
          shapeBox.style.height = "50px";
          shapeBox.style.borderRadius = "8px";
        } else if (option.shape === "star") {
          shapeBox.style.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
        }
        
        visualContent.insertBefore(shapeBox, visualContent.firstChild);
      }
      
      const label = document.createElement("span");
      label.className = "visual-label";
      label.textContent = option.label;
      visualContent.appendChild(label);
      
      btn.appendChild(visualContent);
      
      btn.addEventListener("click", () => {
        selectedOption = option.label;
        optionsContainer
          .querySelectorAll("button")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        submitButton.disabled = false;
      });
      
      optionsContainer.appendChild(btn);
    });
    inputContainer.innerHTML = "";
    submitButton.disabled = true;
  } else if (question.options) {
    optionsContainer.classList.remove("visual-options");
    const shuffled = shuffle(question.options);
    shuffled.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = option;
      btn.addEventListener("click", () => {
        selectedOption = option;
        optionsContainer
          .querySelectorAll("button")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        submitButton.disabled = false;
      });
      optionsContainer.appendChild(btn);
    });
    inputContainer.innerHTML = "";
  } else {
    optionsContainer.classList.remove("visual-options");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Գրիր պատասխանը այստեղ";
    input.addEventListener("input", () => {
      submitButton.disabled = input.value.trim().length === 0;
    });
    inputContainer.appendChild(input);
    submitButton.disabled = true;
  }

  nextButton.disabled = true;
  awaitingAnswer = true;
}

function evaluateAnswer() {
  if (!currentQuestion || !awaitingAnswer) return;

  let userAnswer;
  if (currentQuestion.options || currentQuestion.type === "visual") {
    userAnswer = selectedOption;
  } else {
    const input = inputContainer.querySelector("input");
    userAnswer = input?.value.trim();
  }

  if (!userAnswer) {
    feedbackEl.textContent = "Գրեք կամ ընտրեք պատասխան, հետո սեղմեք ստուգել։";
    return;
  }

  // Для визуальных вопросов сравниваем по emoji или label
  let correct = false;
  if (currentQuestion.type === "visual" && currentQuestion.options) {
    // Для визуальных вопросов ответ - это индекс или emoji
    if (typeof currentQuestion.answer === "number") {
      const correctOption = currentQuestion.options[currentQuestion.answer];
      correct = selectedOption === correctOption.label || selectedOption === correctOption.emoji;
    } else {
      correct = userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase();
    }
  } else {
    correct = userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase();
  }

  if (correct) {
    feedbackEl.textContent = "Ճիշտ պատասխան👏";
    questionCard.classList.add("correct");
    const points = currentQuestion.type === "math" ? 25 : currentQuestion.type === "visual" ? 20 : 15;
    const xp = currentQuestion.type === "math" ? 30 : currentQuestion.type === "visual" ? 25 : 20;
    updateScore(points);
    addExperience(xp);
  } else {
    feedbackEl.textContent = `Սխալ է 😔։ Ճիշտ պատասխանը՝ ${correctAnswerText}`;
    questionCard.classList.add("wrong");
  }

  awaitingAnswer = false;
  submitButton.disabled = true;
  nextButton.disabled = false;
  nextButton.classList.add("next-ready");
}

function loadNextQuestion() {
  questionCard.classList.remove("correct", "wrong");
  nextButton.classList.remove("next-ready");
  if (!currentAge) {
    renderQuestion(null);
    return;
  }
  currentQuestion = pickQuestion(currentAge);
  renderQuestion(currentQuestion);
  comboText.textContent = "Լուծիր հարցը և ստացիր միավորներ";
}

ageButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentAge = btn.dataset.age;
    setActiveAgeButton(currentAge);
    loadNextQuestion();
    // Убрано автоматическое прокручивание
  });
});

submitButton.addEventListener("click", evaluateAnswer);
nextButton.addEventListener("click", loadNextQuestion);

registerButton.addEventListener("click", () => {
  const name = prompt("Մուտքագրեք ձեր անունը՝ լիդերբորդում հայտնվելու համար:");
  if (name && name.trim().length > 1) {
    playerName = name.trim();
    persistState();
    refreshLeaderboards();
    alert(
      `${playerName}, ձեր առաջընթացը կպահպանվի այս սարքում և դուք կտեսնեք ձեզ լիդերբորդում։`
    );
  }
});

// Убрано автоматическое прокручивание при загрузке
// Initial render
scoreCount.textContent = totalScore;
updateLevelUI();
refreshLeaderboards();
renderQuestion(null);

// Mini Games
const miniGameModal = document.getElementById("miniGameModal");
const miniGameContainer = document.getElementById("miniGameContainer");
const closeModal = document.getElementById("closeModal");
const miniGameCards = document.querySelectorAll(".mini-game-card");

let currentMiniGame = null;
let miniGameScore = 0;
let miniGameRound = 0;
let memorySequenceShown = false; // Для отслеживания показа последовательности в игре памяти
let memorySelectedOrder = []; // Для хранения выбранного порядка в игре памяти

// Генераторы вопросов для мини-игр
function generateColorQuestion() {
  const colors = [
    { name: "կարմիր", emoji: "🔴", armenian: "Կարմիր" },
    { name: "կապույտ", emoji: "🔵", armenian: "Կապույտ" },
    { name: "կանաչ", emoji: "🟢", armenian: "Կանաչ" },
    { name: "դեղին", emoji: "🟡", armenian: "Դեղին" },
    { name: "նարնջագույն", emoji: "🟠", armenian: "Նարնջագույն" },
    { name: "մանուշակագույն", emoji: "🟣", armenian: "Մանուշակագույն" },
    { name: "վարդագույն", emoji: "🌸", armenian: "Վարդագույն" },
  ];
  const correct = colors[Math.floor(Math.random() * colors.length)];
  const wrong = colors.filter(c => c.name !== correct.name);
  const shuffled = shuffle([correct, ...wrong.slice(0, 2)]);
  const answerIdx = shuffled.findIndex(c => c.name === correct.name);
  
  // Вопросы без упоминания цвета в тексте
  const questionTexts = [
    "Ո՞ր գույնն է այս",
    "Ընտրիր այս գույնը",
    "Ո՞րն է այս գույնը",
  ];
  
  return {
    question: questionTexts[Math.floor(Math.random() * questionTexts.length)],
    options: shuffled.map(c => c.emoji),
    answer: answerIdx,
    correctColor: correct.emoji, // Для отображения правильного ответа
  };
}

function generateShapeQuestion() {
  const shapes = [
    { name: "շրջան", emoji: "⭕", armenian: "շրջան" },
    { name: "քառակուսի", emoji: "⬜", armenian: "քառակուսի" },
    { name: "եռանկյուն", emoji: "🔺", armenian: "եռանկյուն" },
    { name: "աստղ", emoji: "⭐", armenian: "աստղ" },
    { name: "սիրտ", emoji: "❤️", armenian: "սիրտ" },
    { name: "դիամանտ", emoji: "💎", armenian: "ալմաստ" },
  ];
  const correct = shapes[Math.floor(Math.random() * shapes.length)];
  const wrong = shapes.filter(s => s.name !== correct.name);
  const shuffled = shuffle([correct, ...wrong.slice(0, 2)]);
  const answerIdx = shuffled.findIndex(s => s.name === correct.name);
  
  // Вопросы без упоминания формы
  const questionTexts = [
    "Ո՞ր պատկերն է կլոր",
    "Ընտրիր կլոր պատկերը",
    "Ո՞րն է կլոր ձևը",
  ];
  
  // Для разных форм разные вопросы
  let question;
  if (correct.name === "շրջան") {
    question = questionTexts[Math.floor(Math.random() * questionTexts.length)];
  } else if (correct.name === "քառակուսի") {
    question = "Ո՞ր պատկերն է քառակուսի";
  } else if (correct.name === "եռանկյուն") {
    question = "Ո՞ր պատկերն է եռանկյուն";
  } else {
    question = "Ո՞ր պատկերն է " + correct.armenian;
  }
  
  return {
    question: question,
    options: shuffled.map(s => s.emoji),
    answer: answerIdx,
  };
}

function generateCountingQuestion() {
  const items = ["🍎", "⭐", "🌸", "🐱", "🎈", "🍊", "🐶", "🌙", "🎁", "🚗"];
  const item = items[Math.floor(Math.random() * items.length)];
  const correctCount = Math.floor(Math.random() * 3) + 2; // 2-4
  
  // Создаем варианты с разным количеством
  const allCounts = [1, 2, 3, 4, 5];
  const wrongCounts = allCounts.filter(c => c !== correctCount);
  const selectedWrong = shuffle(wrongCounts).slice(0, 2);
  
  const correctOption = item.repeat(correctCount);
  const wrongOptions = selectedWrong.map(count => item.repeat(count));
  const allOptions = [correctOption, ...wrongOptions];
  const shuffled = shuffle(allOptions);
  const answerIdx = shuffled.findIndex(opt => opt === correctOption);
  
  // Получаем армянские названия чисел
  const numberNames = {
    1: "մեկ",
    2: "երկու", 
    3: "երեք",
    4: "չորս",
    5: "հինգ"
  };
  
  return {
    question: `Որտե՞ղ է ${numberNames[correctCount]} ${item}`,
    options: shuffled,
    answer: answerIdx,
    count: correctCount,
  };
}

function generateAnimalQuestion() {
  const animals = [
    { name: "կատու", emoji: "🐱", sound: "miaw", action: null, size: null, description: "փոքրիկ և փափուկ" },
    { name: "շուն", emoji: "🐶", sound: "gav", action: null, size: null, description: "հավատարիմ ընկեր" },
    { name: "թռչուն", emoji: "🐦", sound: null, action: "թռչում", size: null, description: "թևեր ունի" },
    { name: "ձուկ", emoji: "🐟", sound: null, action: "լողում", size: null, description: "ջրում ապրում" },
    { name: "փիղ", emoji: "🐘", sound: null, action: null, size: "ամենամեծ", description: "շատ մեծ" },
    { name: "ձի", emoji: "🐴", sound: null, action: null, size: null, description: "արագ վազում" },
    { name: "կրիա", emoji: "🐢", sound: null, action: null, size: null, description: "շատ դանդաղ" },
  ];
  
  const withSound = animals.filter(a => a.sound);
  const withAction = animals.filter(a => a.action);
  const withSize = animals.filter(a => a.size);
  const withDescription = animals.filter(a => a.description);
  
  let correct, question;
  const questionType = Math.random();
  
  if (questionType < 0.3 && withSound.length > 0) {
    correct = withSound[Math.floor(Math.random() * withSound.length)];
    question = `Ո՞ր կենդանին է ասում «${correct.sound}»`;
  } else if (questionType < 0.6 && withAction.length > 0) {
    correct = withAction[Math.floor(Math.random() * withAction.length)];
    question = `Ո՞ր կենդանին է ${correct.action}`;
  } else if (questionType < 0.8 && withSize.length > 0) {
    correct = withSize[Math.floor(Math.random() * withSize.length)];
    question = `Ո՞ր կենդանին է ${correct.size}ը`;
  } else if (withDescription.length > 0) {
    correct = withDescription[Math.floor(Math.random() * withDescription.length)];
    question = `Ո՞ր կենդանին է ${correct.description}`;
  } else {
    correct = animals[Math.floor(Math.random() * animals.length)];
    question = `Ո՞ր կենդանին է այս`;
  }
  
  const wrong = animals.filter(a => a.name !== correct.name);
  const shuffled = shuffle([correct, ...wrong.slice(0, 2)]);
  const answerIdx = shuffled.findIndex(a => a.name === correct.name);
  
  return {
    question,
    options: shuffled.map(a => a.emoji),
    answer: answerIdx,
  };
}

function generateMemoryQuestion() {
  // Разные категории предметов для игры на память
  const categories = [
    { name: "կենդանիներ", items: ["🐱", "🐶", "🐰", "🐦", "🐷", "🐴", "🐘", "🐢"] },
    { name: "ձևեր", items: ["⭕", "⬜", "🔺", "⭐", "❤️", "💎", "🔷", "🔶"] },
    { name: "մրգեր", items: ["🍎", "🍊", "🍌", "🍇", "🍓", "🍉", "🥝", "🍑"] },
    { name: "բնություն", items: ["☀️", "🌙", "⭐", "🌸", "🌳", "🌊", "⛅", "🌈"] },
    { name: "խաղալիքներ", items: ["🎈", "🎁", "🎂", "🎮", "🚗", "🚂", "✈️", "🎪"] },
  ];
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  const sequenceLength = Math.floor(Math.random() * 3) + 2; // 2-4 предмета
  
  // Выбираем случайные предметы из категории
  const availableItems = shuffle([...category.items]);
  const sequence = availableItems.slice(0, sequenceLength);
  
  return {
    question: `Հիշիր հերթականությունը և դասավորիր նույն կարգով`,
    sequence: sequence,
    shuffledSequence: shuffle([...sequence]),
    categoryName: category.name,
  };
}

const miniGames = {
  colors: {
    title: "🎨 Գույների խաղ",
    generator: generateColorQuestion,
    questions: [],
  },
  shapes: {
    title: "🔷 Ձևերի խաղ",
    generator: generateShapeQuestion,
    questions: [],
  },
  counting: {
    title: "🔢 Հաշվարկի խաղ",
    generator: generateCountingQuestion,
    questions: [],
  },
  animals: {
    title: "🐾 Կենդանիների խաղ",
    generator: generateAnimalQuestion,
    questions: [],
  },
  memory: {
    title: "🧠 Հիշողության խաղ",
    generator: generateMemoryQuestion,
    questions: [],
  },
};

// Генерируем вопросы при открытии игры
function generateMiniGameQuestions(gameType) {
  const game = miniGames[gameType];
  if (!game) return;
  
  game.questions = [];
  for (let i = 0; i < 8; i++) {
    game.questions.push(game.generator());
  }
}

function openMiniGame(gameType) {
  currentMiniGame = gameType;
  miniGameScore = 0;
  miniGameRound = 0;
  memorySequenceShown = false;
  memorySelectedOrder = [];
  generateMiniGameQuestions(gameType);
  miniGameModal.classList.add("active");
  loadMiniGameQuestion();
}

function loadMiniGameQuestion() {
  const game = miniGames[currentMiniGame];
  if (!game || miniGameRound >= game.questions.length) {
    showMiniGameResult();
    return;
  }

  const question = game.questions[miniGameRound];
  
  // Специальная логика для игры памяти
  if (currentMiniGame === "memory") {
    if (!memorySequenceShown) {
      // Показываем последовательность для запоминания
      miniGameContainer.innerHTML = `
        <h2 class="mini-game-title">${game.title}</h2>
        <div class="mini-game-score">Միավորներ: ${miniGameScore} | Հարց ${miniGameRound + 1}/${game.questions.length}</div>
        <h3 style="text-align: center; margin: 1rem 0; font-size: 1.3rem;">Հիշիր այս հերթականությունը:</h3>
        <div style="display: flex; justify-content: center; gap: 1rem; margin: 1.5rem 0; flex-wrap: wrap;">
          ${question.sequence.map((emoji, idx) => `
            <div style="font-size: 3.5rem; padding: 0.8rem; background: rgba(255, 154, 98, 0.15); border-radius: 1rem; border: 2px solid rgba(255, 154, 98, 0.4); animation: popInSequence 0.5s ease ${idx * 0.15}s backwards; box-shadow: 0 4px 15px rgba(255, 154, 98, 0.2);">
              ${emoji}
            </div>
          `).join("")}
        </div>
        <p style="text-align: center; color: var(--muted); margin: 1.5rem 0; font-size: 0.9rem;">Հիշիր հերթականությունը, հետո սեղմիր "Շարունակել"</p>
        <button class="btn primary" id="continueMemoryBtn" style="display: block; margin: 1rem auto; animation: pulseButton 2s ease-in-out infinite;">Շարունակել</button>
      `;
      
      document.getElementById("continueMemoryBtn").addEventListener("click", () => {
        memorySequenceShown = true;
        memorySelectedOrder = [];
        loadMiniGameQuestion();
      });
      return;
    } else {
      // Показываем перемешанные варианты для выбора
      miniGameContainer.innerHTML = `
        <h2 class="mini-game-title">${game.title}</h2>
        <div class="mini-game-score">Միավորներ: ${miniGameScore} | Հարց ${miniGameRound + 1}/${game.questions.length}</div>
        <h3 style="text-align: center; margin: 1rem 0; font-size: 1.2rem;">${question.question}</h3>
        <p style="text-align: center; color: var(--muted); margin-bottom: 1rem; font-size: 0.9rem;">Դասավորիր նույն հերթականությամբ</p>
        <div class="mini-game-board" style="grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.8rem; margin-bottom: 1.5rem;">
          ${question.shuffledSequence.map((emoji, idx) => `
            <div class="mini-game-item memory-item" data-emoji="${emoji}" data-original-idx="${idx}" style="font-size: 2.5rem; padding: 1.2rem; cursor: pointer; animation-delay: ${idx * 0.1}s;">
              ${emoji}
            </div>
          `).join("")}
        </div>
        <div style="text-align: center; margin: 1.5rem 0;">
          <h4 style="margin-bottom: 0.8rem; color: var(--accent-soft); font-size: 1rem;">Ձեր ընտրությունը:</h4>
          <div id="selectedSequence" style="display: flex; justify-content: center; gap: 0.8rem; flex-wrap: wrap; min-height: 60px; align-items: center;">
            <p style="color: var(--muted); font-size: 0.85rem;">Ընտրիր պատկերները հերթականությամբ</p>
          </div>
        </div>
        <button class="btn primary" id="checkMemoryBtn" disabled style="display: block; margin: 1rem auto;">Ստուգել</button>
      `;
      
      const memoryItems = miniGameContainer.querySelectorAll(".memory-item");
      const selectedSequenceDiv = document.getElementById("selectedSequence");
      const checkBtn = document.getElementById("checkMemoryBtn");
      
      memoryItems.forEach((item) => {
        item.addEventListener("click", () => {
          if (item.style.opacity === "0.5") return; // Уже выбрано
          
          const emoji = item.dataset.emoji;
          memorySelectedOrder.push(emoji);
          
          // Делаем элемент неактивным
          item.style.opacity = "0.5";
          item.style.cursor = "not-allowed";
          
          // Добавляем в выбранную последовательность с анимацией
          selectedSequenceDiv.innerHTML = "";
          memorySelectedOrder.forEach((e, idx) => {
            const el = document.createElement("div");
            el.style.fontSize = "2rem";
            el.style.padding = "0.6rem";
            el.style.background = "rgba(255, 154, 98, 0.15)";
            el.style.borderRadius = "0.8rem";
            el.style.border = "2px solid rgba(255, 154, 98, 0.3)";
            el.style.animation = "popInSequence 0.3s ease backwards";
            el.style.animationDelay = `${idx * 0.1}s`;
            el.textContent = e;
            selectedSequenceDiv.appendChild(el);
          });
          
          // Активируем кнопку проверки когда выбрано достаточно
          if (memorySelectedOrder.length === question.sequence.length) {
            checkBtn.disabled = false;
          }
        });
      });
      
      checkBtn.addEventListener("click", () => {
        const isCorrect = JSON.stringify(memorySelectedOrder) === JSON.stringify(question.sequence);
        
        if (isCorrect) {
          miniGameScore += 10;
          checkBtn.textContent = "Ճիշտ է! 👏";
          checkBtn.style.background = "linear-gradient(135deg, #62ffa8, #3cd671)";
          setTimeout(() => {
            miniGameRound++;
            memorySequenceShown = false;
            memorySelectedOrder = [];
            loadMiniGameQuestion();
          }, 1500);
        } else {
          checkBtn.textContent = "Սխալ է 😔";
          checkBtn.style.background = "linear-gradient(135deg, #ff6767, #ff4444)";
          // Показываем правильную последовательность
          selectedSequenceDiv.innerHTML = "";
          question.sequence.forEach(e => {
            const el = document.createElement("div");
            el.style.fontSize = "2.5rem";
            el.style.padding = "0.5rem";
            el.style.background = "rgba(98, 255, 168, 0.2)";
            el.style.borderRadius = "0.5rem";
            el.textContent = e;
            selectedSequenceDiv.appendChild(el);
          });
          setTimeout(() => {
            miniGameRound++;
            memorySequenceShown = false;
            memorySelectedOrder = [];
            loadMiniGameQuestion();
          }, 2000);
        }
      });
      return;
    }
  }
  
  // Обычная логика для других игр
  miniGameContainer.innerHTML = `
    <h2 class="mini-game-title">${game.title}</h2>
    <div class="mini-game-score">Միավորներ: ${miniGameScore} | Հարց ${miniGameRound + 1}/${game.questions.length}</div>
    <h3 style="text-align: center; margin: 1.5rem 0; font-size: 1.5rem;">${question.question}</h3>
    <div class="mini-game-board" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));">
      ${question.options.map((opt, idx) => `
        <div class="mini-game-item" data-answer="${idx}" style="font-size: 3rem; padding: 2rem;">
          ${opt}
        </div>
      `).join("")}
    </div>
  `;

      const items = miniGameContainer.querySelectorAll(".mini-game-item");
      items.forEach((item, idx) => {
        // Добавляем интерактивность при наведении
        item.addEventListener("mouseenter", () => {
          if (!item.classList.contains("selected") && !item.classList.contains("correct") && !item.classList.contains("wrong")) {
            item.style.transform = "scale(1.1) rotate(5deg)";
            item.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
          }
        });
        
        item.addEventListener("mouseleave", () => {
          if (!item.classList.contains("selected") && !item.classList.contains("correct") && !item.classList.contains("wrong")) {
            item.style.transform = "scale(1) rotate(0deg)";
          }
        });
        
        item.addEventListener("click", () => {
          const selectedIdx = parseInt(item.dataset.answer);
          const isCorrect = selectedIdx === question.answer;
          
          // Анимация клика
          item.style.transform = "scale(0.95)";
          setTimeout(() => {
            item.style.transform = isCorrect ? "scale(1.15)" : "scale(1)";
          }, 100);
          
          items.forEach((i) => i.classList.remove("selected", "correct", "wrong"));
          item.classList.add(isCorrect ? "correct" : "wrong");
          
          if (isCorrect) {
            miniGameScore += 10;
            // Добавляем эффект частиц при правильном ответе
            createParticles(item, true);
            setTimeout(() => {
              miniGameRound++;
              loadMiniGameQuestion();
            }, 1000);
          } else {
            const correctItem = Array.from(items).find((i) => parseInt(i.dataset.answer) === question.answer);
            if (correctItem) {
              correctItem.classList.add("correct");
              createParticles(correctItem, true);
            }
            createParticles(item, false);
            setTimeout(() => {
              miniGameRound++;
              loadMiniGameQuestion();
            }, 1500);
          }
        });
      });
}

function showMiniGameResult() {
  const game = miniGames[currentMiniGame];
  const totalQuestions = game.questions.length;
  const percentage = Math.round((miniGameScore / (totalQuestions * 10)) * 100);
  
  miniGameContainer.innerHTML = `
    <h2 class="mini-game-title">${game.title} - Ավարտված</h2>
    <div style="text-align: center; padding: 2rem;">
      <div style="font-size: 4rem; margin: 1rem 0;">${percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}</div>
      <h3 style="font-size: 2rem; margin: 1rem 0; color: var(--accent-soft);">Ձեր միավորները: ${miniGameScore}/${totalQuestions * 10}</h3>
      <p style="font-size: 1.2rem; color: var(--muted); margin: 1rem 0;">Ճիշտ պատասխաններ: ${Math.round(miniGameScore / 10)}/${totalQuestions}</p>
      <p style="font-size: 1.1rem; color: var(--muted);">Հաջողություն: ${percentage}%</p>
      <button class="btn primary" style="margin-top: 2rem;" onclick="location.reload()">Խաղալ կրկին</button>
    </div>
  `;
}

miniGameCards.forEach((card) => {
  card.addEventListener("click", () => {
    const gameType = card.dataset.game;
    openMiniGame(gameType);
  });
});

closeModal.addEventListener("click", () => {
  miniGameModal.classList.remove("active");
});

miniGameModal.addEventListener("click", (e) => {
  if (e.target === miniGameModal) {
    miniGameModal.classList.remove("active");
  }
});

// Функция создания частиц для интерактивности
function createParticles(element, isCorrect) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const color = isCorrect ? "#62ffa8" : "#ff6767";
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.width = "6px";
    particle.style.height = "6px";
    particle.style.borderRadius = "50%";
    particle.style.background = color;
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "10000";
    particle.style.boxShadow = `0 0 10px ${color}`;
    
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 40;
    const duration = 600;
    
    particle.style.transition = `all ${duration}ms ease-out`;
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      particle.style.opacity = "0";
      particle.style.transform += " scale(0)";
    }, 10);
    
    setTimeout(() => {
      particle.remove();
    }, duration);
  }
}

