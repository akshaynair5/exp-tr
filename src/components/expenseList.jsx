import { useState } from "react";

function ExpenseList({ expenses, deleteExpense }) {
  const [selectedDate, setSelectedDate] = useState("");

  // Extract unique dates for filtering
  const availableDates = [...new Set(expenses.map(expense => expense.date))];

  // Filter expenses based on selected date
  const filteredExpenses = selectedDate
    ? expenses.filter(expense => expense.date === selectedDate)
    : expenses;

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
              {date}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-400 text-center">No expenses found for this date.</p>
        ) : (
          filteredExpenses.map((expense) => (
            <li 
              key={expense.id} 
              className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600 transition hover:bg-gray-600"
            >
              {/* Name & Description - Full Width */}
              <h4 className="text-lg font-semibold text-blue-400">
                {expense.person === "company" ? "🏢 Company Expense" : `👤 ${expense.person}`}
              </h4>
              <p className="text-gray-300 italic mt-1 mb-3">📌 {expense.description}</p>

              {/* Date, Amount & Delete Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <p className="text-gray-500 text-sm">📅 {expense.date}</p>

                <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
                  <span className="text-xl font-bold text-green-400 mr-4">₹{expense.amount}</span>
                  <button 
                    onClick={() => deleteExpense(expense.id)}
                    className="bg-transparent text-white px-3 py-1 rounded-lg transition hover:bg-black-700"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ExpenseList;
