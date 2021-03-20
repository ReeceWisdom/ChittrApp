/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Text, TextInput, View, Image, Button } from 'react-native';

class SignUpPage extends Component {
  static navigationOptions = {
    headerShown : false // remove header
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      given_name: '',
      family_name: '',
      email: '',
      password: '',
    }
  }

  createProfile() {
    let request = JSON.stringify({
        given_name: this.state.given_name,
        family_name: this.state.family_name,
        email: this.state.email,
        password: this.state.password
      });
    console.log("JSON Create User Profile:", request);

    return fetch("http://10.0.2.2:3333/api/v0.0.5/user/", 
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
      }); 
      console.log("User Created!");
      this.props.navigation.navigate('Login')
    })
    .catch((error) => {
      console.log("User Not Created:", error);
    });
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', marginBottom: 3 }}>
        <View style={{ backgroundColor: '#1DCAFF', alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#000000', borderLeftWidth: 1, borderRightWidth: 1 }}>
          <Text style={{ color: '#000000', fontSize: 24, fontWeight: 'bold', height: 50, paddingTop: 8 }}>~~~ Sign Up ~~~</Text>
        </View>

        <View style={{ flex: 1, marginVertical: 10, alignSelf: 'center' }}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style= {{ width: 75, height: 75, borderRadius: 30, marginLeft: 5 }}
          />
        </View>
        <View style={{ flex: 8, flexDirection: 'column', alignSelf: 'center', paddingTop: 5, width: 250 }}>
          <Text style={{ color: '#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>First Name:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3 }}
              onChangeText={ (value) => this.setState({ given_name: value })}
            />
          <Text style={{ color: '#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>Family Name:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3 }}
              onChangeText={ (value) => this.setState({ family_name: value })}
            />
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
            onPress = { ()=> this.createProfile(this) }
            title = 'Sign Up'
            color = '#00FF00'
          />
          <View style={{ paddingTop: 20 }}>
            <Button
              onPress = { ()=> this.props.navigation.navigate('SignUp') }
              title = 'Login To My Account'
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

export default SignUpPage;