/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Text, View, ActivityIndicator, FlatList, Image, AsyncStorage, Button } from 'react-native';

class FollowingPage extends Component {
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
      followingList: []
    }
  }
  
  _retrieveData = async () => {
    try {
      const id = await AsyncStorage.getItem("id")
      if (id !== null) {
        console.log("Async Retrieval Successful!");
        this.getData(id);
      }
    } catch (error) {
      console.log("Async Retrieval Error:", error);
    }
  };

  getData(id) {
    let request = "http://10.0.2.2:3333/api/v0.0.5/user/" + id + "/following";
    console.log("Following Request:", request);
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
      console.log("JSON Request Results:", this.state.followingList);
    })
    .catch((error) => {
      console.log("Get Followers Error:", error);
    });
  }

  viewProfile(user_id) {
    console.log("Show User ID:", user_id +"'s Profile...")
    this.props.navigation.navigate('ViewProfile', { user_id: user_id });
  }
  
  componentDidMount() {
    this._retrieveData();
    this.getData();
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
      <View style={{ flex: 1, flexDirection: 'column', marginBottom: 3 }}>
        <View style={{ backgroundColor: '#1DCAFF', alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#000000', borderLeftWidth: 1, borderRightWidth: 1 }}>
          <Text style={{ color: '#000000', fontSize: 24, fontWeight: 'bold', height: 50, paddingTop: 8 }}>~~~ Following ~~~</Text>
        </View>
        
        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}>
          <FlatList
            data={this.state.followingList}
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
                      <View>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.given_name} {item.family_name}</Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: '#FFFFFF', width: '100%', height: 55, borderRadius: 2, marginBottom: 3, paddingRight: 20 }}>
                      <Text style={{ fontSize: 11, alignSelf: 'auto', alignItems: 'stretch' }}> E-mail: {item.email}</Text>
                      <View style={{ width: 120 }}>
                        <Button
                          onPress = { ()=> this.viewProfile(item.user_id) }
                          title = 'View Profile'
                          color = '#00FF00'
                        />
                      </View>
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

export default FollowingPage;