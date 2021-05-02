const moment = require("moment-timezone");

const adminColor = `#615e55`;
let currentUsers = [];

const handleJoin = (userData, socket, io) => {
  if (
    currentUsers.find((u) => u.chatName === userData.chatName) === undefined
  ) {
    socket.name = userData.chatName;
    socket.room = userData.roomName;
    socket.color = getRandomColor();
    currentUsers.push({
      chatName: userData.chatName,
      room: userData.roomName,
      color: socket.color,
    });
    socket.join(userData.roomName);
    console.log(`${userData.chatName} has joined ${userData.roomName}`);

    socket.emit("welcome", {
      text: `Welcome ${userData.chatName}`,
      color: adminColor,
      from: "Admin",
      time: moment().tz("America/Toronto").format("LTS"),
    });

    socket.to(userData.roomName).emit("someonejoined", {
      text: `${userData.chatName} has joined the ${userData.roomName} room!`,
      color: adminColor,
      from: "Admin",
      time: moment().tz("America/Toronto").format("LTS"),
    });

    io.emit("updateUsersRooms", currentUsers);
  } else {
    socket.emit("nameexists", {
      text: `Name already taken, try a different name.`,
    });
  }
};

const handleDisconnect = (socket, io) => {
  currentUsers = currentUsers.filter((u) => u.chatName !== socket.name);
  socket.to(socket.room).emit("someoneleft", {
    text: `${socket.name} has left room ${socket.room}`,
    color: adminColor,
    from: "Admin",
    time: moment().tz("America/Toronto").format("LTS"),
  });

  io.emit("updateUsersRooms", currentUsers);
  console.log(`${socket.name} disconnected`);
}; //handledisconnect

const handleTyping = (socket) => {
  socket.to(socket.room).emit("someoneistyping", {
    text: `${socket.name} is typing...`,
  });
};

const handleNotTyping = (socket) => {
  socket.to(socket.room).emit("someoneistyping", {
    text: "",
  });
};

const handleMessage = (io, socket, message) => {
  io.in(socket.room).emit("newmessage", {
    text: message.text,
    from: message.from,
    color: socket.color,
    time: moment().tz("America/Toronto").format("LTS"),
  });
};

const getRandomColor = () => {
  // random colour generator from material design colour file
  const matColours = require("./matdes100colours.json");
  let coloridx = Math.floor(Math.random() * matColours.colours.length) + 1;
  return matColours.colours[coloridx];
};

const updateUserRooms = (io) => io.emit("updateUsersRooms", currentUsers);

module.exports = {
  handleJoin,
  handleDisconnect,
  handleTyping,
  handleMessage,
  handleNotTyping,
  updateUserRooms,
};
