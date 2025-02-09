import { useState } from "react";

function ExpenseForm({ people, addExpense, addIncome }) {
  const [entryType, setEntryType] = useState("expense"); // Expense or Income
  const [expenseType, setExpenseType] = useState("person"); // Expense: Person or Company
  const [incomeType, setIncomeType] = useState("contractual"); // Income: Contractual or Non-Contractual
  const [selectedPerson, setSelectedPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Default date: Format as DD/MM/YYYY
  const getFormattedDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const [date, setDate] = useState(getFormattedDate(new Date())); // Default: Today in dd/mm/yyyy

  const handleSubmit = (e) => {
    e.preventDefault();

    if (amount && description && date) {
      const formattedDate = getFormattedDate(date); // Convert YYYY-MM-DD to DD/MM/YYYY

      if (entryType === "expense") {
        addExpense(selectedPerson, parseFloat(amount), description, expenseType, formattedDate);
      } else {
        addIncome(parseFloat(amount), description, formattedDate, incomeType);
      }

      // Reset fields
      setAmount("");
      setDescription("");
      setSelectedPerson("");
      setIncomeType("contractual");
      setDate(getFormattedDate(new Date())); // Reset date to today's date
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-gray-800 p-5 rounded-lg shadow-md w-[95%] items-center ml-[2.5%]">
      <h3 className="text-lg font-semibold text-white mb-4">Add Transaction</h3>

      {/* Entry Type: Expense or Income */}
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

      {/* Expense Type: Person or Company (Only if Expense is selected) */}
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

      {/* Income Type: Contractual or Non-Contractual (Only if Income is selected) */}
      {entryType === "income" && (
        <div className="mb-3">
          <label className="text-white">Income Type:</label>
          <select
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-md mt-2"
            value={incomeType}
            onChange={(e) => setIncomeType(e.target.value)}
          >
            <option value="contractual">Contractual</option>
            <option value="non-contractual">Non-Contractual</option>
          </select>
        </div>
      )}

      {/* Dropdown for Selecting a Person (Only if Expense & Person is selected) */}
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

      {/* Description Input */}
      <input
        type="text"
        placeholder={entryType === "expense" ? "Expense description" : "Income source"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-md mt-3"
      />

      {/* Amount Input */}
      <input
        type="number"
        placeholder={entryType === "expense" ? "Enter expense amount" : "Enter income amount"}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-md mt-3"
      />

      {/* Date Input */}
      <input
        type="date"
        value={date.split("/").reverse().join("-")} // Convert DD/MM/YYYY to YYYY-MM-DD for input
        onChange={(e) => setDate(getFormattedDate(e.target.value))}
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
