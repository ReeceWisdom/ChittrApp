/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Text, View, ActivityIndicator, FlatList, Image, Button, AsyncStorage } from 'react-native';

class ProfilePage extends Component {
  static navigationOptions = {
    headerShown : false // remove header
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user_id: '',
      given_name: '',
      family_name: '',
      email: '',
      userProfile: [],
      chitCount: '',
      recentChits: [],
      followersList: [],
      followingList: [],
      user_token: ''
    }
  }

  _retrieveData = async () => {
    try {
      const id = await AsyncStorage.getItem("id")
      const token = await AsyncStorage.getItem("token")
      if (id !== null && token !== null) {
        this.getFollowers(id);
        this.getFollowing(id);
        this.getData(id);
        this.setState({ user_token: token });
        console.log("Async Retrieval Successful!");
      }
    } catch (error) {
      console.log("Async Retrieval Error:", error);
    }
  };
  
  getData(id) {
    let request = "http://10.0.2.2:3333/api/v0.0.5/user/" + id;
    console.log("User Profile Request:", request);
    return fetch(request, 
    { 
      headers: { 
        "Content-Type": "application/json" 
      }, 
      method: 'GET' 
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        user_id: responseJson.user_id,
        given_name: responseJson.given_name,
        family_name: responseJson.family_name,
        email: responseJson.email,
        userProfile: responseJson,
        chitCount: responseJson.recent_chits.length,
        recentChits: responseJson.recent_chits,
      });
      console.log("User Profile Request Results:", responseJson);
    })
    .catch((error) => {
      console.log("User Profile Request Error:", error);
    });
  }

  getFollowers(id) {
    let request = "http://10.0.2.2:3333/api/v0.0.5/user/" + id + "/followers";
    console.log("Proile Followers Request:", request);
    return fetch(request, 
    { 
      headers: { 
        "Content-Type": "application/json" 
      }, 
      method: 'GET' 
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        followersList: responseJson,
      });
      console.log("Followers Count:", this.state.followersList.length);
    })
    .catch((error) => {
      console.log("Followers Request Error:", error);
    });
  }

  getFollowing(id) {
    let request = "http://10.0.2.2:3333/api/v0.0.5/user/" + id + "/following";
    console.log("Proile Following Request:", request);
    return fetch(request, 
    { 
      headers: { 
        "Content-Type": "application/json" 
      }, 
      method: 'GET' 
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        followingList: responseJson,
      });
      console.log("Following Count:", this.state.followingList.length);
    })
    .catch((error) => {
      console.log("Following Request Error:", error);
    });
  }

  editProfile(user_id) {
    console.log("Edit User Profile:", user_id)
    this.props.navigation.navigate('EditProfile', { user_id: user_id });
  }

  logoutProfile() {
    let request = "http://10.0.2.2:3333/api/v0.0.5/logout";
    console.log("Proile Logout Request:", request);
    return fetch(request, 
    { 
      headers: { 
        "Content-Type": "application/json",
        "X-Authorization": this.state.user_token
      }, 
      method: 'POST',
    })
    .then((responseJson) => {
      console.log("User Logged Out...");
      this.props.navigation.navigate('Login')
    })
    .catch((error) => {
      console.log("Logout Request Error:", error);
    });
  }
    
  componentDidMount() {
    this._retrieveData();
  }
  
  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator/>
        </View>
      )
    }
    return (
      <View style={{ backgroundColor: '#FFFFFF', flex: 1, flexDirection: 'column', marginBottom: 3 }}>
        <View style={{ backgroundColor: '#1DCAFF', alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#000000', borderLeftWidth: 1, borderRightWidth: 1 }}>
          <Text style={{ color: '#000000', fontSize: 24, fontWeight: 'bold', height: 50, paddingTop: 8 }}>~~~ User Profile ~~~</Text>
        </View>
        
        <View style={{ flexDirection: 'row', paddingTop: 3, backgroundColor: '#FFFFFF' }}>
          <View style={{ flex: 1, marginTop: 10, marginLeft: 5, marginBottom: 10 }}>
            <Image
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
              style= {{ width: 75, height: 75, borderRadius: 30, marginLeft: 5 }}
            />
          </View>
          <View style={{ flex: 2, alignSelf: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}> { this.state.given_name } { this.state.family_name }</Text>
            <Text style={{ fontSize: 12 }}> { this.state.email }</Text>
            <View style={[{ flexDirection: 'row', width: '40%' }]}>
              <Button
                onPress = { ()=> this.editProfile(this.state.user_id) }
                title = 'Edit Profile'
                color = '#00FF00'
              />
              <Button
                onPress = { ()=> this.logoutProfile() }
                title = 'Logout'
                color = '#FF0000'
              />
            </View> 
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#000000' }}>
          <View style={{ backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <View style={{ alignItems: 'center', marginTop: 15 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}> Followers: { this.state.followersList.length }</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 15, marginLeft: 30 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}> Following: { this.state.followingList.length }</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 15, marginLeft: 30, marginRight: 45 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}> No. of Chits: { this.state.chitCount }</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 8, flexDirection: 'row', marginBottom: 3 }}>
          <FlatList
            data={this.state.recentChits}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#FFFFFF', borderBottomWidth: 2, borderBottomColor: '#000000' }}>
                <View style={{ flexDirection: 'row', borderRadius: 20 }}>
                  <View style={{ flex: 1, marginTop: 15, marginLeft: 5 }}>
                    <Image
                      style={{ width: 40, height: 40, borderRadius: 30 }}
                      source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
                    />
                  </View>
                  <View style={{ flex: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 3, marginBottom: 3 }}>
                      <View style={{ alignSelf: 'flex-end' }}>
                        <Text style={{ fontSize: 10 }}> {item.timestamp}</Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: '#FFFFFF', width: '100%', height: 45, borderRadius: 2, marginBottom: 3, paddingRight: 20 }}>
                      <Text style={{ fontSize: 11, alignSelf: 'auto', alignItems: 'stretch' }}> {item.chit_content}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={i => i.id}
          />
        </View>
      </View>
    );
  }
}

export default ProfilePage;