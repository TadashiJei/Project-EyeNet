import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase, Typography } from '@mui/material';

const Logo = ({ sx, to }) => (
  <ButtonBase
    disableRipple
    component={Link}
    to={to}
    sx={sx}
  >
    <Typography variant="h3" component="div" color="primary">
      EyeNet
    </Typography>
  </ButtonBase>
);

Logo.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

Logo.defaultProps = {
  to: '/',
  sx: {}
};

export default Logo;
