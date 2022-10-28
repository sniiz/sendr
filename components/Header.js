import FeatherIcon from "feather-icons-react";
import TouchableOpacity from "./TouchableOpacity";

const Header = (props) => {
  return (
    <div
      style={{
        background: "rgba(10, 10, 11, 0.2)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "flex-start",
        justifyContent: "space-evenly",
        width: "100vw",
        zIndex: "10000",
        position: "fixed",
        top: 0,
        padding: "10px",
        borderBottom: "1px solid #f4f5f5",
        // border: "2px solid #f4f5f5",
      }}
    >
      {props.left}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {props.hideArrow ? null : (
            <TouchableOpacity
              onPress={() => {
                props.router.back();
                // alert("wow i am functional");
              }}
              style={{
                backgroundColor: "#00000000",
              }}
            >
              <FeatherIcon icon="chevron-left" />
            </TouchableOpacity>
          )}
        </div>
        <h1
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
            fontWeight: "900",
            fontSize: "18px",
            color: "#f4f5f5",
            // justifySelf: "center",
          }}
        >
          {props.title}
        </h1>
      </div>
      {props.right}
    </div>
  );
};

export default Header;
