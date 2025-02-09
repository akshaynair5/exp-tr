import { useState } from "react";

function PersonForm({ addPerson }) {
  const [personName, setPersonName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (personName.trim()) {
      addPerson(personName);
      setPersonName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
      <input
        type="text"
        placeholder="Enter person name"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        className="bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button 
        type="submit" 
        className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-200"
      >
        Add
      </button>
    </form>
  );
}

export default PersonForm;
