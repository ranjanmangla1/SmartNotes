import React, { useContext, useEffect, useState } from "react"
import {auth} from "../firebase"
import { signOut, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateEmail, updatePassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, updateProfile } from 'firebase/auth';

const AuthContext = React.createContext()

export function useAuth() {
    return React.useContext(AuthContext)
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email,  password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    function logOut() {
        return signOut(auth);
    }

    function UpdateEmail(email) {
        return updateEmail(currentUser, email)
    }
    
    function UpdatePassword(password) {
        return updatePassword(currentUser, password)
    }

    function UpdateProfileImage(url) {
        return updateProfile(currentUser, {
            photoURL: url
        }).then(
            () => {console.log(url)}
        ).catch(
            (error) => {
                console.error(error)
                console.log(url)
            }
        )
    }

    function googleSignIn() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
    }

    function githubSignIn() {
        const provider = new GithubAuthProvider();
        return signInWithPopup(auth, provider)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])   

    const value = {
        currentUser,
        signup,
        logOut,
        resetPassword,
        login,
        UpdateEmail,
        UpdatePassword,
        googleSignIn,
        githubSignIn,
        UpdateProfileImage
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

