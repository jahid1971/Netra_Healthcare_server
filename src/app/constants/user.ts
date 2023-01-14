export const userRole = {
    SELLER: "seller",
    BRANCH_MANAGER: "branchManager",
    SUPER_ADMIN: "superAdmin",
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];


