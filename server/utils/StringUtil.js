export const isEmptyOrNull = (str) => {
  return !str || str.trim().length === 0;
}

export const isNotEmptyOrNull = (str) => {
  return !isEmptyOrNull(str);
}

