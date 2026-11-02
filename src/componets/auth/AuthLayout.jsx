import { ShieldCheck } from "lucide-react"
export default function AuthLayout({children, title, subtitle}){
    return(
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
         <div className="grid min-h-screen lg:grid-cols-2">{/*Branding Section*/}</div>
         <div className="hidden flex-col justify-between bg-indigo-700 p-12 text-white lg:flex">
          <div className= "flex items-center gap-3">
          <ShieldCheck size ={32}/>
          <span className="text-2xl font-bold">DocuVault</span>
          </div>
            <div >
            <h1 className= "max-w-lg text-5xl fond-bold leading-tight">Your Documents Secure, Organized, accessible </h1>
            <p className="mt-6 max-w-md text-indigo-100">A Smarter way to Manage, store and access your important documents</p>

            </div>
            <p className="text-sm text-indigo-200"> @ 2026 DocuVault(newtsofts). All rights reserved.</p>
         </div>
         {/*form section*/}
            <div className="flex items-center justify-center p-6 sm:p12">
              <div className="w-full max-w-md">
                <div className="mb-8 lg:hidden">
                    <div className="flex items-center gap-2 text-indigo-600">
                       <ShieldCheck size={30}/>
                       <span classname="text-2xl font-bold">DocuVault</span>
                    </div>
                </div>
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
                <div className="mt-8">{children}</div>
              </div>
            </div>

        </div>
    );
}