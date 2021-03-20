/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Text, TextInput, View, ActivityIndicator, Image, Button, AsyncStorage, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

class CreateChitPage extends Component {
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
      chit_id: null,
      timestamp: null,
      chit_content: '',
      locationPermission: false,
      longitude: null,
      latitude: null,
      user_token: ''
    }
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Chit App Location Permission',
          message: 'This App Requires Access To Your Location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location Permission Granted!');
        return true;
      } else {
        console.log('Location Permission Denied!');
        return false;
      }
    } catch (error) {
    console.warn(error);
    }
  }

  findCoordinates = () => {
    if(this.state.locationPermission === false) {
      this.state.locationPermission = this.requestLocationPermission();  
    }
    Geolocation.getCurrentPosition (
      (position) => {
        this.setState({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude 
        });
      },
      (error) => {
        Alert.alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  };

  _retrieveData = async () => {
    try {
      const id = await AsyncStorage.getItem("id")
      const token = await AsyncStorage.getItem("token")
      if (id !== null && token !== null) {
        this.getProfileData(id);
        this.setState({ 
          user_id: id,
          user_token: token 
        });
        console.log("Async Retrieval Successful!");
        // console.log("Longitude:", this.state.longitude)
        // console.log("Latitude:", this.state.latitude)
        
      }
    } catch (error) {
      console.log("Async Retrieval Error:", error);
    }
  };

  getProfileData(id) {
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
        chit_id: responseJson.recent_chits.length + 1,
      });
      console.log("Retrieving User Profile ID:", responseJson.user_id);
    })
    .catch((error) => {
      console.log("Error Retrieving User Profile:", error);
    });
  }
  
  postChit() {
    let request = JSON.stringify({
      chit_id: this.state.chit_id,
      timestamp: Date.now(),
      chit_content: this.state.chit_content,
      location: {
        longitude: this.state.longitude,
        latitude: this.state.latitude,
      },
      user: {
        user_id: parseInt(this.state.user_id),
        given_name: this.state.given_name,
        family_name: this.state.family_name,
        email: this.state.email
      }
    });
    console.log("JSON Post Chit:", request);
    
    return fetch("http://10.0.2.2:3333/api/v0.0.5/chits", 
    { 
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": this.state.user_token
      }, 
      method: 'POST',
      body: request
    })
    .then((responseJson) => {
        console.log("Chit Posted!")
        this.props.navigation.navigate('Chits');
    })
    .catch((error) => {
      console.log("Chit Not Posted:", error);
    });
  }
  
  componentDidMount() {
    this.findCoordinates();
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
      <View style={{ flex: 1, flexDirection: 'column', marginBottom: 3 }}>
        <View style={{ backgroundColor: '#1DCAFF', alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#000000', borderLeftWidth: 1, borderRightWidth: 1 }}>
          <Text style={{ color: '#000000', fontSize: 24, fontWeight: 'bold', height: 50, paddingTop: 8 }}>~~~ Post Chit ~~~</Text>
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
              value={ this.state.given_name }
              editable={ false }
            />
          <Text style={{ color: '#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>Family Name:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3 }}
              value={ this.state.family_name }
              editable={ false }
            />
          <Text style={{ color: '#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>Chit Content:</Text>
            <TextInput style={{ height: 85, backgroundColor: '#D3D3D3', borderRadius: 3, textAlignVertical: 'top' }}
              multiline={ true }
              maxLength={ 140 }
              onChangeText={ (value) => this.setState({ chit_content: value })}
            />
          <View style={{ paddingTop: 15 }}>
            <Button
              onPress = { ()=> this.postChit(this) }
              title = 'Post Chit'
              color = '#00FF00'
            />
          </View>
          <View style={{ paddingTop: 15 }}>
            <Button
              onPress = { ()=> this.props.navigation.navigate('Chits') }
              title = 'Cancel Chit'
              color = '#FF0000'
            />
          </View>
        </View>
      </View>
    );
  }
}

export default CreateChitPage;