import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import {ThemeProvider} from "./componets/ThemeProvider";

export default function App(){
  return (
     <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
     </ThemeProvider>
  )
}