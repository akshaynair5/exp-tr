import { useState } from "react";

function ProjectForm({ addProject }) {
  const [projectName, setProjectName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      addProject(projectName);
      setProjectName("");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="mb-6 bg-gray-900 p-4 rounded-lg shadow-md flex items-center gap-3"
    >
      <input
        type="text"
        placeholder="Enter project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="flex-1 bg-gray-800 text-gray-200 placeholder-gray-400 border border-gray-700 
                   rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md 
                   hover:bg-blue-500 transition duration-200"
      >
        Add Project
      </button>
    </form>
  );
}

export default ProjectForm;
