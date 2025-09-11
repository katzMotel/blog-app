'use client';
import { onAuthStateChanged, User } from 'firebase/auth';
import {createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseConfig';
 interface AuthContextType {
     user: User | null;
 }
 const AuthContext = createContext<AuthContextType>({ user: null });
 export const AuthProvider = ({children}: {children:ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);
    return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
 }
export function useAuth(){
    return useContext(AuthContext);
}