import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Server,
  ShieldAlert,
  Activity,
  Network,
  FlaskConical,
  IndianRupee,
  ShieldCheck,
  Bot,
  FileText,
  Plug,
} from "lucide-react";

function Sidebar() {
  const menu = [
    {
      name: "Overview",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Assets",
      path: "/assets",
      icon: Server,
    },
    {
      name: "Vulnerabilities",
      path: "/vulnerabilities",
      icon: ShieldAlert,
    },
    {
      name: "Risk Analysis",
      path: "/risk-analysis",
      icon: Activity,
    },
    {
      name: "Cyber Risk Twin",
      path: "/digital-twin",
      icon: Network,
    },
    {
      name: "What-If Simulator",
      path: "/simulator",
      icon: FlaskConical,
    },
    {
      name: "Investment Optimizer",
      path: "/investment",
      icon: IndianRupee,
    },
    {
      name: "Data Connectors",
      path: "/connectors",
      icon: Plug,
    },
    {
      name: "Compliance",
      path: "/compliance",
      icon: ShieldCheck,
    },
    {
      name: "CyVar Copilot",
      path: "/copilot",
      icon: Bot,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
    },
  ];

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        h-screen
        w-64
        bg-slate-900
        border-r
        border-slate-800
        p-5
        overflow-y-auto
      "
    >
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-cyan-400">
          CyVar AI
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Cyber Risk Intelligence
        </p>
      </div>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={19} />

              <span className="text-sm">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;