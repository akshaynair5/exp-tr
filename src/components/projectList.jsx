import { useState } from "react";
import { db } from "../context/FirebaseConfig.js";
import { updateDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

function ProjectList({ projects }) {
  const [editProjectId, setEditProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");

  const startEditing = (id, name) => {
    setEditProjectId(id);
    setNewProjectName(name);
  };

  const updateProject = async (id) => {
    if (newProjectName.trim() === "") return;

    await updateDoc(doc(db, "projects", id), { name: newProjectName });
    setEditProjectId(null);
    setNewProjectName("");
  };

  return (
    <div className="w-full max-w-md mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      {projects.map((project) => (
        <div key={project.id} className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600 flex justify-between items-center">
          {editProjectId === project.id ? (
            <>
              <input
                type="text"
                className="p-2 bg-gray-600 text-white rounded-md w-full"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <button
                onClick={() => updateProject(project.id)}
                className="ml-2 bg-green-500 text-white px-3 py-1 rounded-lg transition hover:bg-green-700"
              >
                ✅
              </button>
            </>
          ) : (
            <>
              <Link to={`/project/${project.id}`} className="text-blue-400 hover:text-blue-300">
                {project.name} (₹{project.totalExpense})
              </Link>
              <button
                onClick={() => startEditing(project.id, project.name)}
                className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded-lg transition hover:bg-yellow-700"
              >
                Update
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
