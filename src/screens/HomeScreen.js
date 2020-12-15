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
import * as firebase from "firebase";
import "firebase/firestore";

const HomeScreen = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [headline, setHeadline] = useState("");

  const loadPosts = async () => {
    firebase
      .firestore()
      .collection("posts")
      .orderBy("created_at", "desc")
      .onSnapshot((querySnapshot) => {
        let temp_posts = [];
        querySnapshot.forEach((doc) => {
          temp_posts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPosts(temp_posts);
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    loadPosts();
  }, []);

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
            centerComponent={{ text: "Our Blog", style: { color: "#fff" } }}
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
                setInput(currentText);
              }}
            />
            <Button
              title="Post"
              type="outline"
              onPress={function () {
                let post_details = {
                  headline: headline,
                  author: auth.CurrentUser.displayName,
                  post: input,
                  created_at: firebase.firestore.Timestamp.now(),
                  likes: [],
                  comments: [],
                };
                firebase
                  .firestore()
                  .collection("posts")
                  .add(post_details)
                  .then(() => {
                    alert("Post created successfully!");
                  })
                  .catch((error) => {
                    alert(error);
                  });
              }}
            />
          </Card>
          <FlatList
            data={posts}
            renderItem={function ({ item }) {
              return (
                <PostCard
                  author={item.data.headline}
                  title={item.data.author}
                  body={item.data.post}
                  likes={item.data.likes}
                />
              );
            }}
          />
        </View>
      )}
    </AuthContext.Consumer>
  );
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
