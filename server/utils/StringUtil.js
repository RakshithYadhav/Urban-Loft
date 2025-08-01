const isEmptyOrNull = (str) => {
  return !str || str.trim().length === 0;
}

const isNotEmptyOrNull = (str) => {
  return !isEmptyOrNull(str);
}

module.exports = {
  isEmptyOrNull,
  isNotEmptyOrNull
};