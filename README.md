# 🚀 Insightly AI – Real-Time Meeting Recap Platform

Insightly AI is an **AI-powered meeting assistant** that captures live conversations, transcribes them in real time, and automatically generates concise meeting summaries.

The platform enables users to host or join video meetings, record discussions, and receive **AI-generated insights, action items, and key takeaways instantly**.
It is designed to **improve productivity by eliminating manual note-taking and providing structured meeting recaps.**

## 🌐 Live Demo

🔗 https://insightly-ai-rosy.vercel.app/  

<img width="1904" height="882" alt="image" src="https://github.com/user-attachments/assets/3d9c5ad6-ed8a-4582-ba55-0e3c8a5304c6" />


---

# ✨ Features

🎥 **Real-Time Video Meetings** using WebRTC  
🎤 **Live Speech-to-Text Transcription**  
🤖 **AI-Generated Meeting Summaries**  
🧠 **Key Points & Action Item Extraction**  
👥 **Host & Participant Video Support**  
🔐 **Authentication System (Login / Signup)**  
☁️ **Cloud Database Integration with MongoDB Atlas**  
⚡ **Modern Responsive UI with Tailwind CSS**  
📊 **Meeting Data Stored for Future Access**

# 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- Socket.io

### Real-Time Communication
- WebRTC
- WebSockets

### AI & APIs
- Speech-to-Text API
- LLM-based summarization

### Database
- MongoDB Atlas

### Deployment
- Frontend → Vercel  
- Backend → Render

# 🧠 How It Works
1️⃣ Users sign up or log in to the platform.  
2️⃣ A host starts a meeting room.  
3️⃣ Participants join the meeting.  
4️⃣ Audio and video streams are captured.  
5️⃣ Speech is converted into real-time text transcription.  
6️⃣ AI processes the transcript and generates a structured summary.  
7️⃣ Meeting transcripts and summaries are stored in the database.

# ⚙️ Installation & Setup

## Clone the repository

git clone https://github.com/krishnasonii/Insightly-AI.git

## Install dependencies

## Frontend
cd client
npm install

## Backend
cd server
npm install

## Setup Environment Variables
Create a .env file in the backend folder.
Example:
PORT=5001

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

GROQ_API_KEY=your_key

DEEPGRAM_API_KEY=key

## Run the project
Backend
npm run dev

Frontend
npm start

🚀 Future Improvements

📌 Meeting recording playback

📌 AI-generated meeting insights dashboard

📌 Calendar integration (Google / Outlook)

📌 Multi-language speech transcription

📌 AI-powered task management

## 👨‍💻 Author
Krishna Soni
GitHub
https://github.com/krishnasonii

⭐ Support
If you like this project, please give it a star ⭐ on GitHub.
It helps others discover the project!


