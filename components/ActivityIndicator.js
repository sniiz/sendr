import { View, Image, Animated, Easing } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
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

export default function ActivityIndicator({ size, color }) {
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(spin, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        // Animated.timing(spin, {
        //   toValue: 0,
        //   duration: 1000,
        //   useNativeDriver: true,
        // }),
      ])
    ).start();
  }, []);

  const spinny = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        transform: [{ rotate: spinny }],
      }}
    >
      <SimpleLineIcons name="disc" size={size} color={color} />
    </Animated.View>
  );
}
