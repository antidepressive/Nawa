// scripts/get-drive-refresh-token.ts
import 'dotenv/config';
import { google } from 'googleapis';
import express from 'express';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function main() {
  const app = express();

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  app.get('/auth', (_req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',      // <-- needed to get a refresh token
      prompt: 'consent',           // <-- force consent to ensure refresh token
      scope: SCOPES,
    });
    res.redirect(url);
  });

  app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send('No code in query');
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('\nAccess Token:', tokens.access_token);
      console.log('Refresh Token:', tokens.refresh_token);
      console.log('\nCopy the REFRESH TOKEN above into GOOGLE_DRIVE_REFRESH_TOKEN.\n');

      res.send('Tokens received. You can close this tab.');
      process.exit(0);
    } catch (err) {
      console.error('Error exchanging code for tokens:', err);
      res.status(500).send('Error exchanging code for tokens. See terminal logs.');
    }
  });

  app.listen(3000, () => {
    console.log('Visit http://localhost:3000/auth to start the OAuth flow...');
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});