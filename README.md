<div align="center">

# 🌐 Social App

### A modern, real-time social media platform built for connection

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-State-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)

[🔗 Live Demo](https://social-1app.pages.dev/) 

</div>

---

## 📖 About The Project

**Social App** is a full-featured social media web application that lets users connect, share posts, and interact with one another in real time. It's built with **React** on the frontend and **Supabase** as an all-in-one backend — handling authentication, database, storage, and real-time subscriptions out of the box.

The project was built to demonstrate a complete, production-style social platform: from secure auth flows and relational data modeling to live feeds and image handling — all without a custom backend server.

<div align="center">

*(💡 Add a screenshot or GIF of your app here — it's the single highest-impact addition you can make to this README)*

</div>

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Secure sign-up & login powered by Supabase Auth |
| 📝 **Posts** | Create and delete posts with rich content |
| ❤️ **Likes & Comments** | React to posts and join the conversation |
| 👤 **User Profiles** | View and manage your personal profile |
| 🔔 **Notifications** | Stay updated on activity related to your posts |
| 🖼️ **Image Uploads** | Share images directly within your posts |
| 🔍 **Search** | Instantly find users and posts |
| ⚡ **Real-Time Updates** | Live feed powered by Supabase Realtime |

---

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| **React.js** | Component-based UI library |
| **Tailwind CSS** | Utility-first styling & responsive layout |
| **Supabase** | Auth, PostgreSQL database, storage & real-time engine |
| **Netlify** | Hosting & continuous deployment |

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `v18+`
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/ahmedgamal53/Social-App.git
cd Social-App
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up Supabase**
- Create a new project on [Supabase](https://supabase.com/)
- Enable **Authentication** → Email/Password provider
- Create the required **database tables** (`users`, `posts`, `comments`, `likes`, `notifications`)
- Enable **Storage** for image uploads
- Enable **Realtime** on the relevant tables for live updates

**4. Configure environment variables**

Create a `.env` file in the project root:
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**5. Run the development server**
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

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

## 🗄️ Database Schema

```
users           id, username, avatar_url, bio, created_at
posts           id, user_id, content, image_url, created_at
comments        id, post_id, user_id, content, created_at
likes           id, post_id, user_id, created_at
notifications   id, recipient_id, sender_id, type, post_id, read, created_at
```

---

## 🗺️ Roadmap

- [ ] Direct messaging between users
- [ ] Post sharing / reposts
- [ ] Infinite scroll & pagination

*(Optional section — great for showing the project is actively maintained)*

---

## 🤝 Contributing

Contributions make the open-source community amazing — any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---



<div align="center">

**Made with ❤️ by [Ahmed Gamal](https://github.com/ahmedgamal53)**

⭐ If you found this project helpful, please consider giving it a star!

</div>
