import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";


function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <Navbar />

      <main className="ml-64 pt-16">

        <Routes>

  <Route
    path="/"
    element={<Dashboard />}
  />

  <Route
    path="/projects"
    element={<Projects />}
  />
  <Route
  path="/projects/:projectId"
  element={<ProjectDetails />}
/>

</Routes>

      </main>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}


export default App;