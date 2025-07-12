'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type User = {
    uid: string;
    name: string;
    email: string;
    image?: string;
};

type AuthContextType = {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    logout: () => void;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function FirebaseWarning() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-destructive text-destructive-foreground p-4 shadow-lg">
            <div className='container mx-auto'>
                <Alert variant="destructive" className="border-0 bg-transparent text-destructive-foreground">
                    <AlertTitle className="font-bold">Action Required: Firebase Not Configured</AlertTitle>
                    <AlertDescription>
                        Authentication and data features are disabled. Please add your Firebase credentials to the <code>.env.local</code> file and restart the development server.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!isFirebaseConfigured || !auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    
    const logout = async () => {
        if (!isFirebaseConfigured || !auth) return;
        await signOut(auth);
        router.push('/login');
    };
    
    const user: User | null = useMemo(() => {
        if (!firebaseUser) return null;

        return {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous',
            email: firebaseUser.email || '',
            image: firebaseUser.photoURL || `https://placehold.co/128x128.png`
        };
    }, [firebaseUser]);

    const isAuthenticated = !!firebaseUser && isFirebaseConfigured;

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, logout, isAuthenticated }}>
            {!isFirebaseConfigured && <FirebaseWarning />}
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
