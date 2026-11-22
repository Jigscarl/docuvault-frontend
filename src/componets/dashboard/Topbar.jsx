import {useTheme} from "../useTheme";
import{Bell,Sun,Moon,Menu,Search,Upload, LogOut} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";


export default function Topbar({onMenuClick}){
    const {theme, toggleTheme } = useTheme();
    const {user, signOut} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/login", {replace: true});
        } catch (error){
            console.error("Logout failed:",error);
            alert("Unable to sign out. Please try again.");
        }
    };

    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" aria-label="Open Navigation">
                    <Menu size={22}/>
                </button>
                <div className="relative hidden sm:block">
                    <Search size={18} className="absolute left-3 top-3 text-slate-400"/>
                    <input type="search" placeholder="Search documents..." className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"/>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
                    {theme === "light" ? <Moon size={20}/> : <Sun size={20}/>}
                </button>
                <button className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Notifications">
                    <Bell size={20}/>
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"/>
                </button>
                <button className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 sm:flex">
                    <Upload size={18}/>
                    Upload
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                    U
                    <span className="text-sm text-gray-500">{user?.email}</span>
                </div>

                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/50">
                 <LogOut size={18}/> Sign Out
                </button>

            </div>
        </header>
    );
}
