var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get().then((results) => {
        res.status(200).send(results);
      }).catch((error) => {
        res.status(404).send();
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      const { user, text, room } = req.body;
      models.messages.post(user, text, room).then(() => {
        res.status(201).send();
      }).catch((err) => {
        res.status(500).send();
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
      const { name } = req.body;
      models.users.post(name).then(() => {
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
      const { name } = req.body;
      models.rooms.post(name).then(() => {
        res.status(201).send();
      }).catch((error) => {
        res.status(500).send();
      });
    }
  }
};

