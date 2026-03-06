import React, { useState } from "react";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Replace with your actual backend URL after deployment (e.g., https://insightly-ai.onrender.com)
    const backendURL = "http://localhost:5000";

    const signup = async () => {
        try {
            const res = await fetch(`${backendURL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            console.error("Signup error:", err);
            alert("Signup failed! Check console.");
        }
    };

    const login = async () => {
        try {
            const res = await fetch(`${backendURL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            console.error("Login error:", err);
            alert("Login failed! Check console.");
        }
    };

    return (
        <div style={{
            textAlign: "center",
            marginTop: "100px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f0f2f5",
            padding: "40px",
            borderRadius: "12px",
            maxWidth: "400px",
            margin: "100px auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
            <h1 style={{ color: "#1a1a1a" }}>Insightly AI</h1>
            <p style={{ color: "#666" }}>Minimal Signup / Login Example</p>

            <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ padding: "12px", width: "80%", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ padding: "12px", width: "80%", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ddd" }}
            />
            <br />
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button
                    onClick={signup}
                    style={{ padding: "12px 24px", cursor: "pointer", backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold" }}
                >
                    Signup
                </button>
                <button
                    onClick={login}
                    style={{ padding: "12px 24px", cursor: "pointer", backgroundColor: "#1a1a1a", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold" }}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default App;
