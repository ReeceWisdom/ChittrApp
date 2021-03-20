/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Text, TextInput, View, ActivityIndicator, Image, Button, AsyncStorage } from 'react-native';

class EditProfilePage extends Component {
  static navigationOptions = {
    headerShown: false // remove header
  }
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user_id: '',
      given_name: '',
      family_name: '',
      email: '',
      password: '', 
      user_token: ''
    }
  }
  
  _retrieveData = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (token !== null) {
        this.setState({ 
          user_token: token 
        });
        console.log("Async Retrieval Successful!");
      }
    } catch (error) {
      console.log("Async Retrieval Error:", error);
    }
  };

  getData() {
    let request = "http://10.0.2.2:3333/api/v0.0.5/user/" + this.props.navigation.state.params.user_id;
    console.log("Edit User Profile Request:", request);
    return fetch(request, 
    { 
      headers: {
        "Accept": "application/json, text/plain, */*", 
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
        password: responseJson.password,
      });
      this._retrieveData();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  updateProfile() {
    let request = JSON.stringify({
      given_name: this.state.given_name,
      family_name: this.state.family_name,
      email: this.state.email,
      password: this.state.password
    });
    console.log("JSON Edit User Profile:", request);

    return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + this.state.user_id, 
    { 
      headers: {
        "Content-Type": "application/json",
        "X-Authorization" : this.state.user_token
      }, 
      method: 'PATCH',
      body: request
    })
    .then((responseJson) => {
      console.log("User Updated!");
      this.props.navigation.navigate('Profile');
    })
    .catch((error) => {
      console.log("User Not Updated:", error);
    });  
  }
  
  componentDidMount() {
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
          <Text style={{ color: '#000000', fontSize: 24, fontWeight: 'bold', height: 50, paddingTop: 8 }}>~~~ Edit User Profile ~~~</Text>
        </View>

        <View style={{ flex: 1, marginVertical: 10, alignSelf: 'center' }}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style= {{ width: 75, height: 75, borderRadius: 30, marginLeft: 5 }}
          />
        </View>
        <View style={{ flex: 8, flexDirection: 'column', alignSelf: 'center', paddingTop: 15, width: 250 }}>
          <Text style={{ color: '#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>First Name:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3 }}
              onChangeText={ (value) => this.setState({ given_name: value })}
              value={ this.state.given_name }
            />
          <Text style={{ color: '#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>Family Name:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3 }}
              onChangeText={ (value) => this.setState({ family_name: value })}
              value={ this.state.family_name }
            />
          <Text style={{ color:'#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>Email:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3 }}
              onChangeText={ (value) => this.setState({ email: value })}
              value={ this.state.email }
            />
          <Text style={{ color:'#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>Password:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3, marginBottom: 20 }}
              onChangeText={ (value) => this.setState({ password: value })}
              value={ this.state.password }
            />
          <Button
            onPress = { ()=> this.updateProfile(this) }
            title = 'Update Profile'
            color = '#00FF00'
          />
        </View>
      </View>
    );
  }
}

export default EditProfilePage;