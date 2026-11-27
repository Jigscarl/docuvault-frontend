import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

export default function AdminActivityChart({ activities = []}){
    const chartData = activities.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", {month: "short", day: "numeric"}),
        uploads: item.uploads
    }));
    
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Document upload Activity</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">System-wide document uploads over time</p>
            </div>
            {chartData.length === 0 ? (
                <div className="flex h-72 items-center justify-center text-sm text-slate-500">
                    No activity data available.
                </div>
            ) : (
                <ResponsiveContainer width = "100%" height={300}>
                    <LineChart data={chartData} margin={{top:10, right:20, left:0, bottom:5}}>
                        <CartesianGrid strokeDasharray= "3 3" vertical={false} stroke="#94a3b8" opacity={0.2}/>
                        <XAxis dataKey="date" tick = {{fontSize: 12}} stroke="#94a3b8"/>
                        <YAxis allowDecimals = {false} tick={{fontSize: 12}} stroke="#94a3b8"/>

                        <Tooltip/>

                        <Line type="monotone" dataKey="uploads" name="Uploads" stroke="#6366f1" strokeWidth={3} dot={{r : 4}} activeDot={{r : 7}}/>
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}