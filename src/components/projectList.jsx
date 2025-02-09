import { Link } from "react-router-dom";

function ProjectList({ projects, deleteProject }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="p-3 border-b flex justify-between items-center">
            <Link to={`/project/${project.id}`} className="text-blue-400 hover:text-blue-300">
              {project.name} (₹{project.totalExpense})
            </Link>
            <button
              onClick={() => deleteProject(project.id)}
              className="bg-transparent hover:bg-black text-white px-2 py-1 rounded"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList;
