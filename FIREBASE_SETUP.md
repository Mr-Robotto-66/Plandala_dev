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

**Note:** With Firebase CLI now set up, indexes can also be deployed via:
```bash
npm run firebase:indexes:deploy
```
See the "Managing Firestore Indexes with Firebase CLI" section below for details.

## 8. Managing Firestore Indexes with Firebase CLI

### Prerequisites

Firebase CLI has been installed and configured for this project. The configuration files are:
- `firebase.json` - Firebase project configuration
- `.firebaserc` - Project aliases (set to `plandala-dev`)
- `firestore.indexes.json` - Index definitions
- `firestore.rules` - Security rules

### Viewing Current Indexes

```bash
npm run firebase:indexes:list
```

This displays all indexes currently deployed to Firebase, including their build status (READY, CREATING, etc.).

### Deploying Index Changes

After modifying `firestore.indexes.json`:

```bash
npm run firebase:indexes:deploy
```

The deployment process will:
1. Validate the index definition
2. Create the composite index in the `plandala-dev` project
3. Begin building the index (takes 1-2 minutes for small datasets)

**Monitor progress:**
- Run `npm run firebase:indexes:list` to check build status
- Or check the Firebase Console: https://console.firebase.google.com/project/plandala-dev/firestore/indexes

### Adding New Indexes

1. Edit `firestore.indexes.json` to add the new index definition
2. Deploy with `npm run firebase:indexes:deploy`
3. Wait 1-2 minutes for index to build
4. Verify with `npm run firebase:indexes:list`

### Index Definition File

All indexes are defined in `firestore.indexes.json` and version-controlled in git.

**Current Indexes:**
- **Comments by task**: Filters by `taskId` and orders by `createdAt` (required for comment queries)

### Deploying Security Rules

To deploy changes to `firestore.rules`:

```bash
npm run firebase:rules:deploy
```

### Deploying Both Indexes and Rules

To deploy all Firestore configuration at once:

```bash
npm run firebase:deploy
```

### Authentication

The Firebase CLI requires authentication. If you encounter authentication errors:

```bash
npx firebase login
```

Then retry the deployment command.

## 9. Test the Connection

1. Start the development server: `npm run dev`
2. Open the browser console
3. You should see: "Firebase initialized successfully"
4. If you see errors, verify your `.env.local` values

## 10. Notes

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
