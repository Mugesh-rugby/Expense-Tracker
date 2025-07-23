let totalIncome = 0;
let remainingBalance = 0;
let expenses = [];

function setTotalIncome() {
  totalIncome = parseFloat(document.getElementById('totalIncomeInput').value);
  if (isNaN(totalIncome) || totalIncome <= 0) {
    alert('Please enter a valid total income');
    return;
  }
  remainingBalance = totalIncome - getTotalExpenses();
  updateDisplays();
}

function getTotalExpenses() {
  return expenses.reduce((acc, e) => acc + Math.abs(e.amount), 0);
}

function updateDisplays() {
  document.getElementById('incomeDisplay').innerText = `Total Income: $${totalIncome}`;
  document.getElementById('balanceDisplay').innerText = `Remaining Balance: $${remainingBalance}`;
}

function addExpense() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const categoryDropdown = document.getElementById('categoryDropdown').value;
  const categoryInput = document.getElementById('categoryInput').value.trim();
  const month = document.getElementById('month').value;

  const category = categoryInput || categoryDropdown;

  if (!description || isNaN(amount) || !month || !category) {
    alert('Please fill all fields with valid data');
    return;
  }

  expenses.push({ id: Date.now(), description, amount, category, month });
  remainingBalance -= Math.abs(amount);
  updateDisplays();
  renderTable();
  updateMonthFilter();

  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('categoryInput').value = '';
  document.getElementById('categoryDropdown').value = '';
}

function renderTable(filteredExpenses = expenses) {
  const table = document.getElementById('transactionTable');
  table.innerHTML = '';

  filteredExpenses.forEach(e => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" class="delete-checkbox" data-id="${e.id}"></td>
      <td>${e.description}</td>
      <td>${e.category}</td>
      <td>-$${Math.abs(e.amount)}</td>
      <td>${e.month}</td>
    `;
    table.appendChild(row);
  });
}

function deleteSelected() {
  const selected = Array.from(document.querySelectorAll('.delete-checkbox:checked')).map(cb => Number(cb.dataset.id));
  expenses = expenses.filter(e => !selected.includes(e.id));
  remainingBalance = totalIncome - getTotalExpenses();
  updateDisplays();
  renderTable();
  updateMonthFilter();
}

function updateMonthFilter() {
  const uniqueMonths = [...new Set(expenses.map(e => e.month))];
  const monthFilter = document.getElementById('monthFilter');
  monthFilter.innerHTML = `<option value="">-- Select Month --</option>`;
  uniqueMonths.forEach(month => {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = month;
    monthFilter.appendChild(option);
  });
}

function filterByMonth() {
  const selectedMonth = document.getElementById('monthFilter').value;
  const filteredExpenses = selectedMonth
    ? expenses.filter(e => e.month === selectedMonth)
    : expenses;
  renderTable(filteredExpenses);
}
