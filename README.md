# School Photo Management System

A comprehensive web application for managing school photos and videos with Google Drive integration.

## Features

- **Beautiful Gallery Interface**: Modern, responsive design with grid and list views
- **Efficient Upload System**: Drag-and-drop upload with progress tracking
- **Smart Folder Management**: Organize by year, occasion, and custom subfolders
- **Google Drive Integration**: Seamless sync with your Google Drive storage
- **User Authentication**: Secure Google Sign-In integration
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Search & Filter**: Find photos and videos quickly
- **Batch Operations**: Download multiple files, bulk uploads

## Setup Instructions

### 1. Google Apps Script Setup

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default `Code.gs` with the content from `apps-script/Code.gs`
4. Enable the Google Drive API:
   - Click on "Libraries" in the left sidebar
   - Add the Drive API library
5. Set up OAuth consent screen:
   - Go to Google Cloud Console
   - Enable Google Drive API
   - Configure OAuth consent screen
6. Deploy the script as a web app:
   - Click "Deploy" → "New deployment"
   - Choose "Web app" as type
   - Set execute as "Me"
   - Set access to "Anyone"
   - Copy the deployment URL

### 2. Frontend Setup

1. Clone this repository
2. Update the following in your code:
   - Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with your deployed Apps Script URL
   - Replace `YOUR_MAIN_DRIVE_FOLDER_ID` with your Google Drive folder ID
   - Update allowed origins in Apps Script for your domain

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

### 3. GitHub Pages Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages:
   - Push your code to a GitHub repository
   - Go to repository Settings → Pages
   - Select source as "GitHub Actions" or "Deploy from a branch"
   - Your site will be available at `https://username.github.io/repository-name`

### 4. Configuration

Update these variables in your code:

**In Google Apps Script (`Code.gs`):**
```javascript
const DRIVE_FOLDER_ID = 'your-actual-folder-id';
const ALLOWED_ORIGINS = [
  'https://your-username.github.io',
  'http://localhost:5173'
];
```

**In Frontend (`src/utils/api.ts`):**
```javascript
const APPS_SCRIPT_URL = 'your-deployed-apps-script-url';
```

## Project Structure

```
src/
├── components/           # React components
│   ├── Header.tsx       # Navigation and user info
│   ├── Gallery.tsx      # Photo/video gallery
│   ├── Upload.tsx       # File upload interface
│   ├── MediaModal.tsx   # Lightbox for media viewing
│   ├── FolderManager.tsx # Folder CRUD operations
│   ├── FolderBreadcrumbs.tsx # Navigation breadcrumbs
│   └── LoadingScreen.tsx # Loading states
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   └── DriveContext.tsx # Drive API integration
├── utils/               # Utility functions
│   └── api.ts          # API client for Apps Script
├── App.tsx             # Main application component
└── main.tsx            # Application entry point

apps-script/
└── Code.gs             # Google Apps Script backend
```

## Usage

1. **Authentication**: Users sign in with their Google accounts
2. **Upload**: Drag and drop or select files to upload to Google Drive
3. **Organization**: Create folders by year, occasion, and custom categories
4. **Gallery**: Browse photos and videos in a beautiful, responsive interface
5. **Management**: Rename, delete, and organize folders efficiently

## Technical Details

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Google Apps Script with Drive API
- **Hosting**: GitHub Pages (frontend), Google Apps Script (backend)
- **Storage**: Google Drive
- **Authentication**: Google OAuth

## Security

- All API requests require authentication
- Files are stored in your private Google Drive
- CORS protection for allowed origins only
- No sensitive data stored in frontend

## Support

For issues or questions, please create an issue in the GitHub repository.