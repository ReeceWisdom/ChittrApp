/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Text, TextInput, View, Image, Button, AsyncStorage } from 'react-native';

class SearchPage extends Component {
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
      q: '',
      JSONresponse: ''
    }
  }

  _storeData = async (id) => {
    try {
      await AsyncStorage.setItem("user_id", id);
      console.log("Async Storage Successful!");
    } catch (error) {
      console.log("Async Storage Error: ", error);
    }
  };

  searchedProfiles(q) {
    console.log("Searching Users Matching = '" + q + "'")
    this.props.navigation.navigate('SearchedProfiles', { q: q });
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', marginBottom: 3 }}>
        <View style={{ backgroundColor: '#1DCAFF', alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: '#000000', borderLeftWidth: 1, borderRightWidth: 1 }}>
          <Text style={{ color: '#000000', fontSize: 24, fontWeight: 'bold', height: 50, paddingTop: 8 }}>~~~ Search User ~~~</Text>
        </View>

        <View style={{ flex: 1, marginVertical: 10, alignSelf: 'center' }}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style= {{ width: 75, height: 75, borderRadius: 30, marginLeft: 5 }}
          />
        </View>
        <View style={{ flex: 8, flexDirection: 'column', alignSelf: 'center', paddingTop: 5, width: 250 }}>
          <Text style={{ color: '#000000', fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>Search:</Text>
            <TextInput style={{ height: 40, backgroundColor: '#D3D3D3', borderRadius: 3 }}
              placeholder= { "Enter 1st Name, 2nd Name or Email..." }
              onChangeText={ (value) => this.setState({ q: value })}
            />
          <View style={{ paddingTop: 20 }}>
            <Button
              onPress = { ()=> this.searchedProfiles(this.state.q) }
              title = 'Search'
              color = '#00FF00'
            />
          </View>
        </View>
      </View>
    );
  }
}

export default SearchPage;