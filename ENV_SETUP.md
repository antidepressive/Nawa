# Environment Variables Setup

## Google Drive Configuration

Add these environment variables to your `.env` file (for local development) or your hosting platform (e.g., Render):

```bash
# Google Drive OAuth Configuration
GOOGLE_CLIENT_ID=1075615276554-880hecdq7sq7nn9tk8njk0gl4vm66e4r.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_IMPERSONATE_SERVICE_ACCOUNT=nawa-file-storage@nawa-file-storage.iam.gserviceaccount.com
GOOGLE_DRIVE_FOLDER_ID=1UiP4wFKTgRdYz7NwmxPdq3ekHqHBzCD7
```

## Where to Set These

### For Local Development:
1. Open or create a `.env` file in the root directory of your project
2. Add the variables above
3. Restart your development server

### For Production (Render):
1. Go to your Render dashboard
2. Select your service
3. Go to **Environment** tab
4. Click **Add Environment Variable** for each variable:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_IMPERSONATE_SERVICE_ACCOUNT`
   - `GOOGLE_DRIVE_FOLDER_ID`
5. Paste the corresponding values
6. Save and redeploy

## Security Note

⚠️ **Never commit these values to git!** The `.env` file is already in `.gitignore` to prevent accidental commits.

## Testing

After setting the environment variables:

1. Restart your server
2. Check the server logs - you should see: `Google Drive initialized successfully with service account impersonation`
3. Try uploading a file (resume or transaction proof)
4. Check your Google Drive folder - the file should appear there
