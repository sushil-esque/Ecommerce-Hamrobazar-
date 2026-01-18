export const formatPrice = (value) => {
  if (value === null || value === undefined) return "";

  return new Intl.NumberFormat("en-IN").format(value);
};
