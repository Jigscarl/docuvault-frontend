import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({children}){
    const [theme, setTheme] = useState(()=>{return localStorage.getItem("docuvault-theme") || "light"});

    useEffect(()=>{
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("docuvault-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) => (current === "light" ? "dark" : "light"));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}