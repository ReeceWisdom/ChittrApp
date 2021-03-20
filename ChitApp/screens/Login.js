/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Text, TextInput, View, Image, Button, AsyncStorage } from 'react-native';

class LoginPage extends Component {
  static navigationOptions = {
    headerShown : false // remove header
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      id: '',
      email: '',
      password: '',
      token: ''
    }
  }

  _storeData = async (id, token) => {
    try {
      await AsyncStorage.setItem("id", id.toString());
      await AsyncStorage.setItem("token", token.toString());
      console.log("Async Storage Successful!");
    } catch (error) {
      console.log("Async Storage Error: ", error);
    }
  };

  loginProfile() {
    let request = JSON.stringify({
      email: this.state.email,
      password: this.state.password
    });
    console.log("JSON Login User Profile:", request);

    return fetch("http://10.0.2.2:3333/api/v0.0.5/login/", 
    { 
      headers: {
        "Content-Type": "application/json"
      }, 
      method: 'POST',
      body: request
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        id: responseJson.id,
        token: responseJson.token
      }); 
      console.log("User", this.state.id, "Successfully Logged In!");
      console.log("User", this.state.id, "Token:", this.state.token);
      this._storeData(responseJson.id, responseJson.token)
      this.props.navigation.navigate('Profile')
    })
    .catch((error) => {
      console.log("Unsuccessful Login Attempt:", error);
    });
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', marginBottom: 3 }}>
        <View style={{ backgroundColor: '#1DCAFF', alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#000000', borderLeftWidth: 1, borderRightWidth: 1 }}>
          <Text style={{ color: '#000000', fontSize: 24, fontWeight: 'bold', height: 50, paddingTop: 8 }}>~~~ Login ~~~</Text>
        </View>

        <View style={{ flex: 1, marginVertical: 10, alignSelf: 'center' }}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style= {{ width: 75, height: 75, borderRadius: 30, marginLeft: 5 }}
          />
        </View>
        <View style={{ flex: 8, flexDirection: 'column', alignSelf: 'center', paddingTop: 5, width: 250 }}>
          <Text style={{ color: '#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>Email:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3 }}
              onChangeText={ (value) => this.setState({ email: value })}
            />
          <Text style={{ color: '#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>Password:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3, marginBottom: 20 }}
              onChangeText={ (value) => this.setState({ password: value })}
              secureTextEntry={ true }
            />
          <Button
            onPress = { ()=> this.loginProfile(this) }
            title = 'Login'
            color = '#00FF00'
          />
          <View style={{ paddingTop: 20 }}>
            <Button
              onPress = { ()=> this.props.navigation.navigate('SignUp') }
              title = 'Create An Account'
              color = '#FF0000'
            />
          </View>
          <View style={{ paddingTop: 20 }}>
            <Button
              onPress = { ()=> this.props.navigation.navigate('ViewChits') }
              title = 'View Chits'
              color = '#1DCAFF'
            />
          </View>
        </View>
      </View>
    );
  }
}

export default LoginPage;