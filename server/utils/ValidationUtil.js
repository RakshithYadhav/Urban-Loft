const { isEmptyOrNull } = require('./StringUtil');

const validateUserData = (userData) => {
  let errors = {};
  let isOk = true;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (isEmptyOrNull(userData.first_name)) {
    errors.first_name = "First name is required";
    isOk = false;
  }

  if (isEmptyOrNull(userData.email)) {
    errors.email = "Email is required";
    isOk = false;
  } else if (!emailRegex.test(userData.email)) {
    errors.email = "Please enter a valid email address";
    isOk = false;
  }

  if (isEmptyOrNull(userData.password)) {
    errors.password = "Password is required";
    isOk = false;
  } else if (!passwordRegex.test(userData.password)) {
    errors.password = "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
    isOk = false;
  }

  return { isValid: isOk, errors };
};

const validateUserAddress = (userAddressData) => {
  let errors = {};
  let isOk = true;

  if (isEmptyOrNull(userAddressData.address_line1)) {
    errors.address_line1 = "Address line 1 is required";
    isOk = false;
  }
  if (isEmptyOrNull(userAddressData.city)) {
    errors.city = "City is required";
    isOk = false;
  }
  if (isEmptyOrNull(userAddressData.state)) {
    errors.state = "State is required";
    isOk = false;
  }
  if (isEmptyOrNull(userAddressData.postal_code)) {
    errors.postal_code = "Postal code is required";
    isOk = false;
  }
  if (isEmptyOrNull(userAddressData.country)) {
    errors.country = "Country is required";
    isOk = false;
  }

  return { isValid: isOk, errors };
};

module.exports = {
  validateUserData,
  validateUserAddress
};