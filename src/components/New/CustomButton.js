import React from 'react';
import { CButton } from '@coreui/react';
import PropTypes from 'prop-types';

const CustomButton = ({ label, color, width, height, onClick }) => {
  return (
    <CButton 
      color={color} 
      style={{ 
        width, 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }} 
      onClick={onClick}
    >
      {label}
    </CButton>
  );
};

CustomButton.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func,
};

CustomButton.defaultProps = {
  color: 'primary',
  width: 'auto',
  height: '40px',
  onClick: () => {},
};

export default CustomButton;
