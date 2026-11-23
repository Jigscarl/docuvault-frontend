import {useMemo} from "react";
import {Folder, FileText, FileSpreadsheet, FileImage, File,} from "lucide-react";
import { object } from "zod";

const getCategoryIcon = (category) => {
    const name = category.toLowerCase();

    if(name.includes("finance")) return FileSpreadsheet;
    if(name.includes(image) || name.includes("photos")) return FileImage;
    if(name.includes("project")) return FileText;
    if(name.includes("personal")) return Folder;

    return File;
};

export default function CategoryBreakdown ({documents = []}){
    const categories = useMemo(() => {
        const counts = {};
        documents.forEach((document) => {
            const category = document.category || "Uncategorized";
            counts[category] = (counts[category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count]) => ({
            name, count,percentage: documents.length > 0 ? Math.round((count/documents.length) * 100) : 0, icon:getCategoryIcon(name),
        })).sort((a, b) => b.count - a.count);

    }, [documents]);

    const colors = [
        {
            bar: "bg-indigo-500",
            text: "text-indigo-500",
            bg: "bg-indigo-500/10,"
        },
        {
            bar: "bg-emerald-500",
            text: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            bar: "bg-amber-500",
            text: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            bar: "bg-purple-500",
            text: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            bar: "bg-blue-500",
            text: " text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            bar: "bg-rose-500",
            text: "text-rose-500",
            bg: "bg-rose-500/10",
        },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5">
                <h2 className="font-semibold text-gray-900 dark:text-white">Documents by Category</h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Distribution of your documents</p>
            </div>
            {categories.length === 0 (
                <div className="py-8 text-center">
                    <Folder size={28} className="mx-auto text-gray-400"/>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No Category data available yet.
                    </p>
                </div>
            ) : (
               <div className="space-y-5">
                {categories.map((category, index) => {
                    const Icon = category.icon;
                    const color = colors[index % colors.length];

                    return (
                        <div key={category.name}>
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`rounded-lg p-2 ${color.bg} ${color.text}`}>
                                        <Icon size={16}/>
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium dark:text-gray-300">{category.name}</span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{category.count} ({category.percentage} %)</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                <div className={`h-full rounded-full transition-all duration-500 ${color.bar}`} style={{width: `${category.percentage} %`}}/>
                            </div>
                        </div>
                    )
                })}
               </div>
            )}
        </div>
    )
}