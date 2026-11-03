import {useState} from "react";
import {Link} from "react-router-dom";
import {Eye, EyeOff} from "lucide-react";
import AuthLayout from "../../componets/auth/AuthLayout";

export default function Register(){
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = (event) => {event.preventDefault(); alert("Registration form submitted")};

    return(
        <AuthLayout title="Create an Account" subtitle="Join Docuvault and start managing your documents securely.">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium">Full Name</label>
                    <input type="text" required placeholder="Your Full Name" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"/>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <input type="email" required placeholder="newtsofts@example.com" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"/>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium">Password</label>
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} required placeholder="Create a password" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-500" aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                    </div>
                </div>
                <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
                    Create Account
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link to="/Login" className="font-semibold text-indigo-600 hover:underline">Sign in</Link>
            </p>
        </AuthLayout>
    )
}