// utils/saveRedirect.js
export const saveRedirectPath = (path) => {
  localStorage.setItem('redirectPath', path);
};

export const getRedirectPath = () => {
  const path = localStorage.getItem('redirectPath');
  localStorage.removeItem('redirectPath'); // clear it after reading
  return path;
};
