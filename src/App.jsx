
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./componets/auth/ForgotPassword";

import { ThemeProvider } from "./componets/ThemeProvider";
import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/dashboard/Documents";
import UploadDocument from "./pages/dashboard/UploadDocument";
import Folders from "./pages/dashboard/Folders";
import Favorities from "./pages/dashboard/Favorites";
import Trash from "./pages/dashboard/Trash";
import Settings from "./pages/dashboard/Settings";
import FolderDetails from "./pages/dashboard/FolderDetails";
import Activity from "./pages/dashboard/Activity";

import UsersManagement from "./pages/admin/UsersManagement";
import AdminRoute from "./componets/auth/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>

                    {/* Default Route */}
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    {/* Dashboard Layout */}
                    <Route element={<DashboardLayout />}>

                        {/* Normal Dashboard Routes */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="upload" element={<UploadDocument />} />
                        <Route path="/folders" element={<Folders />} />
                        <Route path="/favorites" element={<Favorities />} />
                        <Route path="/trash" element={<Trash />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/folders/:id" element={<FolderDetails />} />
                        <Route path="/activity" element={<Activity />} />

                        {/* Admin Protected Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin/users" element={<UsersManagement />}/>
                            <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
                        </Route>

                    </Route>

                    {/* Legacy URL Redirect */}
                    <Route
                        path="/dashbord"
                        element={<Navigate to="/dashboard" replace />}
                    />

                    {/* Unknown Routes */}
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
