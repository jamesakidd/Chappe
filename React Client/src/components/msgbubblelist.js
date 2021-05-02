import { List } from "@material-ui/core";
import MsgBubble from "./msgbubble";

const MsgBubbleList = (props) => {
  const isUser = (from) => {
    return props.username === from;
  };

  let messages = props.messages.map((message, idx) => {
    return (
      <MsgBubble key={idx} message={message} isUser={isUser(message.from)} />
    );
  });

  return <List>{messages}</List>;
};

export default MsgBubbleList;
