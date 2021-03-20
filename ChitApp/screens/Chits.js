/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { Text, View, ActivityIndicator, FlatList, Image, Button } from 'react-native';


class ChitsPage extends Component {
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
      chitsList: [],
      recentChits: []
    }
  }
  
  getData() {
    let request = "http://10.0.2.2:3333/api/v0.0.5/chits";
    console.log("Chits Request:", request);
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
        chitsList: responseJson,
        recentChits: responseJson.recent_chits,
      });
      console.log("JSON Request Results:", this.state.chitsList);
    })
    .catch((error) => {
      console.log(error);
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
          <Text style={{ color: '#000000', fontSize: 24, fontWeight: 'bold', height: 50, paddingTop: 8 }}>~~~ Chits ~~~</Text>
        </View>
        <View style={{ borderBottomWidth: 3, borderBottomColor: '#000000' }}>
            <Button
              onPress = { ()=> this.props.navigation.navigate('CreateChit') }
              title = 'Create a Chit'
              color = '#00FF00'
            />
        </View>
        
        <View style={{ flex: 10, flexDirection: 'row', marginBottom: 3 }}>
          <FlatList
            data={this.state.chitsList}
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
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.user.given_name} {item.user.family_name}</Text>
                      </View>
                      <View style={{ alignItems: 'center' }}>
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

export default ChitsPage;