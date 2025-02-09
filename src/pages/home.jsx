import { useEffect, useState } from "react";
import { db } from "../context/FirebaseConfig.js";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import ProjectList from "../components/projectList.jsx";
import ProjectForm from "../components/projectForm.jsx";
import ProtectedComponent from "../components/protectedComponent.jsx";

function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const addProject = async (name) => {
    await addDoc(collection(db, "projects"), { name, totalExpense: 0 });
  };

  return (
    <ProtectedComponent>
        <div className="fixed top-0 left-0 right-0 bottom-0 min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            {/* Header */}
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text mb-6">
                Expense Tracker 💰
            </h1>

            {/* Form Section */}
            <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <ProjectForm addProject={addProject} />
            </div>

            {/* Project List Section */}
            <ProjectList projects={projects} />
        </div>
    </ProtectedComponent>
  );
}

export default Home;
