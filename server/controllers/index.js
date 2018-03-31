var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      console.log('called get')
      models.messages.get().then((results) => {
        res.status(200).send(results);
      }).catch((error) => {
        res.status(404).send();
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      const { username, text, roomname } = req.body;
      models.users.checkIfUserExists(username).then(() => {
        models.rooms.checkIfRoomExists(roomname).then(() => {
          models.messages.post(username, text, roomname).then(() => {
            res.status(201).send();
          }).catch((err) => {
            res.status(500).send();
          });
        });
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get().then((results) => {
        res.status(200).send(results);
      }).catch((error) => {
        res.status(404).send();
      });
    },
    post: function (req, res) {
      const { username } = req.body;
      models.users.checkIfUserExists(username).then(() => {
        res.status(201).send();
      }).catch(() => {
        res.status(500).send();
      });
    }
  },

  rooms: {
    // Ditto as above
    get: function (req, res) {
      models.rooms.get().then((results) => {
        res.status(200).send(results);
      }).catch((error) => {
        res.status(404).send();
      });
    },
    post: function (req, res) {
      const { roomname } = req.body;
      models.rooms.checkIfRoomExists(roomname).then(() => {
        res.status(201).send();
      }).catch((error) => {
        res.status(500).send();
      });
    }
  }
};

