const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copy_btn = document.querySelector("[data-copy_btn]");
const lengthNumber = document.querySelector("[data-lengthNumber]");
const lengthSlider = document.querySelector("[data-lengthSlider]");
const uppercaseChek = document.querySelector("#uppercase");
const lowercaseChek = document.querySelector("#lowercase");
const numbersChek = document.querySelector("#numbers");
const symbolsChek = document.querySelector("#symbols");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");
const generate_btn = document.querySelector(".generateButton");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

//set password length
function handleSlider() {
  lengthSlider.value = passwordLength;
  lengthNumber.innerText = passwordLength;

  const min = lengthSlider.min;
  const max = lengthSlider.max;

  lengthSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}
//set strength
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
//to calculate strength
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseChek.checked) hasUpper = true;
  if (lowercaseChek.checked) hasLower = true;
  if (numbersChek.checked) hasNum = true;
  if (symbolsChek.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}
//to manage  copyContent
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckbox() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  //special case
  if (checkCount >= passwordLength) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckbox);
});

lengthSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copy_btn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generate_btn.addEventListener("click", () => {
  if (checkCount <= 0) {
    return;
  }
  if (checkCount > passwordLength) {
    passwordLength = checkCount;
    handleSlider();
  }
  //remove old password
  password = "";
  let funcArr = [];

  if (uppercaseChek.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseChek.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersChek.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsChek.checked) {
    funcArr.push(generateSymbol);
  }

  //compoulsary addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  //shuffle password
  password = shufflePassword(Array.from(password));

  //show on UI
  passwordDisplay.value = password;

  //calc strength
  calcStrength();
});
