const dice = document.getElementById("dice1");
const rollBtn = document.getElementById("rollDice");
const holdBtn = document.getElementById("hold");
const newGameBtn = document.getElementById("newGame");
const targetInput = document.getElementById("targetInput");
const targetDisplay = document.getElementById("targetValue");
const winnerDisplay = document.getElementById("winnerDisplay");

let scores, currentScore, activePlayer, playing, targetScore;

for (let i = 0; i < 9; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  dice.appendChild(dot);
}

function init() {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  targetScore = parseInt(targetInput.value) || 100;

  targetInput.disabled = false;
  targetDisplay.textContent = `🎯 Target: ${targetScore}`;

  document.getElementById("score1").textContent = 0;
  document.getElementById("score2").textContent = 0;
  document.getElementById("current1").textContent = 0;
  document.getElementById("current2").textContent = 0;
  document.getElementById("activePlayer").textContent = "Player 1's Turn";
  document.getElementById("player1").classList.add("active");
  document.getElementById("player2").classList.remove("active");

  winnerDisplay.classList.add("hidden");
  resetDice();
}
init();

function resetDice() {
  dice.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"));
}

function showDiceFace(number) {
  resetDice();
  const dots = dice.querySelectorAll(".dot");
  const faces = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  };
  faces[number].forEach(i => dots[i - 1].classList.add("active"));
}

rollBtn.addEventListener("click", () => {
  if (!playing) return;

  if (!targetInput.disabled) targetInput.disabled = true;
  if (scores[activePlayer] + currentScore >= targetScore) return;

  dice.classList.add("spin");
  const roll = Math.trunc(Math.random() * 6) + 1;

  setTimeout(() => {
    dice.classList.remove("spin");
    showDiceFace(roll);

    if (roll !== 1) {
      currentScore += roll;
      document.getElementById(`current${activePlayer + 1}`).textContent = currentScore;

      if (scores[activePlayer] + currentScore >= targetScore) {
        scores[activePlayer] += currentScore;
        document.getElementById(`score${activePlayer + 1}`).textContent = scores[activePlayer];
        declareWinner(activePlayer);
      }
    } else {
      currentScore = 0;
      document.getElementById(`current${activePlayer + 1}`).textContent = 0;
      switchPlayer();
    }
  }, 600);
});

holdBtn.addEventListener("click", () => {
  if (!playing) return;

  scores[activePlayer] += currentScore;
  document.getElementById(`score${activePlayer + 1}`).textContent = scores[activePlayer];

  if (scores[activePlayer] >= targetScore) {
    declareWinner(activePlayer);
  } else {
    currentScore = 0;
    document.getElementById(`current${activePlayer + 1}`).textContent = 0;
    switchPlayer();
  }
});

newGameBtn.addEventListener("click", init);

targetInput.addEventListener("input", () => {
  if (!targetInput.disabled) {
    targetScore = parseInt(targetInput.value) || 100;
    targetDisplay.textContent = `🎯 Target: ${targetScore}`;
  }
});

function switchPlayer() {
  activePlayer = activePlayer === 0 ? 1 : 0;
  document.getElementById("activePlayer").textContent = `Player ${activePlayer + 1}'s Turn`;
  document.getElementById("player1").classList.toggle("active");
  document.getElementById("player2").classList.toggle("active");
}

function declareWinner(playerIndex) {
  playing = false;
  targetInput.disabled = false;
  currentScore = 0;
  document.getElementById(`current${playerIndex + 1}`).textContent = 0;
  document.getElementById("activePlayer").textContent = `🏆 Player ${playerIndex + 1} Wins!`;
  winnerDisplay.textContent = `🏆 Player ${playerIndex + 1} Wins!`;
  winnerDisplay.classList.remove("hidden");
}
