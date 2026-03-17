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
      DETAIL: (id: string) => `${APP_ROUTES.ADMIN.BUILDINGS.BASE}/${id}`,
      ROOMS: {
        DETAIL: (id: string, code: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.BASE}/${id}/${code}`,
      },
      BILLS: {
        BASE: (building_id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.BASE}/${building_id}/bills`,
        CREATE: (building_id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.BILLS.BASE(building_id)}/create`,
      },
      UTILITY_READINGS: {
        BASE: (building_id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.BASE}/${building_id}/utility-readings`,
        CREATE: (building_id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.UTILITY_READINGS.BASE(building_id)}/create`,
      },
    },
  },
};
