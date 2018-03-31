var db = require('../db');
const { connection } = require('../db/index');
const moment = require('moment');

module.exports = {
  messages: {
    get: function () {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT m.created_at, m.updated_at, m.text, u.username, r.roomname FROM users u 
                          INNER JOIN messages m ON u.id = m.user_id 
                          INNER JOIN rooms r ON r.id = m.room_id`, 
                          (err, results, fields) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    }, // a function which produces all the messages
    post: function (username, text, roomname) {
      return new Promise((resolve, reject) => {
        const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        const updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
        connection.query(`SELECT id FROM users WHERE users.username = '${username}'`, (err, results, fields) => {
          if (err) reject(err);
          const user_id = results[0].id;
          connection.query(`SELECT id FROM rooms WHERE rooms.roomname = '${roomname}'`, (err, results, fields) => {
            if (err) reject(err);
            const room_id = results[0].id;
            connection.query(`INSERT INTO messages 
                            (created_at, updated_at, text, user_id, room_id) 
                            VALUES ('${created_at}', '${updated_at}', "${text}", "${user_id}", "${room_id}")`, 
                            (err, results, fields) => {
              if (err) {
                reject(err);
              }
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
    getUserById: function(id) {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT username FROM users WHERE id = '${id}'`, (err, results, fields) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    },
    checkIfUserExists: function(username) {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users WHERE username = '${username}'`, (err, results, fields) => {
          if (err) reject(err);
          if ( !results || results.length === 0) {
            module.exports.users.post(username).then(() => resolve());
          }
          resolve();
        })
      });
    },
    post: function (username) {
      return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO users (username) VALUES ('${username}')`, (err, results, fields) => {
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
    getRoomById: function(id) {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT roomname FROM rooms WHERE id = '${id}'`, (err, results, fields) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    },
    checkIfRoomExists: function(roomname) {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM rooms WHERE roomname = '${roomname}'`, (err, results, fields) => {
          if (err) reject(err);
          if ( !results || results.length === 0) {
            module.exports.rooms.post(roomname).then(() => resolve());
          }
          resolve();
        })
      });
    },
    post: function (roomname) {
      return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO rooms (roomname) VALUES ('${roomname}')`, (err, results, fields) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
  }
};

