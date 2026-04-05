import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
}

/**
 * Returns the JWT secret, throwing if not configured.
 * Deferred to runtime so the module can be imported at build time.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "Please define the JWT_SECRET environment variable inside .env.local"
    );
  }
  return secret;
}

/**
 * Sign a JWT token for a user.
 * Token expires in 7 days.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

/**
 * Verify and decode a JWT token.
 * Returns the decoded payload or null if invalid.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extract the Bearer token from the Authorization header.
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * Authenticate a request using the JWT token from the Authorization header.
 * Returns the decoded payload if valid, or a 401 NextResponse if not.
 */
export function authenticateRequest(
  request: NextRequest
): JwtPayload | NextResponse {
  const token = extractToken(request);

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required. Please provide a valid token." },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid or expired token. Please log in again." },
      { status: 401 }
    );
  }

  return payload;
}

export function authorizeRole(
  result: JwtPayload | NextResponse,
  allowedRoles: JwtPayload["role"][]
): JwtPayload | NextResponse {
  if (isAuthError(result)) {
    return result;
  }

  if (!allowedRoles.includes(result.role)) {
    return NextResponse.json(
      { error: "You do not have permission to perform this action." },
      { status: 403 }
    );
  }

  return result;
}

/**
 * Type guard to check if the result of authenticateRequest is an error response.
 */
export function isAuthError(
  result: JwtPayload | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
