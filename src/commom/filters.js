export const filterArray = (array, value) => {
  return array.filter(({ nome }) => nome.includes(value));
};
