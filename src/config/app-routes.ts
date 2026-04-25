// Application routes for the CMS

export const APP_ROUTES = {
  AUTH: {
    SIGN_IN: "/auth/login",
    SIGN_UP: "/auth/signup",
    RESET_PASSWORD: "/auth/reset-password",
  },

  ADMIN: {
    BASE: "",
    USERS: {
      BASE: "/users",
      ADD: () => `${APP_ROUTES.ADMIN.USERS.BASE}/add`,
    },
    BUILDINGS: {
      BASE: () => `${APP_ROUTES.ADMIN.BASE}/buildings`,
      ADD: () => `${APP_ROUTES.ADMIN.BUILDINGS.BASE()}/add`,
      ID: {
        DETAIL: (buildingId: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.BASE()}/${buildingId}/detail`,
        SETTINGS: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.BASE()}/${id}/settings`,
        ROOMS: {
          BASE: (buildingId?: string) =>
            `${buildingId ? APP_ROUTES.ADMIN.BUILDINGS.ID.DETAIL(buildingId) + `/rooms` : `rooms`}`,
          ID: (roomId: string, buildingId?: string) =>
            `${buildingId ? APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.BASE(buildingId) + `/${roomId}` : `rooms/${roomId}`}`,
          CREATE: (buildingId?: string) =>
            `${buildingId ? APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.BASE(buildingId) + `/create` : `rooms/create`}`,
        },
        PAYMENT: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.ID.DETAIL(id)}/payments`,
        UTILITY_READINGS: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.ID.DETAIL(id)}/utility-readings`,
        CONTRACTS: {
          BASE: (buildingId: string) =>
            `${buildingId ? APP_ROUTES.ADMIN.BUILDINGS.ID.DETAIL(buildingId) + `/contracts` : `contracts`}`,
        },
        REVENUE_EXPENDITURE_BOOK: (id: string) =>
          `${APP_ROUTES.ADMIN.BUILDINGS.ID.DETAIL(id)}/revenue-expenditure`,
      },
    },
  },
};
