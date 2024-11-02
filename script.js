// Bingo items directly embedded
const bingoItems = [
  "First Try flint",
  "Crafting The Wrong Item",
  "Mentions Skycrab",
  "Messes Up A Portal",
  "Getting A Diamong Pic",
  "Ruined Portal Enter",
  "<5 Iron",
  ">4 Diamonds",
  ">14 Iron",
  "Funny Death",
  "Dumb Death",
  "Bot Joins The Stream",
  "Missclicked",
  "Annoying Chatters",
  "Rickroll",
  "Unlucky",
  "Mushroom island spotted",
  "Hunger reset",
];

// Remove the fetch function
// async function fetchBingoItems() {
//   const response = await fetch('bingo.json');
//   const items = await response.json();
//   return items;
// }

// Generate a consistent random seed based on the current date
function getDailySeed() {
  const date = new Date();
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
}

// Simple pseudo-random number generator using the daily seed
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Shuffle the bingo items using the seeded random
function shuffleItems(items, seed) {
  let shuffled = items.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 9); // Return only 9 items
}

// Render the bingo board
function renderBoard(bingoItems) {
  const board = document.getElementById("bingo-board");
  board.innerHTML = "";

  bingoItems.forEach((item, index) => {
    const cell = document.createElement("div");
    cell.className = "bingo-cell";
    cell.textContent = item;
    cell.addEventListener("click", () => toggleClaimed(cell, index));

    // Check if the cell was previously claimed
    if (claimedCells.includes(index)) {
      cell.classList.add("claimed");
    }

    board.appendChild(cell);
  });
}

// Toggle claimed status
function toggleClaimed(cell, index) {
  cell.classList.toggle("claimed");

  if (claimedCells.includes(index)) {
    claimedCells = claimedCells.filter((i) => i !== index);
  } else {
    claimedCells.push(index);
  }

  localStorage.setItem("claimedCells", JSON.stringify(claimedCells));
}

// Initialize the bingo board
let claimedCells = JSON.parse(localStorage.getItem("claimedCells")) || [];

function init() {
  const seed = getDailySeed();
  const bingoItemsForToday = shuffleItems(bingoItems, seed);

  // Save today's bingo items in localStorage
  localStorage.setItem("todayBingoItems", JSON.stringify(bingoItemsForToday));

  renderBoard(bingoItemsForToday);
}

// Check if the stored bingo items are for today
function isSameDay() {
  const storedItems = JSON.parse(localStorage.getItem("todayBingoItems"));
  if (!storedItems) return false;

  const seed = getDailySeed();
  const items = shuffleItems(bingoItems, seed);

  return JSON.stringify(storedItems) === JSON.stringify(items);
}

// Clear localStorage if it's a new day
if (!isSameDay()) {
  localStorage.removeItem("claimedCells");
  localStorage.removeItem("todayBingoItems");
  claimedCells = [];
}

init();
