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
  const [posts_list, setPosts_list] = useState([]);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [headline, setHeadline] = useState("");

  const getData = async (key) => {
    var value, collect;
    try {
      value = await AsyncStorage.getItem(key).then((values) => {
        collect = values;
        // console.log("Then: ", values);
      });
    } catch (error) {
      console.log("Error: ", error);
    }
    // console.log("Final: ", value);
    return collect;
  };

  async function loadposts_list(posts_list) {
    await getData("posts_list").then((filter) => {
      if (filter != null) {
        // console.log("returned filter:", filter);
        // console.log(typeof filter);
        filter = JSON.parse(filter);
        // console.log(filter);
        // console.log(typeof filter);
        posts_list = filter;
      } else console.log("error");
    });
  }

  useEffect(() => {
    getData("posts_list").then((filter) => {
      if (filter != null) {
        filter = JSON.parse(filter);
        setPosts_list(filter);
      } else console.log("error");
    });
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
                  let post_details = {
                    headline: headline,
                    author: auth.CurrentUser.name,
                    post: post,
                    likes: 0,
                  };
                  let temp_list = posts_list;
                  temp_list.push(post_details);
                  temp_list = JSON.stringify(temp_list);
                  storeData("posts_list", temp_list);
                  props.navigation.navigate("Home");
                }}
              />
            </Card>
            <FlatList
              data={posts_list}
              renderItem={function ({ item }) {
                return (
                  <PostCard
                    author={item.headline}
                    title={item.author}
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
