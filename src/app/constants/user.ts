export const userRole = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    DOCTOR: "DOCTOR",
    PATIENT: "PATIENT",
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];
