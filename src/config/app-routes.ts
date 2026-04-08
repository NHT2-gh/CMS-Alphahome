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
        BASE: (buildingId: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.BASE}/${buildingId}`,
        ROOMS: {
          BASE: (buildingId?: string) =>
            `${buildingId ? APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(buildingId) + `/rooms` : `rooms`}`,
          ID: (roomId: string, buildingId?: string) =>
            `${buildingId ? APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.BASE(buildingId) + `/${roomId}` : `rooms/${roomId}`}`,
          CREATE: (buildingId?: string) =>
            `${buildingId ? APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.BASE(buildingId) + `/create` : `rooms/create`}`,
        },
        PAYMENT: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(id)}/payments`,
        UTILITY_READINGS: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(id)}/utility-readings`,
        CONTRACTS: {
          BASE: (buildingId: string) =>
            `${buildingId ? APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(buildingId) + `/contracts` : `contracts`}`,
        },
        REVENUE_EXPENDITURE_BOOK: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(id)}/revenue-expenditure`,
      },
    },
  },
};
