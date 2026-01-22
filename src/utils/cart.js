export const saveLocalCart = (data) => {
  localStorage.setItem("cart", JSON.stringify(data));
};
export const getLocalCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};
