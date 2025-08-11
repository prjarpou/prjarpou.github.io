// ✅ ELEMENTS
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');
const catchSound = document.getElementById('catch-sound');
const crashSound = document.getElementById('crash-sound');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const gameContainer = document.querySelector('.game-container');
const heartImages = document.querySelectorAll('.heart');

const pizzaRewardBox = document.getElementById("dominosReward");
const meeshoRewardBox = document.getElementById("meeshoReward");
const zeptoRewardBox = document.getElementById("zeptoReward");
const jobRewardBox = document.getElementById("jobReward");

const pizzaContinueBtn = document.getElementById("dominosContinueBtn");
const meeshoContinueBtn = document.getElementById("meeshoContinueBtn");
const zeptoContinueBtn = document.getElementById("zeptoContinueBtn");
const jobContinueBtn = document.getElementById("jobContinueBtn");
const restartBtn = document.getElementById("restartBtn");

// ✅ GAME STATE
let lives = 3;
let maxLives = 3;
let score = 0;
let basketSpeed = 30;
let fallInterval = 1500;
let basketX;
let gameEnded = false;
let consecutiveCatches = 0;
let diamondCount = 0;
let gamePaused = true;
let bombCount = 0;

let pizzaDropped = false;
let jobDropped = false;
let meeshoDropped = false;
let zeptoDropped = false;
let pizzaDropped2 = false;
let zeptoDropped2 = false;
let meeshoDropped2 = false;
let jobDropped2 = false;

let previousDiamondX = [];

window.onload = () => {
  gameContainer.style.display = "block";
  basketX = window.innerWidth / 2 - basket.offsetWidth / 2;
  basket.style.left = basketX + "px";
  gamePaused = false;

  setInterval(() => {
    if (!gameEnded && !gamePaused) {
      const dropCount = Math.floor(Math.random() * 2) + 1; // 1–2 items

      let usedX = [];

      for (let i = 0; i < dropCount; i++) {
        let posX;
        let attempts = 0;
        do {
          posX = Math.random() * (window.innerWidth - 80);
          attempts++;
        } while (usedX.some(x => Math.abs(x - posX) < 100) && attempts < 10);
        usedX.push(posX);
        createItem(posX);
      }
    }
  }, fallInterval);

  if (restartBtn) {
    restartBtn.addEventListener("click", () => location.reload());
  }
};

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') move('left');
  else if (e.key === 'ArrowRight') move('right');
});
['click', 'touchstart'].forEach(eventType => {
  leftBtn?.addEventListener(eventType, () => move('left'));
  rightBtn?.addEventListener(eventType, () => move('right'));
});

function move(direction) {
  if (gameEnded || gamePaused) return;
  const containerWidth = gameContainer.clientWidth;
  const basketWidth = basket.offsetWidth;
  if (direction === 'left') {
    basketX = Math.max(0, basketX - basketSpeed);
  } else if (direction === 'right') {
    basketX = Math.min(containerWidth - basketWidth, basketX + basketSpeed);
  }
  basket.style.left = basketX + 'px';
}
function getBombSpeed(score) {
  // 0–100 ⇒ gradually slower (easier)
  if (score < 100) {
    // from ~2.2 down to ~1.6 smoothly
    return Math.max(1.4, 2.2 - 0.006 * score);
  }

  // ≥100 ⇒ step-up at 100, 150, then every +50
  const steps = Math.floor((score - 100) / 50); // 0 for 100–149, 1 for 150–199, 2 for 200–249, ...
  const speed = 3.0 + steps * 0.4;              // “a little” faster each step
  return Math.min(speed, 8);                     // safety cap
}

function createItem(forcedX = null) {
  const loopedScore = score % 250;

  // Reset reward drop flags every 250-point cycle
  if (loopedScore < 2) {
    pizzaDropped = false;
    jobDropped = false;
    meeshoDropped = false;
    zeptoDropped = false;
    pizzaDropped2 = false;
    zeptoDropped2 = false;
    meeshoDropped2 = false;
    jobDropped2 = false;
  }

  if (gameEnded || gamePaused) return;

  const item = document.createElement('div');
  item.classList.add('falling-item');

  const posX = forcedX !== null ? forcedX : Math.random() * (window.innerWidth - 80);
  const posY = Math.floor(Math.random() * 120); // more vertical randomness

  item.style.left = posX + 'px';
  item.style.top = posY + 'px';

let type = 'diamond';
let image = 'basket ball.png';
const rand = Math.random();

const bombLimit = loopedScore < 40 ? 2 : Math.floor((loopedScore - 40) / 20) + 5;
if (rand < 0.15 && score > 10 && bombCount < bombLimit) {
  type = 'bomb';
  image = 'bomb 1.png';
  bombCount++;
} else if (score >= 40 && score < 250) {
  if (loopedScore >= 40 && loopedScore < 60 && !pizzaDropped) {
    type = 'pizza';
    image = 'pizza.png';
    pizzaDropped = true;
  } else if (loopedScore >= 60 && loopedScore < 80 && !pizzaDropped2) {
    type = 'pizza';
    image = 'pizza.png';
    pizzaDropped2 = true;
  } else if (loopedScore >= 80 && loopedScore < 100 && !zeptoDropped) {
    type = 'zepto';
    image = 'zepto coupon.png';
    zeptoDropped = true;
  } else if (loopedScore >= 100 && loopedScore < 120 && !meeshoDropped) {
    type = 'meesho';
    image = 'meesho voucher.png';
    meeshoDropped = true;
  } else if (loopedScore >= 120 && loopedScore < 150 && !zeptoDropped2) {
    type = 'zepto';
    image = 'zepto coupon.png';
    zeptoDropped2 = true;
  } else if (loopedScore >= 150 && loopedScore < 180 && !meeshoDropped2) {
    type = 'meesho';
    image = 'meesho voucher.png';
    meeshoDropped2 = true;
  } else if (loopedScore >= 200 && loopedScore < 230 && !jobDropped) {
    type = 'job';
    image = 'job delivery.png';
    jobDropped = true;
  } else if (loopedScore >= 230 && loopedScore < 250 && !jobDropped2) {
    type = 'job';
    image = 'job delivery.png';
    jobDropped2 = true;
  }
} else if (score >= 250) {
  const cycleStep = Math.floor((score - 250) / 30); // Every 30 points
  const rewardIndex = cycleStep % 4;

  // Use a persistent flag to ensure 1 reward drop per 30 point block
  if (!window.lastRewardCycle || window.lastRewardCycle !== cycleStep) {
    window.lastRewardCycle = cycleStep;

    switch (rewardIndex) {
      case 0:
        type = 'pizza';
        image = 'pizza.png';
        break;
      case 1:
        type = 'zepto';
        image = 'zepto coupon.png';
        break;
      case 2:
        type = 'meesho';
        image = 'meesho voucher.png';
        break;
      case 3:
        type = 'job';
        image = 'job delivery.png';
        break;
    }
  }
}

function createBallTrail(x, y) {
  const trail = document.createElement('div');
  trail.classList.add('ball-trail');
  trail.style.left = x + 'px';
  trail.style.top = y + 'px';
  gameContainer.appendChild(trail);

  // Remove the trail after animation ends
setTimeout(() => {
  trail.remove();
}, 400);
 // Match the duration in CSS
}


  item.dataset.type = type;
  item.style.backgroundImage = `url('${image}')`;
  gameContainer.appendChild(item);

  if (type === 'diamond') {
    previousDiamondX.push(posX);
    if (previousDiamondX.length > 10) previousDiamondX.shift();
  }

let speed;

// Reward items always fall at the same speed
if (['pizza', 'job', 'meesho', 'zepto'].includes(type)) {
  speed = 7;
} 
// Bombs increase speed based on score
else if (type === 'bomb') {
  if (loopedScore < 40) speed = 2.5;
  else if (loopedScore < 80) speed = 3;
  else if (loopedScore < 120) speed = 4;
  else if (loopedScore < 180) speed = 5;
  else speed = 6; // faster after 180
} 
// Diamonds: constant speed before 100, increase after
else if (type === 'diamond') {
speed = 4 + Math.min(loopedScore / 30, 6); // Scales smoothly from 4 to 10
}

// ZIG-ZAG CONFIG FOR DIAMOND
let zigzagDirection = Math.random() < 0.5 ? 1 : -1; // Start left or right
let zigzagStep = 0;
let zigzagMaxStep = 25; // how many frames before direction change
let zigzagSpeedX = 2; // side movement speed

function fall() {
  if (gameEnded || gamePaused) {
    item.remove();
    return;
  }

  let top = parseFloat(item.style.top);
  let left = parseFloat(item.style.left);

  if (type === 'diamond') {
    // Zig-zag movement for diamonds
    top += speed;
    left += zigzagDirection * zigzagSpeedX;
    zigzagStep++;

    if (left <= 0) {
      left = 0;
      zigzagDirection = 1;
    } else if (left + item.offsetWidth >= window.innerWidth) {
      left = window.innerWidth - item.offsetWidth;
      zigzagDirection = -1;
    }
item.style.left = left + 'px';
if (zigzagStep % 3 === 0) {
  createBallTrail(left, top);
}


  } else {
    // Straight fall for bombs and rewards
    top += speed;
  }

  item.style.top = top + 'px';
  item.style.zIndex = '5';

  if (top + item.offsetHeight < window.innerHeight) {
    if (isCaught(item)) {
      if (type === 'diamond') {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        catchSound.play();
        item.remove();

        consecutiveCatches++;
        if (consecutiveCatches === 5 && lives < maxLives) {
          lives++;
          const newHeart = document.createElement("img");
          newHeart.src = "red heart.png";
          newHeart.classList.add("heart");
          document.getElementById("hearts").appendChild(newHeart);
          consecutiveCatches = 0;
        }

      } else if (type === 'bomb') {
        crashSound.play();
        item.remove();
        gameEnded = true;
        gameOver();

      } else {
        // ✅ REWARD (pizza, meesho, etc.)
        catchSound.play();
        item.remove();
        gamePaused = true;
        gameContainer.style.display = "none";

        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const emailKey = currentUser.email ? `caughtOffers_${currentUser.email}` : "caughtOffers_guest";
        const caughtOffers = JSON.parse(localStorage.getItem(emailKey) || "[]");

        let rewardLabel = "", rewardValue = "";

        if (type === 'pizza') {
          rewardLabel = "Pizza Offer";
          rewardValue = "Flat 5% off on your next order!";
          pizzaRewardBox.style.display = "flex";
        } else if (type === 'meesho') {
          rewardLabel = "Meesho Discount";
          rewardValue = "Flat 7% off on your next order!";
          meeshoRewardBox.style.display = "flex";
        } else if (type === 'zepto') {
          rewardLabel = "Zepto Reward";
          rewardValue = "Flat 10% off on your next order!";
          zeptoRewardBox.style.display = "flex";
        } else if (type === 'job') {
          rewardLabel = "Job Hunt Bonus";
          rewardValue = "Get priority access to internships!";
          jobRewardBox.style.display = "flex";
        }

        if (rewardLabel && rewardValue) {
          caughtOffers.push({ label: rewardLabel, value: rewardValue });
          localStorage.setItem(emailKey, JSON.stringify(caughtOffers));
        }
      }

    } else {
      requestAnimationFrame(fall);
    }
  } else {
    item.remove();

    if (type === 'diamond') {
      if (lives > 0) {
        lives--;
        const heartElems = document.getElementsByClassName("heart");
        if (heartElems.length > 0) {
          document.getElementById("hearts").removeChild(heartElems[heartElems.length - 1]);
        }
      }

      consecutiveCatches = 0;

      if (lives === 0) {
        gameEnded = true;
        gameOver();
      }
    }
  }
}


  fall();
}

function isCaught(item) {
  const itemRect = item.getBoundingClientRect();
  const basketRect = basket.getBoundingClientRect();
  const verticalOffset = 8;
  const horizontalBuffer = 35;
  return (
    itemRect.bottom >= basketRect.top + verticalOffset &&
    itemRect.right - horizontalBuffer >= basketRect.left &&
    itemRect.left + horizontalBuffer <= basketRect.right
  );
}

function gameOver() {
  gameContainer.style.display = "none";
  const gameOverScreen = document.getElementById("gameOverScreen");
  const finalScoreText = document.getElementById("finalScoreText");
  gameOverScreen.style.display = "flex";
  finalScoreText.textContent = "Your score: " + score;
}

// ✅ Reward Continue Buttons
pizzaContinueBtn.onclick = () => {
  pizzaRewardBox.style.display = 'none';
  gameContainer.style.display = 'block';
  gamePaused = false;
};
meeshoContinueBtn.onclick = () => {
  meeshoRewardBox.style.display = 'none';
  gameContainer.style.display = 'block';
  gamePaused = false;
};
zeptoContinueBtn.onclick = () => {
  zeptoRewardBox.style.display = 'none';
  gameContainer.style.display = 'block';
  gamePaused = false;
};
jobContinueBtn.onclick = () => {
  jobRewardBox.style.display = 'none';
  gameContainer.style.display = 'block';
  gamePaused = false;
};

// ✅ Window Resize Support
window.addEventListener('resize', () => {
  if (!gameEnded && gameContainer.style.display !== 'none') {
    basketX = Math.min(window.innerWidth - basket.offsetWidth, basketX);
    basket.style.left = basketX + 'px';
  }
});

