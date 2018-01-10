import PropTypes from 'prop-types';

const BasePropTypes = {
  label: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default BasePropTypes;
