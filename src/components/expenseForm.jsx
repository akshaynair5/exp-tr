import { useState } from "react";

function ExpenseForm({ people, addExpense, addIncome }) {
  const [entryType, setEntryType] = useState("expense"); // 🔹 New: Expense or Income
  const [expenseType, setExpenseType] = useState("person"); // 🔹 Expense: Person or Company
  const [selectedPerson, setSelectedPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // 🔹 Default: Today

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && description && date) {
      if (entryType === "expense") {
        addExpense(selectedPerson, parseFloat(amount), description, expenseType, date);
      } else {
        addIncome(parseFloat(amount), description, date); // 🔹 Call separate function for income
      }

      // Reset fields
      setAmount("");
      setDescription("");
      setSelectedPerson("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-white mb-4">Add Transaction</h3>

      {/* 🔹 Entry Type: Expense or Income */}
      <div className="mb-3">
        <label className="text-white">Entry Type:</label>
        <select
          className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-md mt-2"
          value={entryType}
          onChange={(e) => setEntryType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* 🔹 Expense Type: Person or Company (Only if Expense is selected) */}
      {entryType === "expense" && (
        <div className="mb-3">
          <label className="text-white">Expense Type:</label>
          <select
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-md mt-2"
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
          >
            <option value="person">Person</option>
            <option value="company">Company</option>
          </select>
        </div>
      )}

      {/* 🔹 Dropdown for Selecting a Person (Only if Expense & Person is selected) */}
      {entryType === "expense" && expenseType === "person" && (
        <select
          onChange={(e) => setSelectedPerson(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-md mt-3"
          value={selectedPerson}
        >
          <option value="">-- Select Person --</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      )}

      {/* 🔹 Description Input */}
      <input
        type="text"
        placeholder={entryType === "expense" ? "Expense description" : "Income source"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-md mt-3"
      />

      {/* 🔹 Amount Input */}
      <input
        type="number"
        placeholder={entryType === "expense" ? "Enter expense amount" : "Enter income amount"}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-md mt-3"
      />

      {/* 🔹 Date Input */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-md mt-3"
      />

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
      >
        {entryType === "expense" ? "Add Expense" : "Add Income"}
      </button>
    </form>
  );
}

export default ExpenseForm;
