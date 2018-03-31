const Message = function({username, text, roomname, createdAt = new Date(), updatedAt = new Date()}) {
  this.username = xssFilters.inHTMLData(username);
  this.text = xssFilters.inHTMLData(text);
  this.roomname = xssFilters.inHTMLData(roomname);
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
  this.createdTimeStamp = moment(createdAt).fromNow();
  this.updatedTimeStamp = moment(updatedAt).fromNow();

};

Message.prototype.render = function() {
  const $message = $(`<div data='${this.username}' class="username ${this.username} chat">` + 
                        `<h3><span>${this.username}</span></h3>` + 
                        `<p>${this.text}</p>` + 
                        `<p class="time">Created at: ${this.createdTimeStamp}</p>` +
                        `<p class="time">Last updated at: ${this.updatedTimeStamp}</p>` +
                      `</div>`);
  $('.username').on('click', function(e) {
    const user = $(this).find('span').text();
    // console.log('click');
    // console.log(user);
    $(`.${user}`).addClass('friend');
    app.handleUsernameClick(user);
  });

  $('#chats').prepend($message);
};

