# Firebase Setup Instructions

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name: "Plandala Dev" (or similar)
4. Disable Google Analytics (optional for internal tool)
5. Click "Create project"

## 2. Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Start in **production mode**
4. Choose region: `us-central1` (or closest to your team)
5. Click "Enable"

## 3. Enable Firebase Storage

1. Click "Storage" in the left sidebar
2. Click "Get started"
3. Start in **production mode**
4. Use the same region as Firestore
5. Click "Done"

## 4. Get Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the Web icon (`</>`)
5. Register app name: "Plandala Kanban"
6. Click "Register app"
7. Copy the `firebaseConfig` object

## 5. Add Configuration to Project

1. Create a `.env.local` file in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Replace the placeholder values with your actual Firebase config values

## 6. Deploy Security Rules

### Firestore Security Rules

1. Go to Firestore Database > Rules
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['title', 'createdBy', 'status', 'page']);
      allow update, delete: if true;
    }

    // Comments collection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['taskId', 'userName', 'text']);
      allow update: if false;
      allow delete: if true;
    }
  }
}
```

3. Click "Publish"

### Storage Security Rules

1. Go to Storage > Rules
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Click "Publish"

## 7. Create Composite Indexes

Firestore will automatically prompt you to create required indexes when you first use certain queries. Alternatively, create them manually:

1. Go to Firestore Database > Indexes > Composite
2. Click "Create index"

### Index 1: Tasks by page and status
- Collection ID: `tasks`
- Fields to index:
  - `page` - Ascending
  - `status` - Ascending
  - `order` - Ascending
- Query scope: Collection

### Index 2: Comments by task
- Collection ID: `comments`
- Fields to index:
  - `taskId` - Ascending
  - `createdAt` - Ascending
- Query scope: Collection

## 8. Test the Connection

1. Start the development server: `npm run dev`
2. Open the browser console
3. You should see: "Firebase initialized successfully"
4. If you see errors, verify your `.env.local` values

## Notes

- The `.env.local` file is gitignored for security
- For production deployment, use `.env.production` or configure environment variables in your hosting platform
- Firebase credentials can be public (protected by security rules) but keeping them in .env is good practice
- You can find your Firebase config anytime in Project Settings > Your apps

## Troubleshooting

**"Firebase: Error (auth/invalid-api-key)"**
- Check that your API key is correct in `.env.local`
- Ensure the env variable name starts with `VITE_`

**"Missing or insufficient permissions"**
- Verify security rules are published
- Check that rules match the code above

**"Storage object not found"**
- Ensure Firebase Storage is enabled
- Check that storage bucket name is correct in `.env.local`
