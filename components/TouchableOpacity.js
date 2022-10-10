import { useState } from "react";

const TouchableOpacity = (props) => {
  const [touched, setTouched] = useState(false);
  return (
    <button
      // className={props.className}
      onMouseDown={() => {
        setTouched(!touched);
        props.onPress();
      }}
      onMouseUp={() => {
        setTimeout(() => {
          setTouched(false);
        }, 100);
      }}
      style={
        touched
          ? {
              opacity: 0.5,
              border: "none",
              outline: "none",
              cursor: "pointer",
              ...props.style,
            }
          : {
              opacity: 1,
              border: "none",
              outline: "none",
              cursor: "pointer",
              transition: "opacity 150ms ease",
              ...props.style,
            }
      }
    >
      {props.children}
    </button>
  );
};

export default TouchableOpacity;
