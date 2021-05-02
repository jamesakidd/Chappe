import SupervisorAccount from "@material-ui/icons/SupervisorAccount";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";

const TopBar = (props) => {
  const onIconClicked = () => props.viewDialog(); // notify the parent

  return (
    <AppBar position="static">
      <Toolbar color="primary" title="Chappe">
        <Typography variant="h6" color="inherit">
          Chappe {!props.isLogin && <span>- {props.room}</span>}
        </Typography>
        <section style={{ height: 90, width: 90, marginLeft: "auto" }}>
          {!props.isLogin && (
            <IconButton onClick={onIconClicked}>
              <SupervisorAccount
                style={{ color: "white", height: 70, width: 70 }}
              />
            </IconButton>
          )}
        </section>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
