# Minimal Full-Stack Setup: Signup & Login

This is a minimal example of a React frontend and Express backend for demonstration purposes.

## 1️⃣ Backend Setup (Local)
1. Navigate to `server/` folder.
2. Run `npm install` (requires `express` and `cors`).
3. Run `npm start`.
4. Server will listen on PORT 5000.

## 2️⃣ Frontend Setup (Local)
1. Navigate to `client/` folder.
2. Run `npm install`.
3. Update `backendURL` in `src/App.js` to `http://localhost:5000`.
4. Run `npm start`.

---

## 3️⃣ Deployment Instructions

### Backend (Render)
1. Push your `server/` folder to a GitHub repository.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your repository.
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Copy the generated **Backend URL** (e.g., `https://insightly-ai.onrender.com`).

### Frontend (Vercel)
1. In your code (`client/src/App.js`), update `backendURL` to your Render URL.
2. Push your `client/` folder to GitHub.
3. Import the project into [Vercel](https://vercel.com).
4. Vercel will automatically detect the React app and deploy it.
5. Copy your **Vercel Frontend URL** (e.g., `https://your-frontend-name.vercel.app`).

### Final Step: Update CORS
1. Go back to your `server/server.js`.
2. Update the `cors` origin to allow your Vercel URL:
   ```javascript
   app.use(cors({ origin: "https://your-frontend-name.vercel.app" }));
   ```
3. Commit and push the change to GitHub. Render will redeploy automatically.
