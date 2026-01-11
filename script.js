console.log("JS CONNECTED");

/* ========== PLAYER LOGIN DATA ========== */
let player = {
  name: "",
  age: "",
  role: ""
};

function startGame() {
  const name = document.getElementById("playerName").value;
  const age = document.getElementById("playerAge").value;
  const role = document.getElementById("playerRole").value;

  if (!name || !age || !role) {
    alert("Please fill all details!");
    return;
  }

  player.name = name;
  player.age = age;
  player.role = role;

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("gamePage").style.display = "block";

  document.getElementById("welcomeText").innerText = `Welcome ${player.name} (${player.role})`;

  createCoinsDisplay();

  // ✅ Reset coins at the start of every new game
  coins = 0;
  updateScore();
}

/* ========== SESSION ANALYTICS ========== */
let analytics = {
  sessionId: Date.now(),
  startTime: null,
  endTime: null,
  safeClicks: 0,
  riskyClicks: 0,
  totalClicks: 0,
  maxScore: 0
};

/* ========== SOUNDS ========== */
const clickSound = new Audio("sounds/click.mp3");
const rewardSound = new Audio("sounds/reward.mp3");
clickSound.preload = "auto";
rewardSound.preload = "auto";

/* ========== GAME STATE ========== */
let timeLeft = 60;
let score = 0;
let timerStarted = false;
let combo = 0;
let difficulty = 1;
let gameOver = false;
let timerRef = null;

/* 🔒 SAFE BALANCE STATE */
let lastSafeTime = 0;
const SAFE_COOLDOWN = 800;

/* ========== VIRTUAL ECONOMY ========== */
let coins = 0;

const shopItems = {
  safeBoost: { name: "Safe Boost (+50%)", cost: 120, active: false },
  shield: { name: "Loss Shield (1x)", cost: 180, active: false },
  comboSaver: { name: "Combo Saver", cost: 150, active: false }
};

/* ========== ELEMENTS ========== */
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const boardEl = document.getElementById("board");
const comboEl = document.getElementById("combo");
const difficultyEl = document.getElementById("difficulty");
const eventMsgEl = document.getElementById("eventMsg");

let coinsDisplay; // top-right coins div

function createCoinsDisplay() {
  coinsDisplay = document.createElement("div");
  coinsDisplay.id = "coinsDisplay";
  coinsDisplay.style.position = "fixed";
  coinsDisplay.style.top = "10px";
  coinsDisplay.style.right = "15px";
  coinsDisplay.style.fontSize = "22px";
  coinsDisplay.style.color = "gold";
  coinsDisplay.style.backgroundColor = "rgba(0,0,0,0.4)";
  coinsDisplay.style.padding = "8px 12px";
  coinsDisplay.style.borderRadius = "12px";
  coinsDisplay.style.zIndex = "999";
  coinsDisplay.innerText = `💰 ${coins}`;
  document.body.appendChild(coinsDisplay);
}

/* ========== TIMER ========== */
function startTimer() {
  if (timerStarted) return;
  timerStarted = true;
  analytics.startTime = new Date();

  if (timerRef) clearInterval(timerRef); // remove old interval

  timerRef = setInterval(() => {
    timeLeft--;

    if (timeEl) {
      timeEl.innerText = timeLeft + "s";

      // ✅ Color: gold normal, red last 10s
      if (timeLeft <= 10) {
        timeEl.style.color = "red";
        timeEl.style.fontWeight = "bold";
      } else {
        timeEl.style.color = "gold";
        timeEl.style.fontWeight = "normal";
      }
    }

    if (timeLeft % 15 === 0 && timeLeft !== 0) {
      difficulty++;
      difficultyEl.innerText = difficulty;
    }

    if (timeLeft <= 0) {
      clearInterval(timerRef);
      endGame();
    }
  }, 1000);
}

/* ========== MARKET EVENT ========== */
function marketEvent() {
  const events = [
    { msg: "📈 Market Boom! +10", value: 10 },
    { msg: "📉 Market Crash! -8", value: -8 },
    { msg: "💎 Insider Tip! +15", value: 15 },
    { msg: "⚠️ Scam Alert! -12", value: -12 }
  ];

  const event = events[Math.floor(Math.random() * events.length)];
  score += event.value;
  score = Math.max(0, score);

  eventMsgEl.innerText = event.msg;
  setTimeout(() => (eventMsgEl.innerText = ""), 2000);

  updateScore();
}

/* ========== SAFE INVEST ========== */
function investSafe() {
  if (gameOver) return;

  const now = Date.now();
  if (now - lastSafeTime < SAFE_COOLDOWN) return;
  lastSafeTime = now;

  startTimer();

  analytics.safeClicks++;
  analytics.totalClicks++;

  clickSound.currentTime = 0;
  clickSound.play();

  const baseGain = 3;
  const diminishing = Math.max(1, 6 - combo);
  let gain = Math.floor((baseGain * diminishing) / difficulty);
  if (shopItems.safeBoost.active) gain = Math.floor(gain * 1.5);

  score += gain;
  score = Math.max(0, score);

  combo = Math.min(combo + 1, 2);
  comboEl.innerText = combo;

  if (Math.random() < 0.15) marketEvent();

  earnCoins(gain);
  analytics.maxScore = Math.max(analytics.maxScore, score);
  updateScore();
}

/* ========== RISK INVEST ========== */
function investRisk() {
  if (gameOver) return;

  startTimer();

  analytics.riskyClicks++;
  analytics.totalClicks++;

  clickSound.currentTime = 0;
  clickSound.play();

  if (Math.random() > 0.5) {
    combo++;
    comboEl.innerText = combo;

    const gain = Math.floor((15 + combo * 2) / difficulty);
    score += gain;

    rewardSound.currentTime = 0;
    rewardSound.play();

    earnCoins(gain);
  } else {
    if (shopItems.shield.active) shopItems.shield.active = false;
    else if (shopItems.comboSaver.active) {
      combo = Math.max(combo - 1, 0);
      shopItems.comboSaver.active = false;
    } else {
      combo = 0;
      score -= Math.floor(10 * difficulty);
    }
    comboEl.innerText = combo;
    score = Math.max(0, score);
  }

  if (Math.random() < 0.4) marketEvent();

  analytics.maxScore = Math.max(analytics.maxScore, score);
  updateScore();
}

/* ========== SCORE + COINS ========== */
function earnCoins(amount) {
  coins += Math.max(1, Math.floor(amount / 5));
}

function updateScore() {
  scoreEl.innerText = score;
  if (coinsDisplay) coinsDisplay.innerText = `💰 ${coins}`;
}

/* ========== SHOP + MYSTERY CRATE ========== */
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "s" && !gameOver) openShop();
});

function openShop() {
  let msg = "🛍️ MARKET SHOP\n\n";
  let i = 1;
  for (let key in shopItems) {
    const item = shopItems[key];
    msg += `${i}. ${shopItems[key].name} (${shopItems[key].cost}💰)\n`;
    i++;
  }
  msg += `${i}. Mystery Crate (50💰)\n`;
  msg += `\nCoins: ${coins}\nEnter item number:`;
  const choice = prompt(msg);

  if (choice == i) openMysteryCrate();
  else buyItem(Object.keys(shopItems)[choice - 1]);
}

function buyItem(key) {
  const item = shopItems[key];
  if (!item) return;

  if (coins < item.cost) {
    alert("❌ Not enough coins");
    return;
  }

  coins -= item.cost;
  item.active = true;
  updateScore();
  alert(`✅ ${item.name} activated`);
}

function openMysteryCrate() {
  const CRATE_COST = 50;
  if (coins < CRATE_COST) {
    alert("❌ Not enough coins to open crate!");
    return;
  }

  coins -= CRATE_COST;
  updateScore();

  const rewards = [
    { type: "coins", amount: 20, msg: "🎉 You got 20 coins!" },
    { type: "safeBoost", msg: "💎 Safe Boost activated!" },
    { type: "shield", msg: "🛡️ Shield activated!" },
    { type: "score", amount: 50, msg: "🔥 +50 Score!" }
  ];

  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  switch(reward.type) {
    case "coins": coins += reward.amount; break;
    case "safeBoost": shopItems.safeBoost.active = true; break;
    case "shield": shopItems.shield.active = true; break;
    case "score": score += reward.amount; analytics.maxScore = Math.max(analytics.maxScore, score); break;
  }

  eventMsgEl.innerText = reward.msg;
  setTimeout(() => eventMsgEl.innerText = "", 2500);

  updateScore();
}

/* ========== END GAME ========== */
function endGame() {
  gameOver = true;
  analytics.endTime = new Date();

  let result;
  if (score >= 300) result = "🏆 Market Legend!";
  else if (score >= 150) result = "🔥 Pro Trader!";
  else if (score >= 50) result = "🙂 Beginner Trader";
  else result = "💀 Bankrupt";

  const li = document.createElement("li");
  li.innerText = `${player.name} | ${result} | Score: ${score}`;
  boardEl.appendChild(li);

  setTimeout(() => {
    const restart = confirm(`⏱️ Time Over!\n\nPlayer: ${player.name}\nScore: ${score}\nCoins: ${coins}\nRank: ${result}\n\nRestart Game?`);
    if (restart) restartGame();
  }, 200);
}

/* ========== RESTART GAME ========== */
function restartGame() {
  clearInterval(timerRef);

  timeLeft = 60;
  score = 0;
  combo = 0;
  difficulty = 1;
  timerStarted = false;
  gameOver = false;
  lastSafeTime = 0;

  // ✅ Reset coins on restart
  coins = 0;

  timeEl.innerText = "60s";
  timeEl.style.color = "gold";
  timeEl.style.fontWeight = "normal";

  comboEl.innerText = "0";
  difficultyEl.innerText = "1";
  eventMsgEl.innerText = "";

  updateScore();

  analytics = {
    sessionId: Date.now(),
    startTime: null,
    endTime: null,
    safeClicks: 0,
    riskyClicks: 0,
    totalClicks: 0,
    maxScore: 0
  };
}









