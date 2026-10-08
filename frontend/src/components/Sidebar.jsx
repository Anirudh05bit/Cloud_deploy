import { NavLink } from "react-router-dom";


const navigation = [
  {
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Projects",
    path: "/projects",
  },
  {
    name: "Deployments",
    path: "/deployments",
  },
  {
    name: "Logs",
    path: "/logs",
  },
  {
    name: "Environments",
    path: "/environments",
  },
  {
    name: "Settings",
    path: "/settings",
  },
];


function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white">

      <div className="flex h-16 items-center border-b border-slate-200 px-6">

        <h1 className="text-xl font-bold text-slate-900">
          CloudDeploy
        </h1>

      </div>


      <nav className="p-4">

        {navigation.map((item) => {
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `mb-1 block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >

              {item.name}

            </NavLink>
          );

        })}

      </nav>

    </aside>
  );
}

export default Sidebar;