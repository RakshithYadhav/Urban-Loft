
const connectionPromise = require("./connect");
const bcrypt = require("bcryptjs");
const { isEmptyOrNull } = require('../utils/StringUtil');
const { validateUserData, validateUserAddress } = require('../utils/ValidationUtil');
const saltRounds = 10;

/**
 * Data Access Object for database operations
 */
class Dao {
  constructor() {
    this.connectionPromise = connectionPromise;
  }

  async getConnection() {
    return await this.connectionPromise;
  }

  /**
   * Insert a new user into the database
   * @param {Object} userData - User data object
   * @param {string} userData.first_name - User's first name
   * @param {string} userData.last_name - User's last name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} Result object with success status and user_id or errors
   */
  async insertUser(userData) {
    const { isValid, errors } = validateUserData(userData);
    if (!isValid) {
      return { success: false, errors };
    }

    const query = `INSERT INTO user (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)`;
    const { first_name, last_name, email, password } = userData;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    try {
      const connection = await this.getConnection();
      const [result] = await connection.execute(query, [
        first_name,
        last_name,
        email,
        hashedPassword,
      ]);
      return { success: true, user_id: result.insertId };
    } catch (error) {
      console.error('Insert user operation failed:', error);
      return {
        success: false,
        errors: { general: "Insert user operation failed." },
      };
    }
  }

  /**
   * Insert user address into the database
   * @param {Object} userAddressData - Address data object
   * @param {string} userAddressData.address_line1 - Address line 1
   * @param {string} userAddressData.address_line2 - Address line 2
   * @param {string} userAddressData.city - City
   * @param {string} userAddressData.state - State
   * @param {string} userAddressData.postal_code - Postal code
   * @param {string} userAddressData.country - Country
   * @param {number} userId - User ID to associate the address with
   * @returns {Promise<Object>} Result object with success status and user_address_id or errors
   */
  async insertUserAddress(userAddressData, userId) {
    const { isValid, errors } = validateUserAddress(userAddressData);
    if (!isValid) {
      return { success: false, errors };
    }

    const query = `INSERT INTO user_address (user_id, address_line1, address_line2, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const { address_line1, address_line2, city, state, postal_code, country } = userAddressData;
    
    try {
      const connection = await this.getConnection();
      const [result] = await connection.execute(query, [
        userId,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
      ]);
      return { success: true, user_address_id: result.insertId };
    } catch (error) {
      console.error('Insert address operation failed:', error);
      return {
        success: false,
        errors: { general: "Insert address operation failed." },
      };
    }
  }

  /**
   * Get all products with optional pagination
   * @param {number} limit - Maximum number of products to return
   * @param {number} offset - Number of products to skip
   * @returns {Promise<Object>} Result object with success status and products array or errors
   */
  async getAllProducts(limit = 20, offset = 0) {
    const query = `
      SELECT p.product_id, p.name, p.description, p.price, p.image_url, p.available, p.created_at,
             i.stock_level
      FROM product p
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE p.available = 1
      ORDER BY p.created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(query);
      return { success: true, products: rows };
    } catch (error) {
      console.error('Get products operation failed:', error);
      return {
        success: false,
        errors: { general: "Failed to retrieve products." },
      };
    }
  }

  /**
   * Get a single product by ID
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Result object with success status and product data or errors
   */
  async getProductById(productId) {
    if (!productId || isNaN(productId)) {
      return { success: false, errors: { general: "Valid product ID is required" } };
    }

    const query = `
      SELECT p.product_id, p.name, p.description, p.price, p.image_url, p.available, p.created_at,
             i.stock_level, i.reorder_threshold
      FROM product p
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE p.product_id = ? AND p.available = 1
    `;
    
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(query, [productId]);
      
      if (rows.length === 0) {
        return { success: false, errors: { general: "Product not found" } };
      }

      return { success: true, product: rows[0] };
    } catch (error) {
      console.error('Get product by ID operation failed:', error);
      return {
        success: false,
        errors: { general: "Failed to retrieve product." },
      };
    }
  }

  /**
   * Get featured products for homepage
   * @param {number} limit - Maximum number of featured products to return
   * @returns {Promise<Object>} Result object with success status and products array or errors
   */
  async getFeaturedProducts(limit = 8) {
    const query = `
      SELECT p.product_id, p.name, p.description, p.price, p.image_url, p.available, p.created_at,
             i.stock_level
      FROM product p
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE p.available = 1 AND i.stock_level > 0
      ORDER BY p.created_at DESC
      LIMIT ${parseInt(limit)}
    `;
    
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(query);
      return { success: true, products: rows };
    } catch (error) {
      console.error('Get featured products operation failed:', error);
      return {
        success: false,
        errors: { general: "Failed to retrieve featured products." },
      };
    }
  }

  /**
   * Authenticate user login
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Result object with success status and user data or errors
   */
  async authenticateUser(email, password) {
    if (isEmptyOrNull(email) || isEmptyOrNull(password)) {
      return { success: false, errors: { general: "Email and password are required" } };
    }

    const query = `SELECT user_id, first_name, last_name, email, password_hash FROM user WHERE email = ?`;
    
    try {
      const connection = await this.getConnection();
      const [rows] = await connection.execute(query, [email]);
      
      if (rows.length === 0) {
        return { success: false, errors: { general: "Invalid email or password" } };
      }

      const user = rows[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

      if (!isPasswordValid) {
        return { success: false, errors: { general: "Invalid email or password" } };
      }

      const { password_hash, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Authentication failed:', error);
      return {
        success: false,
        errors: { general: "Authentication failed." },
      };
    }
  }

}

module.exports = Dao;
