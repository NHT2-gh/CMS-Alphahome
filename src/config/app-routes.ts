// Application routes for the CMS

export const APP_ROUTES = {
  AUTH: {
    SIGN_IN: "/auth/signin",
    SIGN_UP: "/auth/signup",
    RESET_PASSWORD: "/auth/reset-password",
  },

  ADMIN: {
    DASHBOARD: "/",
    USERS: {
      BASE: "/users",
      ADD: () => `${APP_ROUTES.ADMIN.USERS.BASE}/add`,
    },
    BUILDINGS: {
      BASE: "/buildings",
      ADD: () => `${APP_ROUTES.ADMIN.BUILDINGS.BASE}/add`,
      ID: {
        BASE: (id: string) => `${APP_ROUTES.ADMIN.BUILDINGS.BASE}/${id}`,
        ROOMS: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(id)}/rooms`,
        PAYMENT: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(id)}/payments`,
        UTILITY_READINGS: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(id)}/utility-readings`,
      },
    },
  },
};
