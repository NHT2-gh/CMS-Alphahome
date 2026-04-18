/**
 * Auth route config - optimized for scalability
 */

import { SystemRole } from "@/types/profile";
import { APP_ROUTES } from "./app-routes";

export const ROUTES = {
  public: ["/"],
  auth: ["/auth/login", "/auth/sign-up"],
  /**
   * Private route prefixes
   * Chỉ cần match prefix → không cần khai báo từng route
   */
  privatePrefixes: ["/admin"],
  /**
   * API routes (skip middleware)
   */
  apiPrefixes: ["/api"],

  systemRoleSRoutes: {
    [SystemRole.super_admin]: [
      APP_ROUTES.ADMIN.BASE,
      APP_ROUTES.ADMIN.USERS.BASE,
    ],
    [SystemRole.admin]: [
      APP_ROUTES.ADMIN.BASE,
      APP_ROUTES.ADMIN.BUILDINGS.BASE(),
    ],
    [SystemRole.user]: [],
  },
} as const;

/**
 * Default redirects
 */
export const DEFAULT_LOGIN_REDIRECT = "/admin";
export const DEFAULT_AUTH_REDIRECT = "/auth/login";

/**
 * Check exact match
 */
export function isExactMatch(path: string, routes: readonly string[]) {
  return routes.includes(path);
}

/**
 * Check prefix match
 */
export function isPrefixMatch(path: string, prefixes: readonly string[]) {
  return prefixes.some((prefix) => path.startsWith(prefix));
}

export function isPublicRoute(path: string) {
  return isExactMatch(path, ROUTES.public);
}

export function isAuthRoute(path: string) {
  return isExactMatch(path, ROUTES.auth);
}

export function isPrivateRoute(path: string) {
  return isPrefixMatch(path, ROUTES.privatePrefixes);
}

export function isApiRoute(path: string) {
  return isPrefixMatch(path, ROUTES.apiPrefixes);
}

export function hasPermission(role: SystemRole, path: string) {
  return ROUTES.systemRoleSRoutes[role].some((prefix) => {
    return path.startsWith(prefix);
  });
}
