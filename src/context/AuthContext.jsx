import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import profileApi from "../api/profileApi";

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const profileRequestId = useRef(0);

    const loadProfile = async () => {
        const requestId = ++profileRequestId.current;
        try{
            const data = await profileApi.getMyProfile();
            if (requestId === profileRequestId.current) setProfile(data);
        } catch (error){
            if (requestId === profileRequestId.current) {
                console.error("Profile retrieval failed:", error);
                setProfile(null);
            }
        }
    };

    const syncProfile = async (fullName) => {
        const requestId = ++profileRequestId.current;
        const data = await profileApi.syncMyProfile(fullName);
        if (requestId === profileRequestId.current) setProfile(data);
        return data;
    };

    useEffect(() => {
        let mounted = true;

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (!mounted) return;
            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (currentSession){
                loadProfile();
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        supabase.auth.getSession().then(({data, error}) => {
            if(!mounted) return;

            if (error){
                console.error("Session retrieval failed:" , error.message);
            }

            setSession(data.session);
            setUser(data.session?.user ?? null);

            if(data.session){loadProfile()} else {setProfile(null)}
            setLoading(false);
        });

        return () => {mounted = false; subscription.unsubscribe();};
    }, []);

    const signOut = async () => {
        const {error} = await supabase.auth.signOut();

        if (error) {throw error;}
        profileRequestId.current += 1;
        setUser(null);
        setProfile(null);
        setSession(null);
    };

    const value = {
        user,
        profile,
        session,
        loading,
        isAuthenticated: Boolean(session),
        syncProfile,
        signOut,

    };
    return (
        <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
}