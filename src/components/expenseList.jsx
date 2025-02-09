import { useState } from "react";

function ExpenseList({ expenses, updateExpense }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  // Function to format the date to dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format
  };

  // Extract unique dates for filtering and format them
  const availableDates = [...new Set(expenses.map(expense => expense.date))];

  // Filter expenses based on selected date
  const filteredExpenses = selectedDate
    ? expenses.filter(expense => expense.date === selectedDate)
    : expenses;

  // Sort expenses by date (latest first)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Handle input change for the updated data
  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // Handle form submission to update expense
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense(editingExpense.id, updatedData);
      setEditingExpense(null);
      setUpdatedData({});
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-white mb-3 md:mb-0">💸 Expenses</h3>

        {/* Date Filter Dropdown */}
        <select
          className="p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="">📅 All Dates</option>
          {availableDates.map(date => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {sortedExpenses.length === 0 ? (
          <p className="text-gray-400 text-center">No expenses found for this date.</p>
        ) : (
          sortedExpenses.map((expense) => (
            <li 
              key={expense.id} 
              className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600 transition hover:bg-gray-600"
            >
              {editingExpense?.id === expense.id ? (
                // Edit Form
                <form onSubmit={handleUpdateSubmit}>
                  <input 
                    type="text"
                    name="person"
                    defaultValue={expense.person}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                    required
                  />
                  <input 
                    type="text"
                    name="description"
                    defaultValue={expense.description}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                    required
                  />
                  <input 
                    type="date"
                    name="date"
                    defaultValue={expense.date}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                    required
                  />
                  <input 
                    type="number"
                    name="amount"
                    defaultValue={expense.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                    required
                  />
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg transition hover:bg-green-700 mr-2"
                    >
                      Save
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditingExpense(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg transition hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Display Expense Item
                <>
                  <h4 className="text-lg font-semibold text-blue-400">
                    {expense.person === "company" ? "🏢 Company Expense" : `👤 ${expense.person}`}
                  </h4>
                  <p className="text-gray-300 italic mt-1 mb-3">📌 {expense.description}</p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="text-gray-500 text-sm">📅 {formatDate(expense.date)}</p>

                    <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
                      <span className="text-xl font-bold text-green-400 mr-4">₹{expense.amount}</span>
                      <button 
                        onClick={() => {
                          setEditingExpense(expense);
                          setUpdatedData(expense);
                        }}
                        className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded-lg transition hover:bg-yellow-700"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ExpenseList;
