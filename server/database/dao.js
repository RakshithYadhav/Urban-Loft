import connection from "./connect.js";  
import bcrypt from "bcryptjs";
import { isEmptyOrNull } from "../utils/StringUtil.js";
const saltRounds = 10;

class Dao {
  constructor() {
    this.connection = connection;
  }

  async insertUser(userData) {
    const { isValid, errors } = this._validateUserData(userData);
    if (!isValid) {
      return { success: false, errors };
    }

    const query = `INSERT INTO user (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)`;
    const { first_name, last_name, email, password } = userData;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
      const [results ] = await this.connection.execute(query, [
        first_name,
        last_name,
        email,
        hashedPassword,
      ]);
      
      return { success: true, user_id: results.insertId };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        errors: { general: "Insert user operation failed." },
      };
    }
  }

  async insertUserAddress(userAddressData, userId) {
    const { isValid, errors } = this._validateUserAddress(userAddressData);
    if (!isValid) {
      return { success: false, errors };
    }

    const query = `INSERT INTO 
                    user_address (user_id, address_line1, address_line2, city, state, postal_code, country) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const { address_line1, address_line2, city, state, postal_code, country } =
      userAddressData;
    try {
      const [results] = await this.connection.execute(query, [
        userId,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
      ]);
      return { success: true, user_address_id: results.insertId };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        errors: { general: "Insert Address operation failed." },
      };
    }
  }

  async getUserByEmail(email) {
    const query = `SELECT * FROM user WHERE email = ? LIMIT 1`;
    try {
      const [results] = await this.connection.execute(query, [email]);
      return results[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  _validateUserData(userData) {
    let errors = {};
    let isOk = true;
    let passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (isEmptyOrNull(userData.first_name)) {
      errors.first_name = "First name is required";
      isOk = false;
    }

    if (isEmptyOrNull(userData.email)) {
      errors.email = "Email is required";
      isOk = false;
    }

    if (isEmptyOrNull(userData.password)) {
      errors.password = "Password is required";
      isOk = false;
    } else if (!passwordRegex.test(userData.password)) {
      errors.password =
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
      isOk = false;
    }

    return { isValid: isOk, errors };
  }

  _validateUserAddress(userAddressData) {
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
  }
}

export default Dao;
// module.exports = Dao;
