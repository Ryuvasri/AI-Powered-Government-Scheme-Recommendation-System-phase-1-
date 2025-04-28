import React, { useState } from "react";
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from "../firebase";
import "./Auth.css";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                uid: user.uid,
            });

            alert("User registered successfully!");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Signup</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Signup;
