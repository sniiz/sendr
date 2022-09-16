// TODO
import * as rn from "react-native";
import React from "react";

export class Text extends React.PureComponent {
  render() {
    if (rn.Platform.OS === "android") {
      const fonts = {
        100: "Roboto_100Thin",
        200: "Roboto_100Thin",
        300: "Roboto_300Light",
        400: "Roboto_400Regular",
        500: "Roboto_500Medium",
        600: "Roboto_500Medium",
        700: "Roboto_700Bold",
        800: "Roboto_700Bold",
        900: "Roboto_900Black",
        normal: "Roboto_400Regular",
        bold: "Roboto_700Bold",
      };
      var props = this.props;
      delete props.style.fontStyle;
      props.style.fontFamily = fonts[props.style.fontWeight];
      delete props.style.fontWeight;
      return <rn.Text style={[props.style]}>{props.children}</rn.Text>;
    } else {
      return (
        <rn.Text style={this.props.style || {}}>{this.props.children}</rn.Text>
      );
    }
  }
}
