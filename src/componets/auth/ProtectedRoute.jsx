import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectionRoute(){
    const {isAuthenticated, loading} = useAuth();
    const location = useLocation();

    if(loading){
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={36} className="animate<spin text-indigo-900"/>
                    <p className="text-sm text-gray-500">Verifying your session...</p>

                </div>
            </div>
        );
    }

    if(!isAuthenticated){
        return (
            <Navigate to="/login" replace state={{from: location}}/>
        );
    }

    return <Outlet/>
}