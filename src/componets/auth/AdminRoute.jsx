import {Navigate, Outlet} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute(){
    const {profile, loading, isAuthenticated} = useAuth();
    if (loading){
        return (
            <div className="flex min-h[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"/>
            </div>
        );
    }

    if (!isAuthenticated){
        return <Navigate to="/login" replace/>
    }

    if (!profile){
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-center">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile unavailable</h2>
                    <p className="mt-2 text-sm text-sm text-slate-500">Unable to load your account profile</p>
                </div>
            </div>
        );
    }

    if(!profile.isActive){
        return <Navigate to="/login" replace/>
    }
    if (profile.role !== "Admin"){
        return <Navigate to="/dashboard" replace/>
    }
    return <Outlet/>
}