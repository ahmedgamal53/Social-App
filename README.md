<div align="center">

# 🌐 Social App



## 📖 About The Project

**Social App** is a full-featured social media web application that allows users to connect, share posts, and interact with each other in real time. Built with React on the frontend and Supabase as a powerful open-source backend — handling auth, database, storage, and real-time subscriptions out of the box.

> 🔗 **Live Demo:** [https://social1app.netlify.app/](https://social1app.netlify.app/)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure Sign Up & Login powered by Supabase Auth |
| 📝 **Posts** | Create and delete posts with rich content |
| ❤️ **Likes & Comments** | React to posts and join conversations |
| 👤 **User Profile** | View and manage your personal profile |
| 🔔 **Notifications** | Get notified about activity on your posts |
| 🖼️ **Image Upload** | Share images directly in your posts |
| 🔍 **Search** | Find users and posts instantly |
| ⚡ **Real-time Updates** | Live feed powered by Supabase Realtime |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React.js** | UI component library |
| **Tailwind CSS** | Utility-first styling & responsive layout |
| **Supabase** | Auth, PostgreSQL database, storage & real-time |
| **Netlify** | Hosting & continuous deployment |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmedgamal53/Social-App.git
   cd Social-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a project on [Supabase](https://supabase.com/)
   - Enable **Authentication** (Email/Password)
   - Set up your **database tables** (posts, comments, likes, notifications, etc.)
   - Enable **Storage** for image uploads
   - Enable **Realtime** for live updates

4. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
Social-App/
├── public/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # App pages (Home, Profile, Login, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── supabase/         # Supabase client & service functions
│   ├── context/          # React Context (Auth, etc.)
│   ├── App.js
│   └── index.js
├── .env
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🗄️ Database Schema (Supabase)

```
users          — id, username, avatar_url, bio, created_at
posts          — id, user_id, content, image_url, created_at
comments       — id, post_id, user_id, content, created_at
likes          — id, post_id, user_id, created_at
notifications  — id, recipient_id, sender_id, type, post_id, read, created_at
```

---


## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---



<div align="center">

Made with ❤️ by [Ahmed Gamal](https://github.com/ahmedgamal53)

⭐ If you found this project helpful, please consider giving it a star!

</div>
