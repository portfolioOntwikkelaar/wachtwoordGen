const resultEl = document.getElementById("result");
const lengthEl = document.getElementById("length");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const generateEl = document.getElementById("generate");
const clipboardEl = document.getElementById("clipboard");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");
const toast = document.getElementById("toast");

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

// 📋 Kopieer wachtwoord
clipboardEl.addEventListener("click", () => {
  const password = resultEl.innerText;
  if (!password) return;
  navigator.clipboard.writeText(password);
  showToast("📋 Gekopieerd naar klembord!");
});

// 🔁 Genereer wachtwoord
generateEl.addEventListener("click", () => {
  const length = +lengthEl.value;
  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numbersEl.checked;
  const hasSymbol = symbolsEl.checked;

  const password = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
  resultEl.innerText = password || "—";
updateStrength(password);
});

// 🔠 Functies voor random chars
function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
function getRandomSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

// 🧠 Wachtwoord genereren
function generatePassword(lower, upper, number, symbol, length) {
  let generatedPassword = "";
  const typesCount = lower + upper + number + symbol;
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );

  if (typesCount === 0) return "";

  for (let i = 0; i < length; i += typesCount) {
    typesArr.forEach((type) => {
      const funcName = Object.keys(type)[0];
      generatedPassword += randomFunc[funcName]();
    });
  }

  return generatedPassword.slice(0, length);
}

// 🔒 Sterkte-indicator
// 🔒 Sterkte-indicator (verbeterd)
function updateStrength(password) {
  if (!password) {
    strengthText.textContent = "–";
    strengthBar.style.width = "0%";
    strengthBar.style.background = "linear-gradient(90deg, #ff2d95, #ff930f)";
    return;
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let strengthLabel;
  let color;

  if (score <= 1) {
    strengthLabel = "Zwak";
    color = "linear-gradient(90deg, #ff2d95, #ff930f)";
  } else if (score === 2) {
    strengthLabel = "Redelijk";
    color = "linear-gradient(90deg, #ffaa00, #ffc107)";
  } else if (score === 3) {
    strengthLabel = "Sterk";
    color = "linear-gradient(90deg, #00e0ff, #28a452)";
  } else {
    strengthLabel = "Zeer sterk";
    color = "linear-gradient(90deg, #00ffae, #00c853)";
  }

  const width = Math.min(score * 20 + 20, 100) + "%";

  strengthText.textContent = strengthLabel;
  strengthBar.style.width = width;
  strengthBar.style.background = color;
}


// 💬 Toast melding
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
