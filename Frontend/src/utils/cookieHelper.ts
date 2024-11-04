import Cookies from "js-cookie";

// Function to set a unique user identifier cookie
export const setUserCookie = (userId: string) => {
  Cookies.set("userId", userId, { expires: 365 }); // Cookie expires in 365 days
};

// Function to get the user identifier from the cookie
export const getUserCookie = () => {
  return Cookies.get("userId");
};
export const generateUniqueId = () => {
  return `user-${Math.random().toString(36).substring(2, 10)}`;
};
