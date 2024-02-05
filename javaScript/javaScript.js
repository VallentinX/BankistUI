'use strict';

/* HTML DOM Elements */
const bodyBkg = document.querySelector('body');
const formLogIn = document.querySelector('div.login');
const btnLogOut = document.querySelector('button.log-out');
const frontContainer = document.querySelector('div.front');

const labelWelcome = document.querySelector('p.welcome');
const labelDate = document.querySelector('span.date');
const labelBalance = document.querySelector('p.balance_value');
const labelSumIn = document.querySelector('span.summary_value-in');
const labelSumOut = document.querySelector('span.summary_value-out');
const labelSumInterest = document.querySelector('span.summary_value-interest');
const labelTimer = document.querySelector('span.timer');

const containerApp = document.querySelector('main.app');
const containerMovements = document.querySelector('div.movements');

const btnLogin = document.querySelector('button.login_btn');
const btnTransfer = document.querySelector('button.form_btn-transfer');
const btnLoan = document.querySelector('button.form_btn-loan');
const btnClose = document.querySelector('button.form_btn-close');
const btnSort = document.querySelector('button.btn-sort');

const inputLoginUsername = document.querySelector('input.login_input-user');
const inputLoginPin = document.querySelector('input.login_input-pin');
const inputTransferTo = document.querySelector('input.form_input-to');
const inputTransferAmount = document.querySelector('input.form_input-amount');
const inputLoanAmount = document.querySelector('input.form_input-loan-amount');
const inputCloseUsername = document.querySelector('input.form_input-user');
const inputClosePin = document.querySelector('input.form_input-pin');

/* Accounts stored in array */
const accounts = [
  demoAccount,
  accountOne,
  accountTwo,
  accountThree,
  accountFour,
  accountFive,
  accountSix,
  accountSeven,
  accountEight,
  accountNine,
  accountTen,
  accountEleven,
];
/* HTML Data */
let userAccount, timer;
const today = new Date();
const local = navigator.language;

let setTimer = 10000;

/* Create Dates */
/*
// const daysArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// const mounthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
*/

const getDay = value => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'short',
  };

  return new Intl.DateTimeFormat(local, options).format(value);
};

const getFullDate = value => {
  const calcDates = function (firstDate, secondDate) {
    return Math.round((firstDate - secondDate) / (1000 * 60 * 60 * 24));
  };
  const dayPassed = calcDates(today, value);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
    // weekday: 'short',
  };

  if (dayPassed === 0) return 'Today';
  else if (dayPassed === 1) return 'Yesterday';
  else if (dayPassed <= 7) return `${dayPassed} days ago`;
  else if (dayPassed <= 14) return `A few days ago`;
  else return new Intl.DateTimeFormat(local, options).format(value);
};

/* Background */
const bkgColors = [
  '#fff',
  '#f00',
  '#0f0',
  '#00f',
  '#ff0',
  '#0ff',
  '#f0f',
  '#a0f',
  '#fa0',
  '#f04',
];

const bkgColor = function () {
  const randomNumber = () => Math.floor(Math.random() * bkgColors.length);

  bodyBkg.style.backgroundImage = `linear-gradient(to top left, ${
    bkgColors[randomNumber()]
  }, #000, ${bkgColors[randomNumber()]})`;
};

bkgColor();

/* setTimeout */
const messageOnTimer = function () {
  setTimeout(() => {
    labelWelcome.textContent = `Welcome to FWB`;
  }, setTimer);
};

const logOutOnTime = function () {
  const tick = function () {
    const min = String(Math.floor(logOutTime / 60)).padStart(2, 0);
    const sec = String(logOutTime % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (logOutTime < 0) {
      clearInterval(timer);

      labelWelcome.textContent = "Time's up, you been loged out!";

      messageOnTimer();

      updateUIAgain();
    }

    logOutTime--;
  };

  let logOutTime = 600;

  tick();

  return setInterval(tick, 1000);
};

const resetTimer = () => {
  clearInterval(timer);

  timer = logOutOnTime();
};

/* Methodes */
const reduceFunction = (accumulator, value) => accumulator + value;
const filterFunction = transaction => transaction > 0;

const formatValut = function (value, locale, currency) {
  const fmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currencyDisplay: 'code',
    currency,
  });

  return fmt.format(value).replace(/^(-)?([A-Z]{3})\s*(.+)$/, '$1$3 $2');
};

/* Users Id */
const createUsers = function (accounts) {
  accounts.forEach(account => {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
  });
};

createUsers(accounts);

/* Users Transactions */
const loadMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  let movementsData = account.movements.map((move, i) => {
    const type = move > 0 ? 'deposit' : 'withdraw';
    const date = new Date(userAccount.dates[i]);
    return {move, type, date};
  });

  if (sort) {
    movementsData = movementsData.slice().sort((a, b) => a.move - b.move);
  }

  movementsData.forEach(function (movement, i) {
    const {move, type, date} = movement;

    const createRow = document.createElement('div');
    createRow.classList.add('movements_row');

    const createType = document.createElement('div');
    createType.classList.add('movements_type');
    createType.classList.add(`movements_type-${type}`);
    createType.textContent = `${i + 1}. ${type}`;
    createRow.appendChild(createType);

    const createDate = document.createElement('div');
    createDate.classList.add('movements_date');
    createDate.textContent = getFullDate(date);
    createRow.appendChild(createDate);

    const createValue = document.createElement('div');
    createValue.classList.add('movements_value');
    createValue.textContent = `${formatValut(
      move,
      account.locale,
      account.currency
    )}`;
    createRow.appendChild(createValue);

    containerMovements.insertBefore(createRow, containerMovements.firstChild);
  });
};

/* Calculate balance */
const calcBalance = function (account) {
  account.balance = account.movements.reduce(reduceFunction, 0);

  labelBalance.textContent = `${formatValut(
    account.balance,
    account.locale,
    account.currency
  )}`;
};

//Calculate summary
const calcSummary = function (account) {
  /* Income */
  const incomes = account.movements
    .filter(filterFunction)
    .reduce(reduceFunction, 0);

  labelSumIn.textContent = `${formatValut(
    incomes,
    account.locale,
    account.currency
  )}`;
  /* Out */
  const out = account.movements
    .filter(transaction => transaction < 0)
    .reduce(reduceFunction, 0);

  labelSumOut.textContent = `${formatValut(
    Math.abs(out),
    account.locale,
    account.currency
  )}`;
  /* Interest */
  const interest = account.movements
    .filter(filterFunction)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(transaction => transaction >= 15)
    .reduce(reduceFunction, 0);

  labelSumInterest.textContent = `${formatValut(
    interest,
    account.locale,
    account.currency
  )}`;
};

/* LogIn */
const logIn = function (e) {
  e.preventDefault(); // prevent form from submitting

  userAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );

  if (userAccount?.pin === +inputLoginPin.value) {
    const ownerName = userAccount.owner.split(' ');
    ownerName.pop();

    labelWelcome.textContent = `Welcome back, ${ownerName.join(' ')}!`;
    labelDate.textContent = getDay(today);

    containerApp.classList.remove('hidden');
    btnLogOut.classList.remove('hidden');
    formLogIn.classList.add('hidden');
    frontContainer.classList.add('hidden');

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(userAccount);

    timer = logOutOnTime();
  }
};

btnLogin.addEventListener('click', logIn);

/* LogOut */
const logOut = function (e) {
  e.preventDefault(); // prevent form from submitting

  labelWelcome.textContent = 'See you later!';

  updateUIAgain();

  messageOnTimer();

  clearInterval(timer);
};

btnLogOut.addEventListener('click', logOut);

// Update UI
const updateUI = account => {
  loadMovements(account);
  calcBalance(account);
  calcSummary(account);
};

const updateUIAgain = () => {
  containerApp.classList.add('hidden');
  btnLogOut.classList.add('hidden');
  frontContainer.classList.remove('hidden');
  formLogIn.classList.remove('hidden');
};

/* Transfer Money */
const transferMoney = function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const reciverAccount = accounts.find(
    account => account.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    reciverAccount &&
    userAccount.balance >= amount &&
    reciverAccount?.userName !== userAccount.userName &&
    userAccount !== demoAccount &&
    reciverAccount !== demoAccount
  ) {
    userAccount.movements.push(-amount);
    reciverAccount.movements.push(amount);

    userAccount.dates.push(today.toISOString());
    reciverAccount.dates.push(today.toISOString());

    updateUI(userAccount);

    resetTimer();
  }
};

btnTransfer.addEventListener('click', transferMoney);

/* Loan */
const loanRequest = function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  const loanCondition = userAccount.movements.some(
    value => value >= amount * 0.1
  );

  if (amount > 0 && loanCondition && userAccount !== demoAccount) {
    setTimeout(() => {
      userAccount.movements.push(amount);

      userAccount.dates.push(today.toISOString());

      updateUI(userAccount);
    }, setTimer);
  }

  inputLoanAmount.value = '';

  resetTimer();
};

btnLoan.addEventListener('click', loanRequest);

/* Close Account */
const closeAccount = function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === userAccount.userName &&
    +inputClosePin.value === userAccount.pin &&
    userAccount !== demoAccount
  ) {
    const index = accounts.findIndex(
      account => account.userName === userAccount.userName
    );

    labelWelcome.textContent = 'Account closed!';

    setTimeout(() => {
      inputCloseUsername.value = inputClosePin.value = '';

      accounts.splice(index, 1);

      updateUIAgain();
    }, setTimer - setTimer / 2);

    messageOnTimer();

    clearInterval(timer);
  }
};

btnClose.addEventListener('click', closeAccount);

/* Sort Transactions */
let sortState = false;
const sortActions = function (e) {
  e.preventDefault();

  loadMovements(userAccount, !sortState);

  resetTimer();

  sortState = !sortState;
};

btnSort.addEventListener('click', sortActions);
