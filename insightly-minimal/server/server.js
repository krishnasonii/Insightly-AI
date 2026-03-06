const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

// CORS enabled for frontend URL: https://your-frontend-name.vercel.app
// For local testing, you might want to include http://localhost:3000
app.use(cors({ origin: ["https://your-frontend-name.vercel.app", "http://localhost:3000", "http://localhost:5173"] }));

app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    console.log(`Signup call: ${username}`);
    res.json({ message: "Signup success!" });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`Login call: ${username}`);
    res.json({ message: "Login success!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
