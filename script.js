// script.js
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
    updateBalance();
});

function addTransaction() {
    const description = document.getElementById('transactionDescription').value.trim();
    const amount = parseFloat(document.getElementById('transactionAmount').value.trim());
    const type = document.getElementById('transactionType').value;

    if (description === '' || isNaN(amount)) {
        alert('Please enter valid description and amount!');
        return;
    }

    const transaction = {
        description,
        amount,
        type
    };

    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);

    document.getElementById('transactionDescription').value = '';
    document.getElementById('transactionAmount').value = '';
    document.getElementById('transactionType').value = 'income';

    addTransactionToUI(transaction);
    updateBalance();
}

function addTransactionToUI(transaction) {
    const transactionList = document.getElementById('transactionList');
    const transactionItem = document.createElement('li');
    transactionItem.classList.add(transaction.type);
    transactionItem.innerHTML = `
        ${transaction.description}: $${transaction.amount.toFixed(2)}
        <button onclick="removeTransaction(this)">Remove</button>
    `;
    transactionList.appendChild(transactionItem);
}

function removeTransaction(button) {
    const transactionItem = button.parentElement;
    const description = transactionItem.textContent.split(':')[0].trim();
    const amount = parseFloat(transactionItem.textContent.split('$')[1].split(' ')[0].trim());
    const type = transactionItem.classList.contains('income') ? 'income' : 'expense';

    let transactions = getTransactions();
    transactions = transactions.filter(t => t.description !== description || t.amount !== amount || t.type !== type);
    saveTransactions(transactions);

    transactionItem.remove();
    updateBalance();
}

function updateBalance() {
    const transactions = getTransactions();
    const balance = transactions.reduce((acc, transaction) => {
        return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
    document.getElementById('balance').textContent = balance.toFixed(2);
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

function saveTransactions(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
    const transactions = getTransactions();
    transactions.forEach(addTransactionToUI);
}
