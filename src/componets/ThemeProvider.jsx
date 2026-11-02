import { createContext,useContext,useEffect,useState } from "react";

const ThemeContext = createContext();

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
 export function useTheme(){
    return useContext(ThemeContext);
 }