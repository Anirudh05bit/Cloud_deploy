import { BrowserRouter, Routes, Route } from "react-router-dom";
import Deployments from "./pages/Deployments";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import DeploymentDetails from "./pages/DeploymentDetails";
import Logs from "./pages/Logs";
import Environments from "./pages/Environments";

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
<Route path="/deployments" element={<Deployments />} />
<Route path="/logs" element={<Logs />} />
<Route path="/environments" element={<Environments />} />
<Route
  path="/deployments/:deploymentId"
  element={<DeploymentDetails />}
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