import "../App.css";

const Bubble = (props) => {
  return (
    <div className="msgBubble" style={{ backgroundColor: props.message.color }}>
      <div style={{ fontSize: "smaller" }}>
        {props.message.from} says:
        <div
          style={{ textAlign: "right", float: "right", paddingLeft: "50px" }}
        >
          {props.message.time}
        </div>
      </div>
      <div style={{ fontWeight: "bold", padding: "1%", marginTop: "5%" }}>
        {props.message.text}
      </div>
    </div>
  );
};

export default Bubble;
