import { Animated, Text } from "react-native";
// import { SimpleLineIcons } from "@expo/vector-icons";
import React from "react";

const slash = ["|", "/", "-", "\\"];
const dots = [".˙", "··", "˙."];
const dots2 = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
// we're open to more potential loading animations!!
// you can always open a pr on github to add your own
// maybe we'll make your animation the default one!

const animation = slash;
const interval = 100;

export default function ActivityIndicator({ size, color, style }) {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const spin = setInterval(() => {
      setStep((step) => (step + 1) % animation.length);
    }, interval);
    return () => clearInterval(spin);
  }, []);

  return (
    <Animated.View
      style={[
        // {
        //   transform: [{ rotate: spinny }],
        // },
        style,
        {
          width: size,
          height: size,
        },
      ]}
    >
      {/* <SimpleLineIcons name="disc" size={size} color={color} /> */}
      {/* <Icon.Minus width={size} color={color} strokeWidth={2} /> */}
      <Text
        style={{
          fontSize: size,
          color: color,
          fontWeight: "600",
          fontFamily: "monospace",
        }}
      >
        {animation[step]}
      </Text>
    </Animated.View>
  );
}
