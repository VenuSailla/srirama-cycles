import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'sri_rama_cycles_super_secure_jwt_secret_key_2026';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function getSessionFromRequest(request) {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const payload = verifyToken(token);
    if (payload) return payload;
  }

  // Check cookies
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...v] = c.trim().split('=');
      return [key, decodeURIComponent(v.join('='))];
    })
  );

  const token = cookies.sri_rama_admin_token || cookies.sri_rama_session;
  if (token) {
    return verifyToken(token);
  }

  return null;
}

export function requireAdmin(request) {
  const session = getSessionFromRequest(request);
  if (!session || (session.role !== 'admin' && !session.isAdmin)) {
    return null;
  }
  return session;
}

export function requireUser(request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return null;
  }
  return session;
}
