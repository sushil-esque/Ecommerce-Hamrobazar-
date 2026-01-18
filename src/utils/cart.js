export const saveCart = (data) => {
  localStorage.setItem("cart", JSON.stringify(data));
};
export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};
