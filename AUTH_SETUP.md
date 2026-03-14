# Authentication System Setup

This application uses bcrypt-secured authentication with environment-based credentials.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_ADMIN_USERNAME=admin-sastrairi
VITE_ADMIN_PASSWORD=admin12#
VITE_ADMIN_PASSWORD_HASH=$2b$10$hVq7pkR4NSleZWMmAILlCOcSBVZ965H/i6fcYFA9na6/8BdLMdg4u
```

### Quick Setup

Run the setup script to generate a new bcrypt hash:

```bash
node scripts/setup-env.cjs
```

Then copy the output to your `.env` file.

## How It Works

### 1. Password Verification
- Passwords are verified using bcrypt comparison
- The plain password is compared against the stored hash
- No plain text passwords are stored in the codebase

### 2. Session Token
- When a user logs in successfully, a secure authentication token is generated
- The token is created using:
  - Current timestamp
  - Random string
  - Bcrypt hashing of the combined data
- The token is stored in localStorage as `admin_session`

### 3. Session Structure
```typescript
{
  authenticated: true,
  username: "admin-sastrairi",
  token: "hashed_token_string",
  timestamp: 1234567890
}
```

## Security Features

- ✅ Passwords verified with bcrypt (10 salt rounds)
- ✅ Secure token generation using bcrypt hashing
- ✅ Environment-based credentials (not hardcoded)
- ✅ Token-based session storage
- ✅ Automatic session cleanup on logout
- ✅ Error handling for invalid sessions

## Default Credentials

- **Username**: `admin-sastrairi`
- **Password**: `admin12#`

⚠️ **IMPORTANT**: Change these credentials in production!

## Files Modified

### Created Files
- `src/utils/auth.ts` - Authentication utilities (bcrypt hashing, token generation)
- `src/context/AuthContext.tsx` - Authentication context with environment support
- `scripts/setup-env.cjs` - Script to generate bcrypt hashes
- `.env` - Environment variables (gitignored)
- `.env.example` - Example environment file

### Modified Files
- `src/pages/Login.tsx` - Login page
- `src/App.tsx` - Route configuration with AuthProvider
- `src/components/layout/Sidebar.tsx` - User info and logout button

## Updating Credentials

To change the admin credentials:

1. Run the setup script:
   ```bash
   node scripts/setup-env.cjs
   ```

2. Update the `.env` file with the new values:
   ```env
   VITE_ADMIN_USERNAME=new_username
   VITE_ADMIN_PASSWORD=new_password
   VITE_ADMIN_PASSWORD_HASH=new_hash_from_script
   ```

3. Restart the development server

## Production Recommendations

For production deployment:

1. **Remove plain text password** from `.env`:
   ```env
   VITE_ADMIN_USERNAME=admin-sastrairi
   VITE_ADMIN_PASSWORD_HASH=$2b$10$...
   ```

2. **Use backend authentication** instead of client-side only

3. **Implement JWT tokens** with expiration

4. **Add HTTPS** for secure communication

5. **Use environment-specific configs** for different environments

6. **Consider using Supabase Auth** for a complete authentication solution

## Troubleshooting

### Login not working
- Check that `.env` file exists and is properly formatted
- Ensure the password hash matches the plain password
- Verify environment variables are loaded (check browser console)

### Session not persisting
- Check browser localStorage for `admin_session`
- Ensure cookies are enabled
- Check for browser privacy settings blocking localStorage

### Build errors
- Ensure all dependencies are installed: `npm install`
- Check that bcryptjs is properly installed
- Verify TypeScript types are installed: `@types/bcryptjs`
