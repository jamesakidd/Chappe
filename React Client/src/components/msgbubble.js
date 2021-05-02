import { useEffect, useRef } from "react";
import { ListItem } from "@material-ui/core";
import Bubble from "./bubble";
import Triangle from "./triangle";

const MsgBubble = (props) => {
  const userRef = useRef(null);
  useEffect(() => {
    userRef.current.scrollIntoView(true);
  }, []);

  return (
    <div className={props.isUser ? "listRight" : "listLeft"}>
      <ListItem ref={userRef}>
        <Bubble message={props.message} />
        <Triangle
          color={props.message.color}
          alignTriangle={props.isUser ? `63%` : ""}
        />
      </ListItem>
      <p></p>
    </div>
  );
};

export default MsgBubble;
