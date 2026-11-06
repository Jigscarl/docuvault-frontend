import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./componets/auth/ForgotPassword";
import {ThemeProvider} from "./componets/ThemeProvider";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/dashboard/Documents";
import UploadDocument from "./pages/dashboard/UploadDocument";

export default function App(){
  return (
     <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route element ={<DashboardLayout/>}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/documents" element={<Documents/>}/>
            <Route path="upload" element={<UploadDocument/>}/>
          </Route>
          <Route path="/dashbord" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
     </ThemeProvider>
  );
}