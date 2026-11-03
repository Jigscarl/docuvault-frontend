import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./componets/auth/ForgotPassword";
import {ThemeProvider} from "./componets/ThemeProvider";

export default function App(){
  return (
     <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace/>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="*" element={<Navigate to="/Login" replace />} />
        </Routes>
      </BrowserRouter>
     </ThemeProvider>
  );
}