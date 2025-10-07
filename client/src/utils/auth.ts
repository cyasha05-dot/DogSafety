// utils/auth.ts
export const isAdminLoggedIn = (): boolean => {
  return !!localStorage.getItem("adminToken"); // set token on login
};
