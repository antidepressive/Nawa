# Google Drive Setup Guide (OAuth with Service Account Impersonation)

This guide will help you set up Google Drive integration for persistent file storage (resumes and transaction proofs) **without requiring service account JSON keys**. This method works even when your organization has disabled service account key creation.

## Why This Method?

If your Google Cloud organization has disabled service account key creation (`iam.disableServiceAccountKeyCreation`), you cannot download JSON keys. This guide uses **OAuth Client ID/Secret with Service Account Impersonation** instead, which is the recommended approach for organizations with strict security policies.

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "NAWA File Storage")
5. Click "Create"

### 2. Enable Required APIs

1. In your Google Cloud project, navigate to **APIs & Services** > **Library**
2. Enable these APIs:
   - **Google Drive API** - Search for it and click **Enable**
   - **IAM Service Account Credentials API** - Search for it and click **Enable** (required for impersonation)

### 3. Create a Service Account (No Keys Needed!)

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in:
   - **Service account name**: `nawa-file-storage` (or any name you prefer)
   - **Service account ID**: Will auto-generate
   - **Description**: "Service account for NAWA file uploads"
4. Click **Create and Continue**
5. Skip the optional steps and click **Done**
6. **Important**: Do NOT create a key - we won't need it!

### 4. Grant Service Account Token Creator Role

You (your Google account) need permission to impersonate the service account:

1. Go to **IAM & Admin** > **IAM**
2. Find your email address (the one you're logged in with)
3. Click the **Edit** (pencil icon) next to your account
4. Click **Add Another Role**
5. Select **Service Account Token Creator**
6. Click **Save**

This allows your account to generate tokens on behalf of the service account.

### 5. Create OAuth Client ID

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - Choose **Internal** (for organization use) or **External**
   - Fill in the required fields
   - Add scopes: `https://www.googleapis.com/auth/drive`
   - Save and continue
4. Back at credentials, click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Give it a name (e.g., "NAWA File Storage OAuth")
7. Add **Authorized redirect URIs**:
   - For local development: `http://localhost:5000`
   - For production: Your production domain (e.g., `https://yourdomain.com`)
8. Click **Create**
9. **Copy the Client ID and Client Secret** - you'll need these!

### 6. Create a Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder (e.g., "NAWA File Uploads")
3. Right-click on the folder > **Share**
4. Find the service account email from step 3 (it looks like `nawa-file-storage@your-project.iam.gserviceaccount.com`)
5. Paste this email address in the "Add people and groups" field
6. Make sure it has **Editor** permissions
7. Click **Send** (you can uncheck "Notify people" if you want)
8. Copy the **Folder ID** from the URL:
   - The URL will look like: `https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j`
   - The Folder ID is: `1a2b3c4d5e6f7g8h9i0j`

### 7. Configure Environment Variables

Add these to your `.env` file (for local development) or your hosting platform's environment variables (e.g., Render):

```bash
# Google Drive OAuth Configuration
GOOGLE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_IMPERSONATE_SERVICE_ACCOUNT=nawa-file-storage@your-project.iam.gserviceaccount.com
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```

**Where to find these values:**
- `GOOGLE_CLIENT_ID`: From step 5 (OAuth Client ID)
- `GOOGLE_CLIENT_SECRET`: From step 5 (OAuth Client Secret)
- `GOOGLE_IMPERSONATE_SERVICE_ACCOUNT`: The service account email from step 3
- `GOOGLE_DRIVE_FOLDER_ID`: The folder ID from step 6

**For detailed setup instructions with your actual values, see `ENV_SETUP.md`**

**Important:** 
- For local development: Add these to your `.env` file in the project root
- For production (Render): Add these in the Render dashboard under Environment variables
- Never commit these values to git (`.env` is already in `.gitignore`)

## Testing

After setting up:

1. Restart your server
2. Check the server logs - you should see: `Google Drive initialized successfully with service account impersonation`
3. Try uploading a file (resume or transaction proof)
4. Check your Google Drive folder - the file should appear there
5. Try viewing the file in the admin dashboard - it should work

## Troubleshooting

### "Google Drive not initialized"
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
- Verify `GOOGLE_IMPERSONATE_SERVICE_ACCOUNT` matches your service account email exactly
- Check server logs for detailed error messages

### "Permission denied" or "Access denied"
- Verify you have the **Service Account Token Creator** role (step 4)
- Make sure the service account has **Editor** permissions on the Google Drive folder
- Check that the OAuth consent screen is configured properly

### "File not found in Google Drive"
- Verify the folder ID is correct
- Make sure the service account has Editor permissions on the folder
- Check that the file was actually uploaded (check Google Drive folder)

### "Invalid grant" or OAuth errors
- Verify your OAuth Client ID and Secret are correct
- Make sure the authorized redirect URIs include your domain
- Check that the OAuth consent screen is published (if using External)

## Security Notes

- **Never commit** OAuth credentials to git
- The service account should only have access to the specific folder
- Use environment variables for all credentials in production
- Regularly review and rotate OAuth credentials if needed
- The Service Account Token Creator role should only be granted to trusted administrators

## How It Works

1. Your backend uses OAuth Client ID/Secret to authenticate
2. Your user account (with Service Account Token Creator role) generates tokens
3. These tokens impersonate the service account
4. The service account accesses the Google Drive folder
5. Files are uploaded/downloaded using the service account's permissions

This method:
- ✅ Works when service account key creation is disabled
- ✅ Doesn't require storing sensitive JSON files
- ✅ Complies with organization security policies
- ✅ Provides the same functionality as JSON key method

## Differences from JSON Key Method

| JSON Key Method | OAuth Impersonation Method |
|----------------|---------------------------|
| Requires downloading JSON key | No keys needed |
| Stores credentials in file/env | Uses OAuth Client ID/Secret |
| Direct service account auth | Impersonates service account |
| Blocked by org policies | Works with org policies |
