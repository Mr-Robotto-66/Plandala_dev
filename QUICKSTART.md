# Plandala Kanban - Quick Start Guide

Get your Plandala Kanban Dashboard up and running in 5 minutes!

## ⚡ Quick Setup

### 1. Firebase Setup (Required)

**You must complete this step before running the app.**

See detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md), or follow these quick steps:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g., "Plandala Dev")
3. Enable **Firestore Database** (production mode, us-central1 region)
4. Enable **Firebase Storage** (production mode, same region)
5. Get your web app config from Project Settings
6. Create `.env.local` file in this directory:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

7. Deploy the security rules from [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### 2. Install & Run

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

🎉 Open [http://localhost:5173/Plandala_dev/](http://localhost:5173/Plandala_dev/) in your browser!

## 🎮 First Steps

1. **Enter your name** when prompted (stored locally)
2. **Create your first task** by clicking the `+` button in any column
3. **Drag tasks** between columns to change their status
4. **Click a task** to view details, add comments, or upload images

## 🎨 Features to Try

### Drag & Drop
- Drag tasks between High Priority, In Progress, and Not Started columns
- Drag tasks to reorder them within a column
- Tasks automatically save their position

### Task Management
- **Create**: Click `+` in any column
- **Edit**: Click a task, then click the edit icon
- **Delete**: Click a task, then click the trash icon
- **Assign**: Add a team member's name in the task form

### Comments & Images
- Click any task to open the detail view
- Scroll down to the comments section
- Type a comment and hit send
- Upload images by drag/drop, paste, or file select

### Theme Toggle
- Click the sun/moon icon in the top-right to switch themes
- Your preference is saved automatically

### Navigation
- **Kanban**: Main board with 3 columns
- **Testing**: Tasks ready for QA
- **Done**: Completed tasks

## 📊 Pages Overview

| Page | Status | Purpose |
|------|--------|---------|
| **Kanban** | High Priority, In Progress, Not Started | Main workflow |
| **Testing** | Testing | QA queue |
| **Done** | Done | Completed features |

## 🔧 Common Issues

### "Firebase initialized successfully" not showing?
- Check your `.env.local` file exists and has the correct values
- Ensure all Firebase services are enabled (Firestore + Storage)
- Verify security rules are deployed

### Tasks not saving?
- Check browser console for errors
- Verify Firestore security rules are deployed
- Make sure you entered your name when prompted

### Images not uploading?
- Check Firebase Storage is enabled
- Verify storage security rules are deployed
- Ensure images are under 5MB

### Drag & drop not working?
- Make sure you're clicking the grip icon on the task card
- Try clicking and dragging from the task title

## 🚀 Next Steps

- **Invite your team**: Share the URL when deployed
- **Customize**: Modify colors in `src/styles/index.css`
- **Deploy**: Run `npm run deploy` to publish to GitHub Pages

## 📚 Full Documentation

- [README.md](./README.md) - Complete documentation
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Detailed Firebase setup
- [Project Structure](./README.md#-project-structure) - Code organization

## 💡 Tips

- **Real-time**: All changes sync instantly across browsers
- **Local Storage**: Your name and theme preference are saved locally
- **Image Paste**: You can paste images directly (Ctrl/Cmd + V)
- **Keyboard**: Use Tab to navigate, Enter to submit forms

---

**Happy task managing! 🎯**
