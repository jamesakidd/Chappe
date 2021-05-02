import { List, ListItem } from "@material-ui/core";
import Person from "@material-ui/icons/Person";

const UserList = (props) => {
  let users = props.users.map((user, idx) => {
    return (
      <ListItem key={idx} style={{ padding: "1px" }}>
        <Person
          style={{
            color: user.color,
            height: 18,
            width: 18,
            paddingRight: "10px",
          }}
        />
        {user.chatName} is in room {user.room}
      </ListItem>
    );
  });

  return <List>{users}</List>;
};
export default UserList;
