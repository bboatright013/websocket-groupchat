/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username?");


/** called when connection opens, sends join info to server. */

ws.onopen = function(evt) {
  console.log("open", evt);

  let data = {type: "join", name: name};
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */

ws.onmessage = function(evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  }

  else if (msg.type === "chat") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  }
  /** custom for joke -bb */
  else if (msg.type === "joke") {
    item = $(`<li><i>${msg.text}</i></li>`);
  }
  /** custom for memberlist -bb */
  else if (msg.type === "members") {
    item = $(`<li><i>In room: ${msg.text}</i></li>`);
  }
  else {
    return console.error(`bad message: ${msg}`);
  }

  $('#messages').append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** send message when button pushed. original version */

// $('form').submit(function (evt) {
//   evt.preventDefault();

//   let data = {type: "chat", text: $("#m").val()};
//   ws.send(JSON.stringify(data));

//   $('#m').val('');
// });

/** my version -bb */
$('form').submit(function (evt) {
  evt.preventDefault();
  let checkAgainst = $("#m").val();
  if(checkAgainst === '/joke'){
    let data = {type: "joke"};
    ws.send(JSON.stringify(data));

  }
  else if(checkAgainst === '/members'){
    let data = {type: "members"};
    ws.send(JSON.stringify(data));
  }
  else {
    let data = {type: "chat", text: $("#m").val()};
    ws.send(JSON.stringify(data));

  }

  $('#m').val('');
});