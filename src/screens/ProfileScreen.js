import React, { useState, useEffect } from "react";
import { View, StyleSheet, AsyncStorage, FlatList } from "react-native";
import { Text, Card, Button, Avatar, Header } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import PostCard from "./../components/PostCard";
import * as firebase from "firebase";

const ProfileScreen = (props) => {
  const [posts_list, setPosts_list] = useState([]);

  const getData = async (key) => {
    var value, collect;
    try {
      value = await AsyncStorage.getItem(key).then((values) => {
        collect = values;
      });
    } catch (error) {
      console.log("Error: ", error);
    }
    return collect;
  };

  useEffect(() => {
    getData("posts_list").then((filter) => {
      if (filter != null) {
        filter = JSON.parse(filter);
        setPosts_list(filter);
      } else console.log("error");
    });
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
            centerComponent={{
              text: auth.CurrentUser.name + "'s Profile Page",
              style: { color: "#fff" },
            }}
            rightComponent={{
              icon: "lock-outline",
              color: "#fff",
              onPress: function () {
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    auth.setIsLoggedIn(false);
                    auth.setCurrentUser({});
                  })
                  .catch((error) => {
                    alert(error);
                  });
              },
            }}
          />
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ paddingHorizontal: 10 }}>
                Name: {auth.CurrentUser.name} Contact: {auth.CurrentUser.email}
              </Text>
            </View>
          </Card>

          <Card>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ paddingHorizontal: 10 }}>
                {auth.CurrentUser.name}'s Blog Posts:
              </Text>
            </View>
          </Card>

          <FlatList
            data={posts_list.reverse()}
            renderItem={function ({ item }) {
              if (item.author == auth.CurrentUser.name) {
                return (
                  <PostCard
                    author={item.headline}
                    title={item.author}
                    body={item.post}
                    likes={item.likes}
                  />
                );
              }
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

export default ProfileScreen;
