const axios = require("axios");
const { pool } = require("../database/connect/mariadb.js");
require('dotenv').config()

// 사용자의 nickName에 해당하는 모든 주식 정보를 가져오는 함수
async function getMyStocks(nickName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `
      SELECT s.stockCode, s.name, s.section, s.market
      FROM Mystock ms
      JOIN Stock s ON ms.stockCode = s.stockCode
      JOIN User u ON ms.userId = u.userId
      WHERE u.name = ?;`;

    const rows = await conn.query(query, [nickName]);
    console.log(rows)
    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}
  
// 새로운 주식 정보를 추가하는 함수
async function addMyStock(nickName, stockCode) {
  let conn;
  try {
    conn = await pool.getConnection();

    // 사용자 ID 가져오기
    const getUserIdQuery = `SELECT userId FROM User WHERE name = ?;`;
    const userRow = await conn.query(getUserIdQuery, [nickName]);
    if (!userRow){
      console.log('userId 조회 불가. 가입되어있는 유저인지 확인하세요.')
      return 'userId 조회 불가. 가입되어있는 유저인지 확인하세요.'
    }
    const userId = userRow[0].userId;
    
    // 주식 정보 추가
    const insertQuery = `INSERT INTO Mystock (stockCode, userId) VALUES (?, ?);`;
    const res = await conn.query(insertQuery, [stockCode, userId]);
    console.log(res)
    return "Stock added successfully.";
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

// 주식 정보를 삭제하는 함수
async function deleteMyStock(nickName, stockCode) {
    let conn;
    try {
      conn = await pool.getConnection();
      console.log(nickName, stockCode)
      // 사용자 ID 가져오기
      const getUserIdQuery = `SELECT userId FROM User WHERE name = ?;`;
      const userRow = await conn.query(getUserIdQuery, [nickName]);
      const userId = userRow[0].userId;
  
      // 주식 정보 삭제
      const deleteQuery = `DELETE FROM Mystock WHERE userId = ? AND stockCode = ?;`;
      const result = await conn.query(deleteQuery, [userId, stockCode]);
  
      if (result.affectedRows > 0) {
        return "Stock deleted successfully.";
      } else {
        return "No matching stock found for deletion.";
      }
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

module.exports = { getMyStocks, addMyStock, deleteMyStock };
