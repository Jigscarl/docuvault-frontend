import {useState} from "react";
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import {Eye, EyeOff} from "lucide-react";
import AuthLayout from "../../componets/auth/AuthLayout";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const registerSchema = z.object({
    fullName: z.string().trim().min(2, "Full Name must contain at least 2 characters"),
    email:z.string().trim().email("Please enter a valid email address"),
    password:z.string().min(8,"Password must contain at least 8 characters").regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter").regex(/[0-9]/, "Password must contain a number"),
});

export default function Register(){
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,handleSubmit,formState: {errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const onSubmit = async (data) => {
        console.log("Registration data:", data);
        alert("Registration Successfull!")
    }

    return(
        <AuthLayout title="Create an Account" subtitle="Join Docuvault and start managing your documents securely.">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium">Full Name</label>
                    <input type="text" placeholder="Your Full Name"{...register("fullName")} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "register-name-error" : undefined} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"/>
                    {errors.fullName && (<p id="register-name-error" className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>)}
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <input type="email" placeholder="newtsofts@example.com" {...register("email")} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"/>
                    {errors.email && (<p id="register-email-error" className="mt-1 text-sm text-red-500">{errors.email.message}</p>)}
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium">Password</label>
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="Create a password" {...register("password")} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "register-password-error" : undefined} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-500" aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                    </div>
                    {errors.password && (<p id="register-password-error" className="mt-1 text-sm text-red-500">{errors.password.message}</p>)}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
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