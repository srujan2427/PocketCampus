const STORAGE_KEY = "pocketCampusExpenses";
const MONTHLY_BUDGET = 8000;

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");
const budgetDisplay = document.getElementById("budget");
const clearButton = document.getElementById("clear-button");

let expenses = loadExpenses();

budgetDisplay.textContent = formatMoney(MONTHLY_BUDGET);

function loadExpenses() {
  try {
    const savedExpenses = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedExpenses) ? savedExpenses : [];
  } catch {
    return [];
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function renderExpenses() {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML =
      '<p class="empty">No expenses yet. Add your first one above.</p>';
  }

  expenses.forEach(function(expense) {
    const row = document.createElement("div");
    row.className = "expense";

    const details = document.createElement("div");

    const name = document.createElement("div");
    name.className = "expense-name";
    name.textContent = expense.name;

    const info = document.createElement("div");
    info.className = "expense-info";
    info.textContent = expense.category + " · " + expense.date;

    details.append(name, info);

    const rightSide = document.createElement("div");
    rightSide.className = "expense-right";

    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = formatMoney(expense.amount);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", "Delete " + expense.name);

    deleteButton.addEventListener("click", function() {
      expenses = expenses.filter(function(item) {
        return item.id !== expense.id;
      });

      updatePage();
    });

    rightSide.append(amount, deleteButton);
    row.append(details, rightSide);
    expenseList.appendChild(row);
  });

  const total = expenses.reduce(function(sum, expense) {
    return sum + Number(expense.amount);
  }, 0);

  totalDisplay.textContent = formatMoney(total);
}

function updatePage() {
  saveExpenses();
  renderExpenses();
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  if (name === "" || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  expenses.unshift({
    id: Date.now().toString(),
    name: name,
    amount: amount,
    category: category,
    date: new Date().toLocaleDateString("en-IN")
  });

  updatePage();
  form.reset();
  nameInput.focus();
});

clearButton.addEventListener("click", function() {
  if (expenses.length === 0) {
    return;
  }

  const confirmed = window.confirm("Delete all your expenses?");

  if (confirmed) {
    expenses = [];
    updatePage();
  }
});

renderExpenses();