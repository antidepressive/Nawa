import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { Readable } from 'stream';

// Initialize Google Drive API
let drive: ReturnType<typeof google.drive> | null = null;

/**
 * Initialize Google Drive client using OAuth with service account impersonation
 * This method works when service account key creation is disabled by the organization
 */
export async function initializeGoogleDrive() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const serviceAccountEmail = process.env.GOOGLE_IMPERSONATE_SERVICE_ACCOUNT;
    
    if (!clientId || !clientSecret) {
      console.warn('Google Drive OAuth credentials not configured. File uploads will use local storage.');
      return null;
    }

    if (!serviceAccountEmail) {
      console.warn('GOOGLE_IMPERSONATE_SERVICE_ACCOUNT not set. Google Drive will not be available.');
      return null;
    }

    // Create GoogleAuth instance with OAuth credentials
    const auth = new GoogleAuth({
      clientOptions: {
        clientId,
        clientSecret,
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // Get the authenticated client
    const client = await auth.getClient();
    
    // For service account impersonation, we need to use the IAM Credentials API
    // to generate tokens on behalf of the service account
    // This requires the Service Account Token Creator role
    
    // Use the IAM Credentials API to generate an access token
    const iam = google.iamcredentials('v1');
    
    try {
      // Generate access token for the service account
      const tokenResponse = await iam.projects.serviceAccounts.generateAccessToken({
        name: `projects/-/serviceAccounts/${serviceAccountEmail}`,
        requestBody: {
          scope: ['https://www.googleapis.com/auth/drive'],
        },
        auth: client,
      });

      const accessToken = tokenResponse.data.accessToken;
      
      if (!accessToken) {
        throw new Error('Failed to generate access token for service account');
      }

      // Create OAuth2 client and set the access token
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
      oauth2Client.setCredentials({
        access_token: accessToken,
      });

      drive = google.drive({ 
        version: 'v3', 
        auth: oauth2Client 
      });
      
      console.log('Google Drive initialized successfully with service account impersonation');
      return drive;
    } catch (iamError: any) {
      // If IAM API fails, try alternative approach using domain-wide delegation
      console.warn('IAM impersonation failed, trying alternative method:', iamError.message);
      
      // Alternative: Use OAuth2 with service account email as subject
      // This requires domain-wide delegation to be set up
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
      
      // Note: This approach may require additional setup for domain-wide delegation
      // For now, we'll log the error and return null
      console.error('Service account impersonation setup incomplete. Please ensure:');
      console.error('1. You have the "Service Account Token Creator" role');
      console.error('2. IAM Credentials API is enabled');
      console.error('3. The service account email is correct');
      
      return null;
    }
  } catch (error) {
    console.error('Failed to initialize Google Drive:', error);
    return null;
  }
}

/**
 * Upload a file to Google Drive
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The name of the file
 * @param mimeType - The MIME type of the file
 * @returns The Google Drive file ID
 */
export async function uploadFileToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string = 'application/pdf'
): Promise<string> {
  if (!drive) {
    throw new Error('Google Drive not initialized. Please configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_IMPERSONATE_SERVICE_ACCOUNT');
  }

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is required');
  }

  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType,
      body: Readable.from(fileBuffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink',
    });

    if (!response.data.id) {
      throw new Error('Failed to upload file to Google Drive: No file ID returned');
    }

    console.log(`File uploaded to Google Drive: ${response.data.name} (ID: ${response.data.id})`);
    return response.data.id;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
}

/**
 * Download a file from Google Drive by file ID
 * @param fileId - The Google Drive file ID
 * @returns The file buffer
 */
export async function downloadFileFromDrive(fileId: string): Promise<Buffer> {
  if (!drive) {
    throw new Error('Google Drive not initialized');
  }

  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    return Buffer.from(response.data as ArrayBuffer);
  } catch (error) {
    console.error(`Error downloading file from Google Drive (ID: ${fileId}):`, error);
    throw error;
  }
}

/**
 * Get a file's download URL from Google Drive
 * @param fileId - The Google Drive file ID
 * @returns The download URL
 */
export async function getFileDownloadUrl(fileId: string): Promise<string> {
  if (!drive) {
    throw new Error('Google Drive not initialized');
  }

  try {
    const response = await drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    });

    // Prefer webContentLink for direct download, fallback to webViewLink
    return (response.data.webContentLink || response.data.webViewLink) as string;
  } catch (error) {
    console.error(`Error getting file URL from Google Drive (ID: ${fileId}):`, error);
    throw error;
  }
}

/**
 * Check if Google Drive is configured and available
 */
export function isGoogleDriveConfigured(): boolean {
  return drive !== null;
}
