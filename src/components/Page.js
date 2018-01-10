import React from 'react';
import { View } from 'react-native';

import MapHeader from './MapHeader';

import colors from '../../styles/colors';

class Page extends React.Component {
  static propTypes = {
  };

  render () {
    return (
      <View style={{flex:1}}>
        <MapHeader
          relative
          backgroundColor={colors.primary.pink}
          statusBarColor={colors.primary.pinkDark}
          statusBarTextTheme={'light-content'}
          label={this.props.label}
          onBack={this.props.onDismissExample} />

        {this.props.children}
      </View>
    );
  }
}

export default Page;
