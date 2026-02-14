# Plandala Kanban Dashboard

A real-time kanban board for the Plandala development team with drag-and-drop functionality, task commenting, image attachments, and a beautiful dark/light theme matching the Plandala brand.

![Plandala Kanban](https://img.shields.io/badge/Built%20with-React%2019-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🎯 Core Functionality
- **Kanban Board** with 3 main columns: High Priority, In Progress, Not Started
- **Separate Pages** for Testing and Done tasks
- **Drag & Drop** tasks between columns and pages using @dnd-kit
- **Real-time Collaboration** powered by Firebase Firestore
- **Task Management** - Create, edit, delete, and assign tasks
- **Comments System** - Real-time threaded comments on tasks
- **Image Attachments** - Upload images via drag/drop, file select, or paste
- **User Management** - Name-based identity (stored in localStorage)

### 🎨 Design & UX
- **Dark/Light Mode** toggle with persistence
- **Plandala Brand Theme** - Cyan-to-magenta gradients and glowing effects
- **Glass-morphism** cards with smooth animations
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Keyboard Accessible** - Full keyboard navigation support

### 🚀 Technical Highlights
- React 19.2 with modern hooks and patterns
- Vite 7.3 for blazing-fast development
- Tailwind CSS 4.1 with custom theme
- Firebase Firestore for real-time data sync
- Firebase Storage for image uploads
- Client-side image compression (Compressorjs)
- HashRouter for GitHub Pages compatibility

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Firebase project (see [Firebase Setup](#firebase-setup))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd Plandala_dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase** (see detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

4. **Create `.env.local` file** in the project root:
   ```bash
   cp .env.example .env.local
   ```

5. **Add your Firebase credentials** to `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/Plandala_dev/`

## 📦 Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🌐 Deployment

### Deploy to GitHub Pages

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

The app will be deployed to `https://[your-username].github.io/Plandala_dev/`

### Environment Variables for Production

For production deployment, create a `.env.production` file or configure environment variables in your hosting platform with the same Firebase credentials.

## 📁 Project Structure

```
Plandala_dev/
├── src/
│   ├── components/
│   │   ├── kanban/          # Board, Column, TaskCard, TaskModal
│   │   ├── task/            # TaskForm, CommentSection, ImageUpload
│   │   ├── layout/          # Navbar, ThemeToggle, PageLayout
│   │   └── common/          # UserPrompt, Modal, LoadingSpinner
│   ├── pages/               # KanbanPage, TestingPage, DonePage
│   ├── hooks/               # useTasks, useComments, useImageUpload
│   ├── lib/                 # firebase.js, firestore.js, storage.js
│   ├── context/             # TaskContext, UserContext, ThemeContext
│   ├── utils/               # imageCompression.js
│   └── styles/              # index.css (custom Tailwind theme)
├── .env.local               # Firebase credentials (gitignored)
├── .env.example             # Template for environment variables
├── package.json
├── vite.config.js
└── index.html
```

## 🎨 Theming

The app uses a custom Tailwind theme with Plandala brand colors:

### Dark Mode (Default)
- **Background**: Deep space black (#0a0a0f)
- **Surface**: Charcoal (#12121a)
- **Cyan**: #22d3ee → #5eead4
- **Magenta**: #d946ef → #e879f9
- **Blue**: #4361ee → #6380f2

### Light Mode
- **Background**: Soft white (#f8fafc)
- **Surface**: Pure white (#ffffff)
- Same accent colors with adjusted opacity

Toggle theme using the sun/moon icon in the navbar.

## 🔥 Firebase Schema

### Firestore Collections

#### `tasks`
```javascript
{
  id: string,
  title: string,
  description: string,
  status: "high_priority" | "in_progress" | "not_started" | "testing" | "done",
  page: "kanban" | "testing" | "done",
  assignedTo: string | null,
  createdBy: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  order: number,
  imageUrls: string[],
  metadata: {
    commentCount: number,
    imageCount: number
  }
}
```

#### `comments`
```javascript
{
  id: string,
  taskId: string,
  text: string,
  userName: string,
  createdAt: timestamp,
  imageUrls: string[]
}
```

### Storage Structure
```
/task-images/{taskId}/IMG_{timestamp}_{randomId}.jpg
/comment-images/{commentId}/IMG_{timestamp}_{randomId}.jpg
```

## 🧪 Usage Guide

### First Visit
1. Enter your name when prompted
2. Your name will be saved and used for task creation and comments
3. You can change your name anytime by clicking your name in the navbar

### Creating Tasks
1. Click the `+` button in any column
2. Fill in task details (title, description, assignee)
3. Optionally attach images via drag/drop, paste, or file select
4. Select the appropriate status and save

### Managing Tasks
- **Drag tasks** between columns to change status
- **Click a task** to view details, edit, or delete
- **Add comments** to discuss tasks with your team
- **Upload images** to provide visual context

### Collaboration
- All changes sync in real-time across all users
- Comment on tasks to communicate with team members
- Assign tasks to specific team members
- Move tasks through the workflow (Kanban → Testing → Done)

## 🤝 Contributing

This is an internal tool for the Plandala development team. If you have suggestions or find bugs:

1. Create an issue describing the problem or feature request
2. Fork the repository and create a feature branch
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

## 📝 License

Internal project for Plandala development team.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Firebase](https://firebase.google.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Drag & Drop by [@dnd-kit](https://dndkit.com/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

For questions or issues:
- Check [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for Firebase configuration help
- Review the code comments for implementation details
- Reach out to the dev team lead

---

**Made with 💙 by the Plandala Team**
