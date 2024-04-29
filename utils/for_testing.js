const reverse = (string) => {
  return string.split("").reverse().join("");
};

const average = (array) => {
  const reducer = array.reduce((sum, item) => sum + item, 0);
  return array.length !== 0 ? reducer / array.length : 0;
};

const functions = {
  reverse,
  average,
};
export default functions;
