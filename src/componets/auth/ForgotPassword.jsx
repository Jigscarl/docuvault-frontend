import {Link} from "react-router-dom";
import {ArrowLeft, Mail} from "lucide-react";
import AuthLayout from "../../componets/auth/AuthLayout";

export default function ForgotPassword(){
    const handleSubmit = (event) => {event.preventDefault();
        const email = event.target.email.value;
        alert(`Password reset instructions will be sent to ${email}`);};

        return(
            <AuthLayout title="Forgot your Password" subtitle="Enter your email address to receive password reset instructions.">

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                    <Mail size={28}/>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Email</label>
                        <input type="email" name="email" required placeholder="newtsofts@gmail.com" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"/>
                    </div>
                    <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
                        Send Reset Instructions
                    </button>
                </form>
                <Link to="/login" className="mt-6 flex-items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:underline">
                    <ArrowLeft size={16}/>Back to Login</Link>

            </AuthLayout>
        )
}