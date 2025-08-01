# Admin Dashboard Setup

## Overview
The admin dashboard allows you to view, export, and delete submissions from the database. It's protected by authentication and requires a developer token to access.

## Setup

### 1. Environment Variable
Set the `DEVELOPER_TOKEN` environment variable in your server:

```bash
# In your .env file or environment
DEVELOPER_TOKEN=your_secure_password_here
```

### 2. Access the Admin System

#### Option A: Direct Login
1. Navigate to `/admin/login`
2. Enter the password you set in `DEVELOPER_TOKEN`
3. You'll be redirected to `/admin` after successful login

#### Option B: Direct Admin Access
1. Navigate to `/admin`
2. If not authenticated, you'll be automatically redirected to `/admin/login`
3. Enter the password and access the dashboard

## Features

### Authentication
- ✅ Password-protected access
- ✅ Session-based authentication
- ✅ Automatic logout on invalid token
- ✅ Secure API calls with token

### Data Management
- ✅ View all contact form submissions
- ✅ View all newsletter subscriptions  
- ✅ View all workshop registrations
- ✅ Bulk select and delete items
- ✅ Export data to CSV
- ✅ Real-time data refresh

### User Interface
- ✅ Bilingual support (Arabic/English)
- ✅ Responsive design
- ✅ Tabbed interface for different data types
- ✅ Loading states and error handling
- ✅ Toast notifications for actions

## API Endpoints

### Protected Endpoints (require authentication)
- `GET /api/contact` - Get all contact submissions
- `GET /api/newsletter` - Get all newsletter subscriptions
- `GET /api/workshop` - Get all workshop registrations
- `DELETE /api/contact/:id` - Delete single contact submission
- `DELETE /api/contact` - Bulk delete contact submissions
- `DELETE /api/newsletter/:id` - Delete single newsletter subscription
- `DELETE /api/newsletter` - Bulk delete newsletter subscriptions
- `DELETE /api/workshop/:id` - Delete single workshop registration
- `DELETE /api/workshop` - Bulk delete workshop registrations

## Security Notes

1. **Token Storage**: The admin token is stored in `sessionStorage` and cleared on logout
2. **API Protection**: All admin endpoints require the `apiKey` query parameter
3. **Automatic Redirect**: Invalid tokens automatically redirect to login
4. **Server Validation**: The server validates tokens against the `DEVELOPER_TOKEN` environment variable

## Usage

### Viewing Data
1. Login to the admin dashboard
2. Use the tabs to switch between different data types
3. Each tab shows the count of items in parentheses

### Selecting Items
1. Use individual checkboxes to select specific items
2. Use "Select All" to select all items in the current tab
3. Use "Clear" to deselect all items

### Deleting Items
1. Select the items you want to delete
2. Click the "Delete" button (shows count of selected items)
3. Confirm the action
4. Data will refresh automatically

### Exporting Data
1. Click the "Export" button in any tab
2. CSV file will download automatically
3. File includes all data for that type

### Logging Out
1. Click the "Logout" button in the top-right corner
2. You'll be redirected to the login page
3. Session token is cleared

## Troubleshooting

### Can't Access Admin
- Check that `DEVELOPER_TOKEN` is set in your environment
- Ensure the server is running
- Check browser console for errors

### API Calls Failing
- Verify the token is being sent correctly
- Check server logs for authentication errors
- Ensure the token matches the environment variable

### Data Not Loading
- Check network connectivity
- Verify server is running
- Check browser console for errors
- Ensure authentication token is valid

## Security Best Practices

1. **Strong Password**: Use a strong, unique password for `DEVELOPER_TOKEN`
2. **Environment Variables**: Never commit the token to version control
3. **HTTPS**: Use HTTPS in production to protect token transmission
4. **Regular Rotation**: Consider rotating the token periodically
5. **Access Control**: Limit access to trusted individuals only 