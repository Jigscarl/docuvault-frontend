import {NavLink} from "react-router-dom";
import {LayoutDashboard,Files,FolderOpen,Star,Trash2,Settings,ShieldCheck,X} from "lucide-react";

const navigation =[
    {name: "Dashboard", path: "/dashboard", icon: LayoutDashboard},
    {name: "All Documents", path: "/documents", icon: Files},
    {name: "My Folders", path: "/folders", icon: FolderOpen},
    {name: "Favorites", path: "/favorites", icon: Star},
    {name: "Trash", path: "/trash", icon: Trash2},

];

export default function Sidebar({open, onClose}){
   return(
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose}/>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
       >
       <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
         <div className="flex items-center gap-3">
           <ShieldCheck className="text-indigo-600" size={30}/>
           <span className="text-xl font-bold">Docuvault</span>
         </div>
         <button onClick={onClose} className="lg:hidden">
           <X size={20}/>
         </button>
       </div>

       <div className="px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {navigation.map((item)=> {
            const Icon = item.icon;

            return (
            <NavLink key={item.name} to={item.path} onClick={onClose} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
             <Icon size={20}/> {item.name}
            </NavLink>
            );
            })}
        </nav>
       </div>
       <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
        <NavLink to="/settings" onClick={onClose} className="flex items-center gap-3 rounded-xl dark:text-slate-300 dark:hover:bg-slate-800">
        <Settings size={20}/>
        Settings
        </NavLink>
        <div className="mt-4 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-500/10">
         <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">Docuvault</p>
         <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Secure Document Management</p>
        </div>
       </div>
    </aside>
    </>
   );
}