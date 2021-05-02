import { useReducer, useEffect } from "react";
import Telegram from "@material-ui/icons/Telegram";
import io from "socket.io-client";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  RadioGroup,
  Radio,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  Card,
  CardContent,
} from "@material-ui/core";
import theme from "../theme";
import TopBar from "./topbar";
import "../App.css";
import MsgBubbleList from "./msgbubblelist";
import UserList from "./userlist";

const Chappe = () => {
  const initialState = {
    messages: [],
    status: "",
    showjoinfields: true,
    alreadyexists: false,
    chatName: "",
    roomName: "",
    typingMsg: "",
    isTyping: false,
    message: "",
    dialogOpen: false,
    rooms: [],
    users: [],
    userRooms: [],
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {    
    serverConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //-------------------------------------------------- SOCKET SERVER CONNECT --------------------------------------------------
  const serverConnect = () => {
    // connect to server
    //const socket = io.connect("localhost:5000", { forceNew: true });
    const socket = io();
    socket.on("nameexists", onExists);
    socket.on("welcome", addMessage);
    socket.on("someonejoined", addMessage);
    socket.on("someoneleft", addMessage);
    socket.on("someoneistyping", onTyping);
    socket.on("newmessage", onNewMessage);
    socket.on("updateUsersRooms", updateUsersRooms);
    setState({ socket: socket});
  };
  //---------------------------------------------------------------------------------------------------------------------------

  //--------------------------------------------------SOCKET EMIT HANDLERS-----------------------------------------------------

  const updateUsersRooms = (dataFromServer) => {
    let users = dataFromServer.map((user) => user.chatName);

    let rooms = dataFromServer
      .map((data) => data.room)
      .filter((value, index, self) => self.indexOf(value) === index);
   
     if(!rooms.includes("Main"))
        rooms.push("Main");

    setState({ users: users, rooms: rooms, userRooms: dataFromServer });
  };

  const onExists = (dataFromServer) => {
    setState({ status: dataFromServer.text });
  };

  const addMessage = (dataFromServer) => {
    let messages = state.messages;
    messages.push(dataFromServer);
    setState({
      messages: messages,
      showjoinfields: false,
      alreadyexists: false,
    });
  };

  const onTyping = (dataFromServer) => {
    if (dataFromServer.from !== state.chatName) {
      setState({
        typingMsg: dataFromServer.text,
      });
    }
  };

  const onNewMessage = (dataFromServer) => {
    addMessage(dataFromServer);
    setState({ typingMsg: ""});
  };

  //---------------------------------------------------------------------------------------------------------------------------

  //-------------------------------------------------------UI HANDLERS---------------------------------------------------------

  // handler for join button click
  const handleJoin = () => {
    state.socket.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
  };

  // keypress handler for message TextField
  const onMessageChange = (e) => {
    setState({ message: e.target.value });
    if (state.isTyping === false) {
      state.socket.emit("typing", { from: state.chatName }, (err) => {});
      setState({ isTyping: true }); // flag first byte only
    } else {
      if (e.target.value === "") {
        setState({ isTyping: false });
        state.socket.emit("notTyping", { from: state.chatName }, (err) => {});
      }
    }
  };

  // handler for name TextField entry
  const onNameChange = (e) => {
    setState({ chatName: e.target.value, status: "" });
  };

  // handler for room TextField entry
  const onRoomChange = (e) => {
    setState({ roomName: e.target.value });
  };

  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.message !== "") {
      state.socket.emit(
        "message",
        { from: state.chatName, text: state.message },
        (err) => {}
      );
      setState({ isTyping: false, message: ""  });
    }
  };

  const handleOpenDialog = () => setState({ dialogOpen: true });
  const handleCloseDialog = () => setState({ dialogOpen: false });
  const handleRadioChange = (e) => setState({ roomName: e.target.value });

  //---------------------------------------------------------------------------------------------------------------------------

  //==========================================================- JSX -==========================================================

  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <TopBar
          viewDialog={handleOpenDialog}
          isLogin={state.showjoinfields}
          room={state.roomName}
        />

        <Dialog
          open={state.dialogOpen}
          onClose={handleCloseDialog}
          style={{ margin: 20 }}
        >
          <DialogTitle style={{ textAlign: "center" }}>Users</DialogTitle>
          <DialogContent>
            <UserList users={state.userRooms} />
          </DialogContent>
        </Dialog>
      </div>

      {/* SIGN IN SCREEN START */}
      {state.showjoinfields && (
        <div>
          <div
            style={{
              border: "solid",
              borderWidth: 1,
              borderRadius: 16,
              textAlign: "center",
              padding: "3vw",
              margin: "3vw",
            }}
          >
            <Telegram color="primary" style={{ height: 100, width: 100 }} />
            <div className="myHeader">Sign In</div>
            <div style={{ textAlign: "left" }}>
              <TextField
                style={{ width: "100%" }}
                onChange={onNameChange}
                placeholder="Enter unique name"
                autoFocus={true}
                required
                value={state.chatName}
                error={state.status !== ""}
                helperText={state.status}
              />{" "}
            </div>
          </div>
          <p></p>
          <div
            style={{
              border: "solid",
              borderWidth: 0.5,
              borderRadius: 16,
              textAlign: "center",
              padding: "3vw",
              margin: "3vw",
            }}
          >
            <div className="myHeader">Join or Create Room</div>
            <div style={{ textAlign: "left" }}>
              <FormControl component="fieldset">
                <RadioGroup onChange={handleRadioChange}>

                  {/* {state.rooms.length === 0 && (
                    

                  )} */}


                  {state.rooms.map((room, idx) => (
                    <FormControlLabel
                      key={idx}
                      labelPlacement="start"
                      value={room}
                      control={<Radio />}
                      label={room}
                    />
                  ))}




                </RadioGroup>
              </FormControl>

              <TextField
                style={{ width: "100%" }}
                onChange={onRoomChange}
                placeholder="Enter room name"
                required
                value={state.roomName}
              />
            </div>
          </div>
          <p></p>
          <Button
            variant="contained"
            data-testid="submit"
            color="secondary"
            style={{ marginLeft: "3%", fontWeight: "bold" }}
            onClick={() => handleJoin()}
            disabled={state.chatName === "" || state.roomName === "" || /^\s+$/.test(state.chatName) || /^\s+$/.test(state.roomName)}
          >
            Join
          </Button>
        </div>
      )}

      {/* SIGN IN SCREEN END */}

      {!state.showjoinfields && (
        <Card style={{ margin: "2.5%", width: "95%" }}>
          <CardContent style={{ textAlign: "center" }}>
            {state.messages && (
              <div className="msgList">
                <MsgBubbleList
                  messages={state.messages}
                  username={state.chatName}
                />
              </div>
            )}
            <div>
              <Typography color="primary">{state.typingMsg}</Typography>
            </div>
          </CardContent>
        </Card>
      )}

      {!state.showjoinfields && (
        <div className="bottom">
          <TextField
            style={{ width: "95%" }}
            onChange={onMessageChange}
            placeholder="Send"
            autoFocus={true}
            value={state.message}
            onKeyPress={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
          />
        </div>
      )}
    </MuiThemeProvider>
  ); //return
};
export default Chappe;
