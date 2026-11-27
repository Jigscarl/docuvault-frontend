import {useMemo} from "react";
import {Folder, FileText,FileSpreadsheet, FileImage, File} from "lucide-react";
const getCategoryIcon = (category) => {
    const name = category.toLowerCase();
    if(name.includes("finance")) return FileSpreadsheet;
    if(name.includes("image") || name.includes("photos")) return FileImage;
    if (name.includes("project")) return FileText;
    if(name.includes("personal")) return Folder;
    return File;
};

export default function CategoryBreakdown({categories = []}){
    const categoryData = useMemo(() => {
        const totalDocuments = categories.reduce((total, category) => total + category.count, 0);
        return categories.map((category) => ({
            name: category.category || "Uncategorized",
            count: category.count,
            percentage: totalDocuments > 0 ? Math.round((category.count/ totalDocuments) * 100) : 0, 
            icon: getCategoryIcon(category.category || "Uncategorized")
        })).sort((a,b) => b.count - a.count);
    }, [categories]);

    const colors = [
        {
            bar: "bg-indigo-500",
            text: "text-indigo-500",
            bg: "bg-indigo-500/10",
        },
        {
            bar: "bg-emerald-500",
            text: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
             bar: "bg-amber-500",
            text: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
             bar: "bg-purple-500",
            text: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
             bar: "bg-blue-500",
            text: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
             bar: "bg-rose-500",
            text: "text-rose-500",
            bg: "bg-rose-500/10"
        }
    ];

    return (
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5">
                <h2 className="font-semibold text-gray-900 dark:text-white">Documents by Category</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Distribution of your documents</p>

            </div>
            {categoryData.length === 0 ? (
                <div className="py-8 text-center">
                    <Folder size={28} className="mx-auto text-gray-400"/>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No category data available yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {categoryData.map((category, index) => {
                        const Icon = category.icon;
                        const color = colors[index % colors.length];
                        return (
                            <div key={category.name}>
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <div className="flex min-w-0 flex-1 items-center gap-2">
                                        <div className={`shrink-0 rounded-lg p-2 ${color.bg} ${color.text}`}>
                                            <Icon size={16}/>
                                        </div>
                                        <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                                    </div>
                                    <span className="shrink-0 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{category.count}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                    <div className={`h-full rounded-full transition-all duration-500 ${color.bar}`} style={{width: `${category.percentage}%`}}/>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}