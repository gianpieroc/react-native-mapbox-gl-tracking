import React from 'react';
import { View } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import BasePropTypes from '../utils/BasePropTypes';
import haversine from 'haversine';
import pick from 'lodash/pick';
import { lineString as makeLine } from '@turf/helpers';

import MapboxClient from '../MapboxClient';

import { onSortOptions } from '../utils';

const lineStyle = {
  lineColor: 'white',
  lineWidth: 3,
  lineOpacity: 0.84
}

class SetUserTrackingModes extends React.Component {
  static propTypes = {
    ...BasePropTypes
  };

  state = {
    coordsToDraw: null,
    coordinates: [],
    prevLatLng: {},
    distanceTraveled: 0
  }


  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {},
      error => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 5
        }
        );
        this._watchID = navigator.geolocation.watchPosition(position => {
          const { coordinates, distanceTraveled } = this.state;
          const newLatLngs = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          let positionLatLngs = pick(position.coords, ['latitude', 'longitude']);
          const routeCoordinates = coordinates.concat([positionLatLngs.latitude, positionLatLngs.longitude])
          const coordsToDraw = {
            geometry:{
              coordinates: routeCoordinates,
              type:'LineString',
            },
            type:'Feature'
          }
          this.setState({
            coordinates: routeCoordinates,
            coordsToDraw: coordsToDraw,
            distanceTraveled: distanceTraveled + this._calcDistance(newLatLngs),
            prevLatLng: newLatLngs
          });
        });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this._watchID);
  }

  _calcDistance(newLatLng) {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  }

  renderRoute () {
    if (this.state.coordinates.length < 0) {
      return null;
    }

    return (
      <MapboxGL.ShapeSource id='routeSource' shape={this.state.coordsToDraw}>
        <MapboxGL.LineLayer id='routeFill' style={lineStyle} belowLayerID='originInnerCircle' />
      </MapboxGL.ShapeSource>
    );
  }

  render () {
    return (
      <View style={{flex:1}}>
        <MapboxGL.MapView
          ref={(ref) => { this.map = ref; }}
          showUserLocation
          zoomLevel={15}
          attributionEnabled
          animated
          userTrackingMode={MapboxGL.UserTrackingModes.Follow}
          logoEnabled={false}
          style={{flex:1}} />
        {this.renderRoute()}
      </View>
    );
  }
}

export default SetUserTrackingModes;
