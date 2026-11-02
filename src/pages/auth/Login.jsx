import { useState } from "react";
import {link} from "react-router-dom";
import {Eye, EyeOff, Sun, Moon} from "lucide-react";
export default function Login(){
 const [showPassword, setShowPassword] = useState(false);
 const {theme, toggleTheme} = useTheme();

 const handleSubmit = (event)=> {
    event.preventDefault();
    alert("Login Form Submitted");

 };
 return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your Docuvault account.">
        <button onClick={toggleTheme} className="mb-6 flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            {theme=== "light" ? <Moon size={16}/> :<Sun size={16}/>}
            Switch to {theme=== "light" ? "Dark" : "light"} mode
        </button>
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="mb-2 block text-sm font-medium ">Email</label>
                <input type="email" required placeholder="newtsofts@example.com" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900"/>
            </div>
            <div>
                <div classNaame="mb-2 flex justify-between">
                    <label className="text-sm font-medium">Password</label>
                    <button type="button" className="text-sm font-indigo-600 hover:underline">Forgot Password?</button>
                </div>
                <div className="relative">
                    <input type={showPassword ? "text" : "password"} required placeholder="Enter your password" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 outline-none dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-900
                    dark:focus:ring-indigo-900"/>
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-500" aria-label={showPassword? "Hide password" :"Show password"}>
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                </div>
            </div>
            <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
                Sign In 
            </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">Don`t have an Account? {" "}
        <link to="/register" className="font-semibold text-indigo-600 hover:underline">Create Account</link></p>
      </AuthLayout>
 );
 
}