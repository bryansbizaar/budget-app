// Budget App JavaScript

// State management
let budgetData = {
  income: 0,
  fixedCategories: [],
  discretionaryCategories: [],
};

// DOM elements
const incomeInput = document.getElementById("monthly-income");
const fixedContainer = document.getElementById("fixed-categories");
const discretionaryContainer = document.getElementById(
  "discretionary-categories"
);
const addFixedBtn = document.getElementById("add-fixed-btn");
const addDiscretionaryBtn = document.getElementById("add-discretionary-btn");

// Summary elements
const summaryIncome = document.getElementById("summary-income");
const summaryFixed = document.getElementById("summary-fixed");
const summaryDiscretionary = document.getElementById("summary-discretionary");
const summaryTotal = document.getElementById("summary-total");
const summaryRemaining = document.getElementById("summary-remaining");
const remainingRow = document.getElementById("remaining-row");

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  loadBudgetData();
  setupEventListeners();
  updateSummary();
});

// Event listeners
function setupEventListeners() {
  incomeInput.addEventListener("input", handleIncomeChange);
  addFixedBtn.addEventListener("click", () => addCategory("fixed"));
  addDiscretionaryBtn.addEventListener("click", () => addCategory("discretionary"));
  
  // Event delegation for category items
  document.addEventListener("click", handleCategoryClick);
  document.addEventListener("change", handleCategoryChange);
  document.addEventListener("input", handleAllInputResize);
  document.addEventListener("keydown", handleKeyboardShortcuts);
}

// Handle income input changes
function handleIncomeChange() {
  const value = parseFloat(incomeInput.value);
  if (value < 0) {
    incomeInput.value = 0;
    budgetData.income = 0;
  } else {
    budgetData.income = value || 0;
  }
  saveBudgetData();
  updateSummary();
}

// Add a new category
function addCategory(type) {
  const categoryData = {
    id: generateId(),
    name: "",
    amount: 0,
  };

  const categories = type === "fixed" ? budgetData.fixedCategories : budgetData.discretionaryCategories;
  categories.push(categoryData);
  renderCategory(categoryData, type);
  
  saveBudgetData();
  updateSummary();
}

// Remove a category
function removeCategory(id, type) {
  const categories = type === "fixed" ? budgetData.fixedCategories : budgetData.discretionaryCategories;
  const index = categories.findIndex(cat => cat.id === id);
  
  if (index !== -1) {
    categories.splice(index, 1);
    
    // Remove from DOM
    const categoryElement = document.getElementById(`category-${id}`);
    if (categoryElement) {
      categoryElement.remove();
    }
    
    saveBudgetData();
    updateSummary();
  }
}

// Render a category in the DOM
function renderCategory(categoryData, type) {
  const container = type === "fixed" ? fixedContainer : discretionaryContainer;

  const categoryDiv = document.createElement("div");
  categoryDiv.className = "category-item";
  categoryDiv.id = `category-${categoryData.id}`;
  categoryDiv.dataset.type = type;
  categoryDiv.dataset.categoryId = categoryData.id;

  categoryDiv.innerHTML = `
        <input type="text" 
               class="category-name" 
               placeholder="Category name" 
               value="${categoryData.name}"
               data-field="name">
        <span class="currency">$</span>
        <input type="number" 
               class="category-amount" 
               placeholder="0" 
               min="0" 
               step="1"
               value="${categoryData.amount || ""}"
               data-field="amount">
        <button class="remove-btn" data-action="remove">Remove</button>
    `;

  container.appendChild(categoryDiv);

  // Focus on the name input for new categories
  if (!categoryData.name) {
    const nameInput = categoryDiv.querySelector(".category-name");
    nameInput.focus();
  }
  
  // Set initial width for inputs
  const amountInput = categoryDiv.querySelector(".category-amount");
  const nameInput = categoryDiv.querySelector(".category-name");
  autoResizeAmountInput(amountInput);
  autoResizeNameInput(nameInput);
}

// Event handlers using event delegation
function handleCategoryClick(event) {
  if (event.target.dataset.action === "remove") {
    const categoryItem = event.target.closest(".category-item");
    const id = categoryItem.dataset.categoryId;
    const type = categoryItem.dataset.type;
    removeCategory(id, type);
  }
}

function handleCategoryChange(event) {
  const field = event.target.dataset.field;
  if (!field) return;
  
  const categoryItem = event.target.closest(".category-item");
  if (!categoryItem) return;
  
  const id = categoryItem.dataset.categoryId;
  const type = categoryItem.dataset.type;
  const value = event.target.value;
  
  updateCategoryField(id, type, field, value);
}

function handleAllInputResize(event) {
  if (event.target.classList.contains('category-amount')) {
    autoResizeAmountInput(event.target);
  } else if (event.target.classList.contains('category-name')) {
    autoResizeNameInput(event.target);
  } else if (event.target.classList.contains('income-input')) {
    autoResizeIncomeInput(event.target);
  }
}

function updateCategoryField(id, type, field, value) {
  const categories = type === "fixed" ? budgetData.fixedCategories : budgetData.discretionaryCategories;
  const category = categories.find((cat) => cat.id === id);
  
  if (!category) return;
  
  if (field === "name") {
    category.name = value;
  } else if (field === "amount") {
    const numValue = parseFloat(value);
    if (numValue < 0) {
      event.target.value = 0;
      category.amount = 0;
    } else {
      category.amount = numValue || 0;
    }
    // Auto-resize handled by input event listener
    updateSummary();
  }
  
  saveBudgetData();
}

// Legacy functions for compatibility (can be removed)
function updateCategoryName(id, type, name) {
  updateCategoryField(id, type, "name", name);
}

function updateCategoryAmount(id, type, amount) {
  updateCategoryField(id, type, "amount", amount);
}

// Calculate totals and update summary
function updateSummary() {
  const fixedTotal = budgetData.fixedCategories.reduce(
    (sum, cat) => sum + cat.amount,
    0
  );
  const discretionaryTotal = budgetData.discretionaryCategories.reduce(
    (sum, cat) => sum + cat.amount,
    0
  );
  const totalAllocated = fixedTotal + discretionaryTotal;
  const remaining = budgetData.income - totalAllocated;

  // Update summary display
  summaryIncome.textContent = formatCurrency(budgetData.income);
  summaryFixed.textContent = formatCurrency(fixedTotal);
  summaryDiscretionary.textContent = formatCurrency(discretionaryTotal);
  summaryTotal.textContent = formatCurrency(totalAllocated);
  summaryRemaining.textContent = formatCurrency(remaining);

  // Update remaining row styling based on budget status
  remainingRow.className = "summary-row total";
  if (remaining > 0) {
    remainingRow.classList.add("remaining");
  } else if (remaining < 0) {
    remainingRow.classList.add("over-budget");
  } else {
    remainingRow.classList.add("break-even");
  }
}

// Format currency for display
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Generate unique ID for categories
function generateId() {
  return "cat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

// Local storage functions
function saveBudgetData() {
  localStorage.setItem('budgetAppData', JSON.stringify(budgetData));
}

function loadBudgetData() {
  const saved = localStorage.getItem('budgetAppData');
  if (saved) {
    budgetData = JSON.parse(saved);
    incomeInput.value = budgetData.income || '';
    autoResizeIncomeInput(incomeInput);
    
    // Render saved categories
    budgetData.fixedCategories.forEach(cat => renderCategory(cat, 'fixed'));
    budgetData.discretionaryCategories.forEach(cat => renderCategory(cat, 'discretionary'));
  }
}

// Auto-resize inputs based on content
function autoResizeAmountInput(input) {
  if (!input || !input.classList.contains('category-amount')) return;
  
  const value = input.value || '0';
  const length = Math.max(value.length, 1);
  
  // Set width based on content length, with more generous bounds
  const newWidth = Math.min(Math.max(length + 2, 4), 12) + 'ch';
  input.style.width = newWidth;
}

function autoResizeNameInput(input) {
  if (!input || !input.classList.contains('category-name')) return;
  
  const value = input.value || input.placeholder || '';
  const length = Math.max(value.length, 8);
  
  // Set width based on content length
  const newWidth = Math.min(Math.max(length + 2, 10), 25) + 'ch';
  input.style.width = newWidth;
}

function autoResizeIncomeInput(input) {
  if (!input || !input.classList.contains('income-input')) return;
  
  const value = input.value || input.placeholder || '';
  const length = Math.max(value.length, 15);
  
  // Income input stays full width but adjusts minimum
  const minWidth = Math.max(length + 2, 20) + 'ch';
  input.style.minWidth = minWidth;
}

// Keyboard shortcuts and input validation
function handleKeyboardShortcuts(event) {
  if (event.key === 'Enter' && event.target.matches('.category-name')) {
    const categoryItem = event.target.closest('.category-item');
    const type = categoryItem ? categoryItem.dataset.type : null;
    if (type) addCategory(type);
  }
}
