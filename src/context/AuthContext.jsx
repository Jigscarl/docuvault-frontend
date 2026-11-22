import { createContext, useContext, useEffect, useState } from "react";
import {supabase} from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [user, setUser] =useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        let mounted = true;

        const{
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (!mounted) return;
            setSession(currentSession);
            setUser(currentSession?.user?? null);
            setLoading(false);
        });
        supabase.auth.getSession().then(({data, error }) => {
            if(!mounted) return;
            if(error){
                console.error("Session retrival failed:", error.message);
            }
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    },[]);

    const signOut = async () =>{
        const {error } = await supabase.auth.signOut();

        if(error){
            throw error;
        }

        setUser(null);
        setSession(null);
    };

    const value = {
        user,
        session,
        loading,
        isAuthenticated: Boolean(session),
        signOut,
    };

    return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}

export function useAuth(){
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
}