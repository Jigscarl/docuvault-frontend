import {useState} from "react";
import {Outlet} from "react-router-dom";
import Sidebar  from "../componets/dashboard/Sidebar";
import Topbar from "../componets/dashboard/Topbar";

export default function DashbordLayout(){
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            <Sidebar open={sidebarOpen} onClose={()=> setSidebarOpen(false)}/>
                <div className="min-h-screen lg:pl-64">
                    <Topbar onMenuClick={() =>setSidebarOpen(true)}/>
                        <main className="p-4 sm:p-6 lg:p-8"><Outlet/></main>
                </div>
        </div>

    );
}