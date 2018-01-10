import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, View } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import colors from '../styles/colors';

const styles = StyleSheet.create({
  row:{
    flex:1,
    flexDirection:'row',
    alignItems:'flex-end',
    justifyContent:'center',
  },
  label: {
    fontSize: 22,
    color: colors.secondary.white,
  },
  baseHeader: {
    position: 'relative',
    height: 72,
  },
  hideHeaderBorder: {
    zIndex: 100,
    borderBottomWidth: 0,
  },
  iOSboxShadow: {
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
});

class MapHeader extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
    statusBarColor: PropTypes.string,
    statusBarTextTheme: PropTypes.string,
    onBack: PropTypes.func,
  };

  static defaultProps = {
    statusBarTextTheme: 'light-content',
    statusBarColor: colors.primary.blueDark,
    backgroundColor: colors.primary.blue,
  };

  renderBackIcon () {
    if (!this.props.onBack) {
      return null;
    }
    return (
      <Icon
        size={32}
        iconStyle={{ position: 'relative', top: 2 }}
        onPress={this.props.onBack}
        color={colors.secondary.white}
        underlayColor={'rgba(255, 255, 255, 0.4)'}
        name='keyboard-backspace' />
    );
  }

  renderTitle () {
    return (
      <View style={styles.row}>
        {this.props.titleIcon && <MaterialIcon name={'road'} size={20} color={colors.secondary.white} style={{marginHorizontal:5}}/>}
        <Text style={styles.label}>{this.props.label}</Text>
      </View>
    )
  }

  render () {
    const statusBarProps = {
      barStyle: this.props.statusBarTextTheme,
      backgroundColor: this.props.statusBarColor,
    };

    const containerStyle = [styles.hideHeaderBorder, styles.iOSboxShadow];
    if (this.props.relative) {
      containerStyle.push(styles.baseHeader);
    }

    return (
      <Header
        backgroundColor={this.props.backgroundColor}
        statusBarProps={statusBarProps}
        elevation={2}
        outerContainerStyles={containerStyle}
        leftComponent={this.renderBackIcon()}
        centerComponent={this.renderTitle()} />
    );
  }
}

export default MapHeader;
