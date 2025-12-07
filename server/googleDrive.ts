// Lazy import to avoid loading googleapis if not needed
let google: any = null;
let Readable: any = null;

// Initialize Google Drive API
let drive: any = null;

/**
 * Initialize Google Drive client using OAuth with service account impersonation
 * This method works when service account key creation is disabled by the organization
 */
export async function initializeGoogleDrive() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const serviceAccountEmail = process.env.GOOGLE_IMPERSONATE_SERVICE_ACCOUNT;
    
    // Early return if credentials are not configured - don't load googleapis at all
    if (!clientId || !clientSecret || !serviceAccountEmail) {
      console.warn('Google Drive OAuth credentials not configured. File uploads will use local storage.');
      return null;
    }

    // For server-to-server authentication with OAuth and service account impersonation,
    // we need to use the IAM Credentials API. However, this requires authenticating to IAM API first.
    // 
    // The challenge: We need credentials to call IAM API, but we can't use ADC (Application Default Credentials)
    // because there are no service account keys.
    //
    // Solution: Use OAuth2Client with a refresh token, OR use the IAM API with a token
    // obtained through the OAuth flow. Since this is server-to-server without user interaction,
    // we need to handle this carefully.
    //
    // For now, we'll disable Google Drive initialization and fall back to local storage.
    // The proper setup requires either:
    // 1. A refresh token obtained through an initial OAuth flow
    // 2. Or using Workload Identity Federation (more complex setup)
    
    console.warn('Google Drive service account impersonation requires additional OAuth setup.');
    console.warn('For server-to-server authentication without user interaction, you need:');
    console.warn('1. A refresh token (obtained through initial OAuth flow)');
    console.warn('2. Or Workload Identity Federation setup');
    console.warn('Google Drive will not be available. Files will be stored locally.');
    console.warn('Note: Local files may be lost on server restart on platforms like Render.');
    
    return null;
  } catch (error: any) {
    console.error('Failed to initialize Google Drive:', error?.message || error);
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

  // Lazy load if not already loaded
  if (!google) {
    google = (await import('googleapis')).google;
  }
  if (!Readable) {
    Readable = (await import('stream')).Readable;
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

  // Lazy load if not already loaded
  if (!google) {
    google = (await import('googleapis')).google;
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

  // Lazy load if not already loaded
  if (!google) {
    google = (await import('googleapis')).google;
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
