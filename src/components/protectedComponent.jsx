import { useState, useEffect } from "react";

function ProtectedComponent({ children }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPassword = `${import.meta.env.VITE_PASSWORD}`; // Change this to a secure password

  // Check localStorage on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }

    // Clear localStorage when the website is closed
    const handleUnload = () => {
      localStorage.removeItem("isAuthenticated");
    };
    
    window.addEventListener("beforeunload", handleUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. Try again.");
      setPassword("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 h-screen flex items-center justify-center bg-gray-900 text-white">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Enter Password 🔒</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter Password"
          />
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedComponent;
