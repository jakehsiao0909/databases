var db = require('../db');
const { connection } = require('../db/index');
const moment = require('moment');

module.exports = {
  messages: {
    get: function () {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM messages', (err, results, fields) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    }, // a function which produces all the messages
    post: function (user, text, room) {
      return new Promise((resolve, reject) => {
        const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        const updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
        connection.query(`SELECT id FROM users WHERE users.name = '${user}'`, (err, results, fields) => {
          if (err) reject(err);
          const user_id = results[0].id;
          connection.query(`SELECT id FROM rooms WHERE rooms.name = '${room}'`, (err, results, fields) => {
            if (err) reject(err);
            const room_id = results[0].id;
            connection.query(`INSERT INTO messages 
                            (created_at, updated_at, text, user_id, room_id) 
                            VALUES ('${created_at}', '${updated_at}', '${text}', '${user_id}', '${room_id}')`, 
                            (err, results, fields) => {
              if (err) reject(err);
              resolve();                  
            });
          });
        });
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users', (err, results, fields) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    },
    post: function (name) {
      return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO users (name) VALUES ('${name}')`, (err, results, fields) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
  },
  rooms: {
    // Ditto as above.
    get: function () {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM rooms', (err, results, fields) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    },
    post: function (name) {
      return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO rooms (name) VALUES ('${name}')`, (err, results, fields) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
  }
};

