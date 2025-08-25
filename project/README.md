# 🚀 Web Journey Project: **CollabNote**

> **Build a real-time collaborative note management app through progressive challenges and workshop sessions**

Welcome to **CollabNote** - your journey to building a complete full-stack web application! This is where theory meets practice as you create a real-time, collaborative note management platform that teams can use to create, share, and collaborate on notes together.

---

## 🎯 Project Overview: CollabNote

**CollabNote** is a full-stack web application that allows users to:

* ✍️ **Create personal or shared notes** with rich-text editing
* 🤝 **Collaborate with others in real-time** on shared documents
* 💬 **Comment and discuss** directly on notes
* 🏷️ **Organize with tags** and powerful filtering options
* 📁 **Upload images** and manage file attachments
* 🔄 **Experience live updates** as collaborators make changes

### 🌟 Why CollabNote?

This project follows a **session-driven development approach** where:

- 📚 **Workshop sessions** introduce new concepts and technologies
- 🎯 **Challenges** help you apply those concepts to build CollabNote features
- 🔄 **Progressive building** - each feature builds upon previous work
- 🤝 **Community learning** - share solutions and learn from others

By the end of this journey, you'll have built a **production-ready collaborative platform** that you can proudly showcase!

### 🏗️ Project Structure

```
web-journey/
├── frontend/               # Frontend challenges & sessions (repo root)
│   ├── challenges/         # Frontend feature challenges (added after sessions)
│   └── sessions/          # Frontend workshop materials
├── backend/                # Backend challenges & sessions (repo root)
│   ├── challenges/         # Backend feature challenges (added after sessions)  
│   └── sessions/          # Backend workshop materials
└── project/               # Your CollabNote implementation
    ├── frontend/          # React app for CollabNote UI
    │   └── src/
    ├── backend/           # Express.js API for CollabNote
    │   └── src/
    ├── docker-compose.yml # Full-stack setup with one command
    └── README.md          # This file
```

---

## 🚀 Quick Start - Run the Complete Project

### 🐳 **One-Command Setup with Docker**

The easiest way to run CollabNote with all services (PostgreSQL, Backend API, Frontend UI):

```bash
# Fork the repository to try challenges (if you haven't already)
cd web-journey/project

# Start the complete application
docker compose up --build -d
```

**That's it! 🎉** Your application will be available at:

- **Frontend (React)**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database**: PostgreSQL running on port 5434

### 📋 What Docker Setup Provides

The `docker-compose.yml` handles:

- ✅ **PostgreSQL Database** - Automatically configured with CollabNote schema
- ✅ **Backend API** - Express.js server with hot reload for development
- ✅ **Frontend App** - React application with Vite dev server
- ✅ **Service Dependencies** - Ensures database is ready before starting API
- ✅ **Volume Mounting** - Your code changes are reflected immediately

### 🛠️ Alternative Manual Setup

If you prefer to run services individually:

#### Backend Setup:
```bash
cd project/backend
npm install
cp .env.example .env
# Update .env with your database credentials
npx prisma generate
npx prisma db push
npm run dev
```

#### Frontend Setup:
```bash
cd project/frontend
npm install
npm run dev
```

---

## 🎨 Frontend Development

### 📚 Learning Path
1. **Attend workshop sessions** covering React and modern frontend technologies
2. **Complete corresponding challenges** to build CollabNote's user interface
3. **Implement features progressively** in your `project/frontend/src/` directory

### 🎯 Challenge Workflow
- After each frontend session, new challenges will be added to `../frontend/challenges/`
- Each challenge focuses on implementing specific CollabNote features using session concepts
- Build your solution in the `project/frontend/src/` directory
- Submit your solution following the [Contributing Guide](../CONTRIBUTING.md)

**📖 [View Frontend Challenges →](../CHALLENGES.md#🎨-frontend-challenges)**

---

## ⚡ Backend Development

### 📚 Learning Path
1. **Attend workshop sessions** covering Express.js and backend technologies  
2. **Complete corresponding challenges** to build CollabNote's API features
3. **Implement features progressively** in your `project/backend/src/` directory

### 🎯 Challenge Workflow
- After each backend session, new challenges will be added to `../backend/challenges/`
- Each challenge focuses on building API endpoints and server functionality for CollabNote
- Build your solution in the `project/backend/src/` directory
- Submit your solution following the [Contributing Guide](../CONTRIBUTING.md)

**📖 [View Backend Challenges →](../CHALLENGES.md#⚡-backend-challenges)**

---

## 🚀 Getting Started

### 🛠️ Prerequisites
- Basic understanding of web development concepts
- **Docker & Docker Compose** installed (recommended)
- **OR** Node.js and npm + PostgreSQL (for manual setup)
- Git and GitHub account
- Code editor of your choice

### 📋 Quick Start Guide

1. **🚀 Run the Project**
   ```bash
   cd project
   docker compose up --build -d
   ```
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

2. **📚 Start with Sessions**
   - Choose your track (Frontend/Backend or both)
   - Begin with Session 01 for your chosen track
   - **[View Available Sessions →](../SESSIONS.md)**

3. **🎯 Complete Challenges**
   - After each session, check for new challenges in `../frontend/challenges/` or `../backend/challenges/`
   - Implement CollabNote features in your local project directory (`project/frontend/` or `project/backend/`)
   - **[Browse Current Challenges →](../CHALLENGES.md)**

4. **🤝 Share Your Solutions**
   - Follow the step-by-step contributing guide
   - Submit your implementations via Pull Requests
   - **[Learn How to Contribute →](../CONTRIBUTING.md)**

5. **🔄 Build Progressively**
   - Each new challenge builds on previous work
   - Your CollabNote app grows more sophisticated over time
   - Learn by doing, not just watching

---

## 📁 CollabNote Features

### 🧑‍🤝‍🧑 **User Management**
- **User Registration & Authentication** - Secure login system with JWT
- **Profile Management** - Manage personal information and collaborator connections
- **Secure Sessions** - Protected routes and user state management

### 📝 **Note Management**
- **Rich-Text Notes** - Create and edit notes with formatting options
- **Personal & Shared Notes** - Private notes or collaborative documents
- **Tagging System** - Organize notes with custom tags
- **Search & Filter** - Find notes quickly with powerful filtering
- **File Attachments** - Upload and embed images in notes
- **Export Options** - Download notes in various formats

### 🤝 **Real-Time Collaboration**
- **Live Editing** - See changes as collaborators make them
- **Comment System** - Discuss and provide feedback on notes
- **Typing Indicators** - Know when others are actively editing
- **Live Notifications** - Get notified of new comments and changes
- **Collaboration Permissions** - Control who can view, edit, or comment

### 🎨 **User Experience**
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Intuitive Interface** - Clean, modern UI built with React
- **Real-Time Updates** - Instant synchronization across all devices
- **Smooth Transitions** - Polished animations and interactions

---

## 🎓 Learning Outcomes

By building CollabNote, you'll gain hands-on experience with:

### 🎨 Frontend Skills
- **React Development** - Components, hooks, state management, and Context API
- **Real-Time UI** - Handling live updates and optimistic UI patterns
- **Form Handling** - Complex forms with validation and file uploads
- **API Integration** - Consuming REST APIs and handling async operations
- **Modern JavaScript** - ES6+, async/await, and frontend architecture
- **Responsive Design** - Building interfaces that work on all devices

### ⚡ Backend Skills
- **Express.js API Development** - RESTful API design and implementation
- **Database Design** - Relational database modeling and queries
- **Authentication Systems** - JWT tokens, secure sessions, and authorization
- **File Upload Handling** - Managing file uploads and storage
- **Real-Time Features** - WebSocket connections and live data sync
- **Security Best Practices** - Data validation, sanitization, and protection

### 🔧 Full-Stack Integration
- **Frontend-Backend Communication** - Connecting React to Express APIs
- **Real-Time Synchronization** - Building collaborative features
- **State Management** - Managing complex application state
- **Error Handling** - Graceful error handling across the stack
- **Performance Optimization** - Efficient data loading and caching strategies
- **Deployment Strategies** - Preparing applications for production

---

## 🆘 Need Help?

### 📖 Resources
- **[Workshop Sessions](../SESSIONS.md)** - Learn concepts and techniques
- **[Coding Challenges](../CHALLENGES.md)** - Apply your knowledge
- **[Contributing Guide](../CONTRIBUTING.md)** - Submit your solutions

### 🐳 Docker Troubleshooting

**Common Docker Issues:**

- **Port conflicts**: Change ports in `docker-compose.yml` if 5173 or 5000 are in use
- **Database connection**: Run `docker compose logs postgres` to check database startup
- **Service not starting**: Run `docker compose logs [service-name]` to see error details
- **Reset everything**: Run `docker compose down -v` then `docker compose up --build -d`

**Useful Docker Commands:**
```bash
# Check running services
docker compose ps

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild and restart
docker compose up --build -d

# Remove all data (reset database)
docker compose down -v
```

### 🤝 Community Support
- 💬 **[Discussions](https://github.com/Adel2411/web-journey/discussions)** - Ask questions and share ideas
- 🐛 **[Issues](https://github.com/Adel2411/web-journey/issues)** - Report problems or request features
- 👥 **Peer Learning** - Review others' solutions and provide feedback

### 💡 Pro Tips
- Start with the basics and build progressively
- Don't skip the fundamentals - they're crucial for advanced features
- Review other participants' solutions to learn different approaches
- Ask questions when you're stuck - the community is here to help
- Document your learning journey and share insights

---

## 🎯 Next Steps

Ready to start building CollabNote?

1. **🐳 [Run the Project →](#-quick-start---run-the-complete-project)**
2. **🔥 [Choose Your First Session →](../SESSIONS.md)**
3. **🎯 [Browse Available Challenges →](../CHALLENGES.md)**  
4. **📚 [Learn How to Contribute →](../CONTRIBUTING.md)**

---

<div align="center">

**🌟 Ready to build something amazing?**

Start the project with Docker, pick your first session, complete the challenges, and watch CollabNote come to life!

**[📚 Explore Sessions →](../SESSIONS.md)** | **[🎯 View Challenges →](../CHALLENGES.md)** | **[🤝 Start Contributing →](../CONTRIBUTING.md)**

</div>

---

> **Remember:** Every expert was once a beginner. Your journey to becoming a skilled web developer starts with building CollabNote, one feature at a time. Let's build something incredible together! 🚀
