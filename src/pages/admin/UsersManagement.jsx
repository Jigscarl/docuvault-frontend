import { useEffect, useState } from "react";
import {Users, Search,ShieldCheck,Shield,UserCheck,UserX,Loader2, RefreshCcw} from "lucide-react";
import userApi from "../../api/userApi";

export default function UsersManagement(){

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() =>{
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try  {
            setLoading(true);
            setError("");
            const data = await userApi.getAll();
            setUsers(data);

        } catch (err){
            console.error("Failed to fetch users:", err);
            setError(err.response?.data?.message || "Unable to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userApi.updateRole(userId, newRole);
            setUsers((prev) => prev.map((user) => user.id === userId ? {...user, role: newRole} : user ));
        } catch (err){
            alert(err.response?.data?.message || "Failed to update user role.");
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await userApi.updateStatus(userId, newStatus);
            setUsers((prev) => prev.map((user) => user.id === userId ? {...user, isActive: newStatus} : user));
        } catch(err){
            alert(err.response?.data?.message || "Failed to update user status.");
        }
    }

    const filteredUsers = users.filter((user) => `${user.fullName || ""} ${user.role}`.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage registered users and their account information</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-3 dark:bg-indigo-950">
                    <Users className="text-indigo-600" size={20}/>
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{users.length} Total Users</span>
                </div>
            </div>
            <div className="relative max-w-md">
                <Search size={18} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"/>
            </div>
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="animate-spin text-indigo-600" size={28}/>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                    {error}
                    <button onClick={fetchUsers} className="ml-2 font-semibold underline">
                        Retry
                    </button>
                </div>
            )}
            {!loading && !error && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                <tr>
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Documents</th>
                                    <th className="px-5 py-4">Storage</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{user.fullName || "Unnamed user"}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                {user.role === "Admin" ? ( <ShieldCheck size={13}/>) : (<Shield size={13}/>)}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${user.isActive ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
                                                {user.isActive ? (<UserCheck size={13}/>) : (<UserX size={13}/>)}
                                                {user.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                            {(user.storageUsedBytes / (1024 * 1024)).toFixed(2)} MB
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={()=> handleRoleChange(user.id, user.role === "Admin" ? "User" : "Admin")} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                                                    {user.role === "Admin" ? "Demote" : "Promote"}
                                                </button>
                                                <button onClick={()=> handleStatusChange(user.id, !user.isActive)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${user.isActive ? "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950" : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950"}`}>
                                                    {user.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-12 text-center text-gray-500">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}