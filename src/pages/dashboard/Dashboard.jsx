import {Files,HardDrive,Users,Clock,Upload,ArrowUpRight,FileText,FileImage,FileSpreadsheet,File} from "lucide-react";
import {useNavigate} from "react-router-dom"

const stats = [
    {
        title: "Total Documents",
        value: "1,256",
        change: "+12.5%",
        icon: Files,
        color:"indigo"
    },
    {
        title: "Storage Used",
        value: "5.3 GB",
        change: "of 50 GB",
        icon:HardDrive,
        color: "blue",
    },
    {
        title: "Shared Documents",
        value: "12",
        change: "+2.3%",
        icon: Users,
        color: "purple",
    },
    {
        title: "Recent Uploads",
        value: "8",
        change:"This Month",
        icon: Clock,
        color:"emerald"
    },
];

const documents = [
    {
        name:"Project proposal.pdf",
        category:"Project Documents",
        date: "3rd Nov 2026",
        size: "2.2MB",
        icon: FileText,
        color: "text-red-500"
    },
    {
        name: "Financial Report.xlsx",
        category: "Finance",
        date: "1st Nov 2026",
        size: "1.7MB",
        icon: FileSpreadsheet,
        color:"text-green-500"
    },
    {
        name:"Company Logo.png",
        category:"image",
        date:"29th Oct 2026",
        size:"679KB",
        icon:FileImage,
        color: "text-indigo-500"
    },
    {
        name: "Meeting Notes.docx",
        category: "Work Documents",
        date: "30th Nov 2026",
        size: "1.4MB",
        icon: File,
        color: "text-indigo-500"
    }

];

export default  function Dashboard(){
    const navigate = useNavigate()
    return(
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Welcome back.</p>
                </div>
                <button onClick={() => navigate("/upload")} className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700">
                    <Upload size={18}/>
                    Upload Document
                </button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat)=> {
                    const Icon = stat.icon;
                    return (
                       <div key={stat.title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                              <Icon size={22}/>
                            </div>
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <h2 className="text-2xl font-bold ">{stat.value}</h2>
                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                                <ArrowUpRight size={14}/> {stat.change}
                            </span>
                        </div>
                       </div>
                    );
                })}
            </div>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-semibold">Recent Documents</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your Recently uploaded files</p>
                    </div>
                    <button className="text-sm font-medium text-indigo-600 hover:underline">View all</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                          <tr>
                            <th className="px-5 py-4 font-medium">Document</th>
                            <th className="px-5 py-4 font-medium">Category</th>
                            <th className="px-5 py-4 font-medium">Date</th>
                            <th className="px-5 py-4 font-medium">Size</th>
                          </tr>
                        </thead>
                        <tbody>
                            {documents.map((document)=> {
                                const Icon = document.icon;
                                return (
                                    <tr key={document.name} className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Icon size={22} className={document.color}/>
                                                <span className="font-medium">{document.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                            {document.category}
                                        </td>
                                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                            {document.date}
                                        </td>
                                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                            {document.size}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}