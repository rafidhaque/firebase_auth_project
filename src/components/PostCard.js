import React from "react";
import { View } from "react-native";
import { Card, Button, Text, Avatar, Divider } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PostCard = (props) => {
  let likes = "  Like (" + props.likes + ") ";
  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar
          containerStyle={{ backgroundColor: "#ffab91" }}
          rounded
          icon={{
            name: "envelope-open-o",
            type: "font-awesome",
            color: "black",
          }}
          activeOpacity={1}
        />
        <Text h4Style={{ padding: 10 }} h4>
          {props.author}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar
          containerStyle={{ backgroundColor: "#ffab91" }}
          rounded
          icon={{
            name: "user-circle-o",
            type: "font-awesome",
            color: "black",
          }}
          activeOpacity={1}
        />
        <Text style={{ fontStyle: "italic" }}> Written by: {props.title}</Text>
      </View>
      <Text
        style={{
          paddingVertical: 10,
        }}
      >
        {props.body}
      </Text>
    </Card>
  );
};

export default PostCard;
