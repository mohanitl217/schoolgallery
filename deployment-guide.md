# Deployment Guide

## Step-by-Step Deployment Instructions

### Step 1: Prepare Your Google Drive

1. Create a main folder in Google Drive for your school photos
2. Note the folder ID from the URL (the long string after `/folders/` in the browser)
3. Set up your folder structure if desired (e.g., create year folders like 2024, 2025)

### Step 2: Deploy Google Apps Script

1. **Open Google Apps Script**:
   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"

2. **Add the Code**:
   - Replace the default code with the content from `apps-script/Code.gs`
   - Update the configuration variables:
     ```javascript
     const DRIVE_FOLDER_ID = 'your-folder-id-here';
     const ALLOWED_ORIGINS = ['https://your-username.github.io'];
     ```

3. **Enable Drive API**:
   - In the Apps Script editor, click "Services" (+ icon)
   - Add "Google Drive API"

4. **Deploy as Web App**:
   - Click "Deploy" → "New deployment"
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click "Deploy"
   - Copy the web app URL

### Step 3: Configure Frontend

1. **Update API URL**:
   - In `src/utils/api.ts`, replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with your deployed URL
   - In `src/contexts/AuthContext.tsx`, update all URLs

2. **Build the Project**:
   ```bash
   npm run build
   ```

### Step 4: Deploy to GitHub Pages

1. **Create GitHub Repository**:
   - Create a new repository on GitHub
   - Push your code to the repository

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: main (or your default branch)
   - Folder: / (root) or /dist if you want to deploy the built files

3. **Alternative - GitHub Actions Deployment**:
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm install
           
         - name: Build
           run: npm run build
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### Step 5: Final Configuration

1. **Update CORS Origins**:
   - In your Apps Script, update `ALLOWED_ORIGINS` with your GitHub Pages URL
   - Redeploy the Apps Script

2. **Test the Integration**:
   - Visit your GitHub Pages URL
   - Test authentication
   - Try uploading a file
   - Check that files appear in your Google Drive

### Step 6: Optional Enhancements

1. **Custom Domain** (Optional):
   - Set up a custom domain in GitHub Pages settings
   - Update CORS origins in Apps Script

2. **Analytics** (Optional):
   - Add Google Analytics to track usage
   - Monitor upload patterns and popular content

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your GitHub Pages URL is in `ALLOWED_ORIGINS`
   - Make sure the Apps Script is deployed as "Anyone can access"

2. **Authentication Issues**:
   - Check OAuth consent screen configuration
   - Verify Drive API is enabled

3. **Upload Failures**:
   - Check file size limits (Google Drive has a 5TB limit per file)
   - Verify Drive API permissions

4. **Folder Access Issues**:
   - Ensure the Drive folder ID is correct
   - Check that the script has permission to access the folder

### Testing Checklist

- [ ] Can sign in with Google account
- [ ] Can view existing folders and files
- [ ] Can upload new photos and videos
- [ ] Can create new folders
- [ ] Can navigate folder structure
- [ ] Can download files
- [ ] Mobile interface works properly
- [ ] Search and filter functions work

## Security Considerations

1. **Access Control**:
   - The Apps Script runs with your permissions
   - Users can only access what you grant access to
   - Consider creating a dedicated Google account for school photos

2. **Data Privacy**:
   - All files are stored in your Google Drive
   - No data is stored on external servers
   - Users authenticate directly with Google

3. **Permissions**:
   - Script requires Drive API access
   - Users need to grant permission to access their Google account
   - Consider setting up domain-wide delegation for school accounts

## Maintenance

1. **Regular Backups**:
   - Google Drive provides automatic backups
   - Consider additional backup solutions for critical photos

2. **Monitoring**:
   - Check Apps Script execution logs regularly
   - Monitor storage usage in Google Drive

3. **Updates**:
   - Keep dependencies updated in package.json
   - Monitor for new features in Google Apps Script