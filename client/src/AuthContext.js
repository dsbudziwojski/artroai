import {createContext, useContext, useEffect, useState} from 'react';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from 'firebase/auth'
import {auth, provider} from './firebase'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

   useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user?.email.split('@')[0]);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    function signInGoogle() {
        const gProvider = new GoogleAuthProvider()
        return signInWithPopup(auth, gProvider)
    }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    const value = {
        user,
        signInGoogle,
        signUp,
        login,
        logout,
    };

    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}




