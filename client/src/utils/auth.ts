// utils/auth.ts
export const isAdminLoggedIn = (): boolean => {
  return !!localStorage.getItem("adminToken"); // set token on login
};

// utils/auth.ts
export const logout = () => {
  localStorage.removeItem("adminToken"); // or sessionStorage
};
