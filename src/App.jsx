import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import ProjectDetails from "./pages/projectDetails.jsx";

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes basename="/exp-tr">
          <Route path="/" element={<Home />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
