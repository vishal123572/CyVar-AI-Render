import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default MainLayout;
