export const setAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  if (!user || user === "undefined" || user === "null") return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};