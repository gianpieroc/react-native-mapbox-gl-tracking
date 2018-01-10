import React from 'react';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';

import { Icon } from 'react-native-elements';

// components
import MapHeader from './components/MapHeader';

// styles
import colors from './styles/colors';

// utils
import { IS_ANDROID } from './utils';
import config from './utils/config';

// examples
import TrackScreen from './containers/TrackScreen';

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  noPermissionsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    marginTop: 48,
    fontSize: 24,
    textAlign: 'center',
  },
  button:{
    backgroundColor: colors.primary.blue,
    height: 60,
    borderRadius: 25,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText:{
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary.white,
  },
  exampleList: {
    flex: 1,
    marginTop: 60 + 12, // header + list padding,
  },
  exampleListItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  exampleListItem: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exampleListLabel: {
    fontSize: 18,
  },
  exampleBackground: {
    flex: 1,
    backgroundColor: colors.primary.pinkFaint,
  },
});


class App extends React.Component {

  state = {
    isFetchingAndroidPermission: IS_ANDROID,
    isAndroidPermissionGranted: false,
    activeScreen: -1,
  }

  async componentWillMount () {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
    MapboxGL.setAccessToken(config.get('accessToken'));
  }

  onButtonPress = () => {
    this.setState({ activeScreen: 1 });
  }

  onClose = () => {
    this.setState({ activeScreen: -1 });
  }

  renderTrackScreen () {

    const modalProps = {
      visible: this.state.activeScreen === 1,
      transparent: true,
      animationType: 'slide',
      onRequestClose: this.onCloseExample,
    };

    return (
      <Modal {...modalProps}>
        <View style={styles.exampleBackground}>
          {modalProps.visible  ? (
            <TrackScreen key={'Track Screen'} label={'Track Screen'} onDismiss={this.onClose} />
          ) : null}
        </View>
      </Modal>
    );
  }

  render () {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      if (this.state.isFetchingAndroidPermission) {
        return null;
      }
      return (
        <View style={styles.container}>
          <Text style={styles.noPermissionsText}>
            You need to accept location permissions in order to use this example applications
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <MapHeader label="Tracking with Mapbox GL" />
        <View style={[styles.container, {flexDirection:'column', justifyContent:'center'}]}>
          <TouchableOpacity style={styles.button} onPress={this.onButtonPress}>
            <Text style={styles.buttonText}>{'Start Track'}</Text>
          </TouchableOpacity>
          {this.renderTrackScreen()}
        </View>
      </View>
    );
  }
}

export default App;
