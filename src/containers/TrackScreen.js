import React from 'react';
import { View, Text } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import { Badge } from 'react-native-elements';
import BasePropTypes from '../utils/BasePropTypes';
import MapHeader from '../components/MapHeader';
import haversine from 'haversine';
import pick from 'lodash/pick';
import { lineString as makeLine } from '@turf/helpers';
import MapboxClient from '../MapboxClient';
import { onSortOptions } from '../utils';
import colors from '../styles/colors';

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
    trackingMode: 1,
    distanceTraveled: 0
  }


  componentDidMount() {
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
    setTimeout( ()=> this.setState({trackingMode:3}),1000)
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
          userTrackingMode={this.state.trackingMode}
          logoEnabled={false}
          style={{flex:1}} />
        {this.renderRoute()}
        <Badge containerStyle={{ backgroundColor: colors.primary.blue}}>
          <Text>Start</Text>
        </Badge>
        <MapHeader onBack={this.props.onDismiss} label={`${parseFloat(this.state.distanceTraveled.toFixed(2))} Km`}/>
      </View>
    );
  }
}

export default SetUserTrackingModes;
