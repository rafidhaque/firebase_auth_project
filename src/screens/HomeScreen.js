import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Card,
  Button,
  Text,
  Avatar,
  Input,
  Header,
} from "react-native-elements";
import PostCard from "./../components/PostCard";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { AuthContext } from "../providers/AuthProvider";
import { storeData } from "./../functions/AsyncStorageFunctions";
import { AsyncStorage } from "react-native";

const HomeScreen = (props) => {
  let posts_list = [];
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [headline, setHeadline] = useState("");

  const getData = async (key) => {
    var value, collect;
    try {
      value = await AsyncStorage.getItem(key).then((values) => {
        collect = values;
        console.log("Then: ", values);
      });
    } catch (error) {
      console.log("Error: ", error);
    }
    console.log("Final: ", value);
    return collect;
  };

  function loadposts_list() {
    getData("posts_list").then((filter) => {
      if (filter != null) {
        console.log("returned filter:", filter);
        console.log(typeof filter);
        filter = JSON.parse(filter);
        console.log(filter);
        console.log(typeof filter);
        return filter;
      } else console.log("error");
    });
  }

  useEffect(() => {
    posts_list = loadposts_list();
  }, []);

  if (!loading) {
    return (
      <AuthContext.Consumer>
        {(auth) => (
          <View style={styles.viewStyle}>
            <Header
              leftComponent={{
                icon: "menu",
                color: "#fff",
                onPress: function () {
                  props.navigation.toggleDrawer();
                },
              }}
              centerComponent={{ text: "The Office", style: { color: "#fff" } }}
              rightComponent={{
                icon: "lock-outline",
                color: "#fff",
                onPress: function () {
                  auth.setIsLoggedIn(false);
                  auth.setCurrentUser({});
                },
              }}
            />
            <Card>
              <Input
                placeholder="Headline"
                onChangeText={function (currentText) {
                  setHeadline(currentText);
                }}
              />
              <Input
                placeholder="What's On Your Mind?"
                onChangeText={function (currentText) {
                  setPost(currentText);
                }}
              />
              <Button
                title="Post"
                type="outline"
                onPress={function () {
                  alert(post);
                  let post_details = {
                    headline: headline,
                    author: auth.CurrentUser.name,
                    post: post,
                    likes: 0,
                  };
                  posts_list.push(post_details);
                  alert(posts_list);
                  posts_list = JSON.stringify(posts_list);
                  alert(posts_list);
                  storeData("posts_list", posts_list);
                  props.navigation.navigate("Home");
                }}
              />
            </Card>
            <FlatList
              data={posts_list}
              renderItem={function ({ item }) {
                return (
                  <PostCard
                    author={item.author}
                    title={item.headline}
                    body={item.post}
                  />
                );
              }}
            />
          </View>
        )}
      </AuthContext.Consumer>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="red" animating={true} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "blue",
  },
  viewStyle: {
    flex: 1,
  },
});

export default HomeScreen;
