import { View, Image, Animated, Easing, Text } from "react-native";
// import { SimpleLineIcons } from "@expo/vector-icons";
import * as Icon from "react-native-feather";
import React from "react";

// export default class ActivityIndicator extends React.PureComponent {
//   // aaa
//   componentDidMount() {
//     this.spin = new Animated.Value(0);
//     Animated.loop(
//       Animated.timing(this.spin, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       })
//     ).start();
//     this.spinny = this.spin.interpolate({
//       inputRange: [0, 1],
//       outputRange: ["0deg", "360deg"],
//     });
//   }
//   render() {
//     return (
//       <Animated.View
//         style={[this.props.style, { transform: [{ rotate: this.spinny }] }]}
//       >
//         <SimpleLineIcons
//           name="refresh"
//           size={this.props.size}
//           color={this.props.color}
//         />
//       </Animated.View>
//     );
//   }
// }

const spin = new Animated.Value(0);

const slash = ["|", "/", "-", "\\"];
const dots = [".˙", "··", "˙."];
const dots2 = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
// we're open to more potential loading animations!!
// you can always open a pr on github to add your own
// maybe we'll make your animation the default one!

const animation = slash;
const interval = 90;

export default function ActivityIndicator({ size, color, style }) {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    setTimeout(() => {
      setStep((step) => (step + 1) % animation.length);
    }, interval);
  }, [step]);
  // React.useEffect(() => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(spin, {
  //         toValue: 1,
  //         duration: 1000,
  //         useNativeDriver: true,
  //         easing: Easing.elastic(1),
  //       }),
  //       // Animated.timing(spin, {
  //       //   toValue: 0,
  //       //   duration: 1000,
  //       //   useNativeDriver: true,
  //       //   easing: Easing.elastic(5),
  //       // }),
  //     ])
  //   ).start();
  // }, []);

  // const spinny = spin.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["0deg", "360deg"],
  // });

  return (
    <Animated.View
      style={[
        // {
        //   transform: [{ rotate: spinny }],
        // },
        style,
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
