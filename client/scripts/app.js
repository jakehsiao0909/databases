// YOUR CODE HERE:

var app = {
    messages: [],
    friends: [],
    server: 'http://localhost:3000/classes/messages',
    rooms: [],
    init: function(){
      $('#textMessage').focus();
      $('#send').on('click', function(e) {
        e.preventDefault();
        const $message = $('#textMessage').val();
        const $roomVal = $('#newRoom').val();
        if ($roomVal) {
          app.handleSubmit($message, $roomVal);
        } else {
          app.handleSubmit($message);
        }
        $('#newRoom').val("");
        $('#textMessage').val("").focus();
      }); 

      $('#roomSelect').on('change', function(e) {
        e.preventDefault();
        app.clearMessages();
        app.fetchRoom($('#roomSelect').val());
      });

      $('#clearMessages').on('click', function(e) {
        e.preventDefault();
        app.clearMessages();
      });

      this.fetch();
    },

  send: function(message) {
    const server = this.server;

    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() {
    const server = this.server;
    $('#roomSelect').children().remove();
    const onSuccess = function (data) {
      this.messages = data.results.reverse();
      app.rooms = this.messages.reduce((rooms, message) => {
        if (rooms.includes(xssFilters.inHTMLData(message.roomname))) return rooms;
        rooms.push(xssFilters.inHTMLData(message.roomname));
        return rooms;
      }, []);
      app.rooms.forEach(room => { this.renderRoom(room) });
      this.renderAllMessages();
      app.friends.forEach(buddy => {
        $(`.${buddy}`).addClass('friend');
      });
    };
    $.ajax({url: server,
      type: 'GET',
      data: {
        order: '-updatedAt'
      },
      contentType: 'application/json',
      success: onSuccess.bind(this),
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get messages', data);
      }});
  },

  fetchRoom: function(room = 'lobby') {
    const server = this.server;
    const onSuccess = function (data) {
      this.messages = data.results.reverse();
      this.renderAllMessages(); 
    };
    $.ajax({url: server,
      type: 'GET',
      data: {
        order: '-updatedAt',
        where: {
          roomname: room
        }
      },
      contentType: 'application/json',
      success: onSuccess.bind(this),
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get messages', data);
      }});
  },

  renderAllMessages: function() {
    this.messages.forEach(message => {
      this.renderMessage(message);
    });
  },

  clearMessages: function() {
    $('#chats').children().remove();
  },

  /**
   * @param {Message} message is the message to be rendered.
   * @description Creates a new Message component and renders it to the DOM.
   */
  renderMessage: function(message) {
    const messageComponent = new Message(message);
    messageComponent.render();
  },

  /**
   * @param {String} roomName is the name of the room to be created.
   * @description This new room is added to the dropdown.
   */

  renderRoom: function(roomName) {
    $('#roomSelect').append(`<option value=${roomName}>${roomName}</option>`);
  },

  /**
   * @param {String} username is your new buddy, guy.
   * @description 
   */
  handleUsernameClick: function(username) {
      this.friends.push(username);
  },

  /**
   * @param {String} rawMessage is the unsanitized message from the user.
   * @description Sanitizes the message and POSTs it to the server.
   */
  handleSubmit: function(rawMessage, roomName = $('#roomSelect').val()) {
    const location = window.location.search;
    const sanitizedMessage = xssFilters.inHTMLData(rawMessage);
    const sanitizedUsername = xssFilters.inHTMLData(location.slice(location.indexOf('=') + 1));
    const sanitzedRoom = xssFilters.inHTMLData(roomName);
    const messageObject = {
      text: sanitizedMessage,
      username: sanitizedUsername,
      roomname: sanitzedRoom
    };
    this.send(messageObject);
    this.fetch();
  }
};

  /**
   * @function sanitizeAndRetrieveMessages
   * @param {Array} messagesFromServer Array of messages from the Parse Server
   * @description It will run the messages from the parse server through the XSS filter
   * and return the sanitized messages. This will sanitize username, text, and roomname
   * for each message.
   * @returns Returns sanitized messages
   */

// const sanitizeAndRetrieveMessages = function(messagesFromServer) {
//   return messagesFromServer.map(message => {
//     const username = xssFilters.inHTMLData(message.username);
//     const text = xssFilters.inHTMLData(message.text);
//     const roomname = xssFilters.inHTMLData(message.roomname);
//     return Object.assign({}, message, {username, text, roomname});
//   });
// };

