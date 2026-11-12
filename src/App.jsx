import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./componets/auth/ForgotPassword";
import {ThemeProvider} from "./componets/ThemeProvider";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/dashboard/Documents";
import UploadDocument from "./pages/dashboard/UploadDocument";
import Folders from "./pages/dashboard/Folders";
import Favorities from "./pages/dashboard/Favorites";
import Trash from "./pages/dashboard/Trash";
import Settings from "./pages/dashboard/Settings";
import { DocumentProvider } from "./context/DocumentContext";

export default function App(){
  return (
     <ThemeProvider>
      <DocumentProvider>
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
            <Route path="/folders" element={<Folders/>}/>
            <Route path="/favorites" element={<Favorities/>}/>
            <Route path="/trash" element={<Trash/>}/>
            <Route path="/settings" element={<Settings/>}/>
          </Route>
          <Route path="/dashbord" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      </DocumentProvider>
     </ThemeProvider>
     
  );
}