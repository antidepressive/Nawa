import { google } from "googleapis";
import { Readable } from "stream";

// Cached Drive client instance
let drive: ReturnType<typeof google.drive> | null = null;
let driveReady = false;

/**
 * Helper to check if we have the minimum env vars to talk to Google Drive.
 */
function hasDriveEnv(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_DRIVE_REFRESH_TOKEN &&
    process.env.GOOGLE_DRIVE_FOLDER_ID
  );
}

/**
 * Lazily create (or return) an authenticated Google Drive client using
 * OAuth2 + refresh token. This avoids Application Default Credentials and
 * does not require JSON service account keys.
 */
async function getDriveClient() {
  if (drive) return drive;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Google Drive configuration. Expected GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_DRIVE_REFRESH_TOKEN."
    );
  }

  // Redirect URI is not actually used at runtime when we already have a refresh token,
  // but OAuth2 client expects one. This just needs to match what was used when
  // the refresh token was originally created.
  const redirectUri =
    process.env.GOOGLE_DRIVE_REDIRECT_URI || "urn:ietf:wg:oauth:2.0:oob";

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  return drive;
}

/**
 * Initialize Google Drive client once at server startup.
 * If this fails, we log the reason and continue with local storage.
 */
export async function initializeGoogleDrive(): Promise<boolean> {
  if (!hasDriveEnv()) {
    console.warn(
      "Google Drive env vars not fully set. Files will be stored locally."
    );
    driveReady = false;
    return false;
  }

  try {
    await getDriveClient();
    driveReady = true;
    console.log(
      "Google Drive initialized successfully. New uploads will be stored in Google Drive."
    );
    return true;
  } catch (error: any) {
    driveReady = false;
    console.error(
      "Failed to initialize Google Drive. Files will be stored locally instead:",
      error?.message || error
    );
    return false;
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
  mimeType: string = "application/pdf"
): Promise<string> {
  const client = await getDriveClient();

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID environment variable is required");
  }

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType,
    body: Readable.from(fileBuffer),
  };

  const response = await client.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, name, webViewLink",
  });

  if (!response.data.id) {
    throw new Error("Failed to upload file to Google Drive: No file ID returned");
  }

  console.log(
    `File uploaded to Google Drive: ${response.data.name} (ID: ${response.data.id})`
  );
  return response.data.id;
}

/**
 * Download a file from Google Drive by file ID
 * @param fileId - The Google Drive file ID
 * @returns The file buffer
 */
export async function downloadFileFromDrive(
  fileId: string
): Promise<Buffer> {
  const client = await getDriveClient();

  const response = await client.files.get(
    { fileId, alt: "media" },
    { responseType: "arraybuffer" }
  );

  return Buffer.from(response.data as ArrayBuffer);
}

/**
 * Get a file's download URL from Google Drive
 * @param fileId - The Google Drive file ID
 * @returns The download URL
 */
export async function getFileDownloadUrl(fileId: string): Promise<string> {
  const client = await getDriveClient();

  const response = await client.files.get({
    fileId,
    fields: "webViewLink, webContentLink",
  });

  // Prefer webContentLink for direct download, fallback to webViewLink
  return (response.data.webContentLink || response.data.webViewLink) as string;
}

/**
 * Check if Google Drive is configured and available
 */
export function isGoogleDriveConfigured(): boolean {
  return driveReady;
}
