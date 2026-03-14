import bcrypt from 'bcryptjs';

export interface SessionToken {
  authenticated: boolean;
  username: string;
  token: string;
  timestamp: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a secure authentication token
 */
export async function generateAuthToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const combined = `${timestamp}-${randomString}`;

  // Hash the combined string to create a secure token
  return hashPassword(combined);
}

/**
 * Create a session token object
 */
export async function createSessionToken(username: string): Promise<SessionToken> {
  const token = await generateAuthToken();

  return {
    authenticated: true,
    username: username,
    token: token,
    timestamp: Date.now()
  };
}
