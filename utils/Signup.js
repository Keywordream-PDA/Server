const axios = require("axios");
const { pool } = require("../database/connect/mariadb.js");
require('dotenv').config()

// 회원가입 처리 함수
async function signUp(userName) {
  let conn;
  try {
    conn = await pool.getConnection();

    // 이미 존재하는 사용자인지 확인
    const checkUserQuery = `SELECT COUNT(*) AS count FROM User WHERE name = ?;`;
    const [existingUser] = await conn.query(checkUserQuery, [userName]);
    if (existingUser.count > 0) {
      return "이미 존재하는 사용자입니다.";
    }

    // 사용자 등록
    const insertUserQuery = `INSERT INTO User (name) VALUES (?);`;
    await conn.query(insertUserQuery, [userName]);

    return "회원가입이 완료되었습니다.";
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = signUp;
