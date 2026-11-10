import { useState } from "react";
import { User, Bell, Shield, Palette, HardDrive, Save } from "lucide-react";
import { useTheme } from "../../componets/useTheme";

export default function Settings(){
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({
    name: "Newton",
    email: "newton@example.com",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    uploads: true,
    sharing: false,
  });

  function updateProfile(e){
    e.preventDefault();
    alert("Profile settings saved locally, Backend integration is comming soon.");
  }

  function updateNotification(key){
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account and application preferences</p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-5 flex items-center gap-3">
                <User className="text-indigo-600" size={22}/>
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                    <p className="text-sm text-gray-500">
                        Update your personal details
                    </p>
                </div>
            </div>

            <form onSubmit={updateProfile} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
                    <input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} required className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none dark:bg-gray-900 dark:text-white"/>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} required className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"/>
                </div>
                <button type="submit" className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                    <Save size={16}/>
                    Save Profile
                </button>
            </form>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
                <Palette className="text-indigo-600" size={22}/>
            <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Appearance</h2>
            <p className="text-sm text-gray-500">
                customize how Docuvault looks
            </p>
            </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dark mode</p>
                    <p className="text-sm text-gray-500">
                        Switch between light and dark themes
                    </p>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  role="switch"
                  aria-checked={theme === "dark"}
                  className={`relative h-6 w-11 rounded-full transition ${theme === "dark" ? "bg-indigo-600" : "bg-gray-300"}`}
                >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${theme === "dark" ? "left-5" : "left-0.5"}`} />
                </button>
            </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-5 flex items-center gap-3">
                <Bell className="text-indigo-600" size={22}/>
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Notifications</h2>
                    <p className="text-sm text-gray-500">
                        Choose which notifications you receive
                    </p>
                </div>
            </div>
            {[
                ["email", "Email notifications"],
                ["uploads", "Document upload notifications"],
                ["sharing", "Document sharing notifications"],
            ].map(([key, label]) =>(
                <div key={key} className="flex items-center justify-between border-t border-gray-100 py-4 dark:border-gray-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    <input type="checkbox" checked={notifications[key]} onChange={() =>updateNotification(key)} className="h-4 w-4 accent-indigo-600"/>
                </div>
                
            ))
            }
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
                <Shield className="text-indigo-600" size={22}/>
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Security</h2>
                    <p className="text-sm text-gray-500">Password and account security will be enabled when authentication is connected</p>
                </div>
            </div>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
                <HardDrive className="text-indigo-600" size={22}/>
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Storage</h2>
                    <p className="text-sm text-gray-500">
                        Your current storage usage.
                    </p>
                </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>8.4 GB Used</span>
                <span>50 GB Total</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div className="h-full w-[16.8%] rounded-full bg-indigo-600"/>
            </div>
            <p className="mt-2 text-xs text-gray-500">Storage values are sample data and will be updated from the backend</p>
        </section>
    </div>
  );
}