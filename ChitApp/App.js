/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

const AppTabNav = createStackNavigator ({
  Login: {
    screen: login
  },
  SignUp: {
    screen: signUp
  },
  EditProfile: {
    screen: editProfile
  },
  CreateChit: {
    screen: createChit
  },
  ViewChits: {
    screen: viewChits
  },
  ViewProfile: {
    screen: viewProfile
  },
  SearchedProfiles: {
    screen: SearchedProfiles
  },
  Home: createBottomTabNavigator({
    Chits: {
      screen: chits
    },
    Profile: {
      screen: profile
    },
    Followers: {
      screen: followers
    },
    Following: {
      screen: following
    },
    Search: {
      screen: search
    }
  })
});

const AppContainer = createAppContainer(AppTabNav)
export default AppContainer;
import chits from './screens/Chits'
import viewChits from './screens/ViewChits'
import createChit from './screens/CreateChit'
import signUp from './screens/SignUp'
import login from './screens/Login'
import followers from './screens/Followers'
import following from './screens/Following'
import profile from './screens/Profile'
import editProfile from './screens/EditProfile'
import viewProfile from './screens/ViewProfile'
import search from './screens/Search'
import SearchedProfiles from './screens/SearchedProfiles'
