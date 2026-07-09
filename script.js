let selectedGame = null;
let score = 0;
let timeLeft = 30;
let timer = null;
let running = false;

const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const titleEl = document.getElementById("gameTitle");
const instructionEl = document.getElementById("instruction");
const messageEl = document.getElementById("message");

const games = {
  balloon: {
    title: "🎈 เกมคลิกลูกโป่ง",
    instruction: "คลิกลูกโป่งให้ทัน ได้คะแนนทุกครั้งที่คลิกถูก",
    good: ["🎈", "🎈", "🎈"],
    bad: []
  },
  star: {
    title: "⭐ เกมจับดาว",
    instruction: "คลิกดาวสีสวยให้เร็วที่สุด",
    good: ["⭐", "🌟", "✨"],
    bad: []
  },
  fish: {
    title: "🐟 เกมจับปลา",
    instruction: "คลิกปลาที่ว่ายมาให้ได้",
    good: ["🐟", "🐠", "🐡"],
    bad: []
  },
  cheese: {
    title: "🧀 เกมเก็บชีสให้หนู",
    instruction: "คลิกชีสเท่านั้น อย่าคลิกแมว",
    good: ["🧀"],
    bad: ["🐱"]
  },
  traffic: {
    title: "🚦 เกมไฟเขียวไฟแดง",
    instruction: "คลิกไฟเขียว ✅ ห้ามคลิกไฟแดง ❌",
    good: ["🟢"],
    bad: ["🔴"]
  }
};

function selectGame(name) {
  selectedGame = name;
  const game = games[name];
  titleEl.textContent = game.title;
  instructionEl.textContent = game.instruction;
  messageEl.textContent = "";
  gameArea.innerHTML = "";
  resetScore();
}

function startGame() {
  if (!selectedGame) {
    messageEl.textContent = "กรุณาเลือกเกมก่อนค่ะ";
    return;
  }

  score = 0;
  timeLeft = 30;
  running = true;
  updateScore();
  updateTime();
  messageEl.textContent = "";
  gameArea.innerHTML = "";

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTime();
    if (timeLeft <= 0) endGame();
  }, 1000);

  spawnTarget();
}

function spawnTarget() {
  if (!running) return;

  gameArea.innerHTML = "";
  const game = games[selectedGame];

  let makeBad = game.bad.length > 0 && Math.random() < 0.35;
  let iconList = makeBad ? game.bad : game.good;
  let icon = iconList[Math.floor(Math.random() * iconList.length)];

  const target = document.createElement("div");
  target.className = "target" + (makeBad ? " bad" : "");
  target.textContent = icon;

  const maxX = Math.max(10, gameArea.clientWidth - 90);
  const maxY = Math.max(10, gameArea.clientHeight - 90);
  target.style.left = Math.random() * maxX + "px";
  target.style.top = Math.random() * maxY + "px";

  target.onclick = function () {
    if (!running) return;

    if (makeBad) {
      score = Math.max(0, score - 1);
      messageEl.textContent = "อุ๊ย! คลิกผิด ลบ 1 คะแนน";
    } else {
      score++;
      messageEl.textContent = "เก่งมาก! +1 คะแนน";
    }

    updateScore();
    spawnTarget();
  };

  gameArea.appendChild(target);
}

function endGame() {
  running = false;
  clearInterval(timer);
  gameArea.innerHTML = "";
  messageEl.textContent = "🎉 หมดเวลา! ได้คะแนนรวม " + score + " คะแนน";
}

function backToMenu() {
  running = false;
  clearInterval(timer);
  selectedGame = null;
  titleEl.textContent = "เลือกเกมเพื่อเริ่มเล่น";
  instructionEl.textContent = "กดเลือกเกมด้านบนก่อนค่ะ";
  gameArea.innerHTML = "";
  messageEl.textContent = "";
  resetScore();
}

function resetScore() {
  score = 0;
  timeLeft = 30;
  updateScore();
  updateTime();
}

function updateScore() {
  scoreEl.textContent = score;
}

function updateTime() {
  timeEl.textContent = timeLeft;
}
