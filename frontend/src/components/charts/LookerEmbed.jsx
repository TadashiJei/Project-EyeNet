import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const LookerEmbed = ({ reportId, height = '600px' }) => {
  // Replace with your actual Looker Studio report URL
  const baseUrl = 'https://lookerstudio.google.com/embed/reporting';
  const reportUrl = `${baseUrl}/${reportId}`;

  return (
    <Box
      component="iframe"
      src={reportUrl}
      width="100%"
      height={height}
      sx={{
        border: 'none',
        borderRadius: 1,
        boxShadow: 1
      }}
      allowFullScreen
    />
  );
};

LookerEmbed.propTypes = {
  reportId: PropTypes.string.isRequired,
  height: PropTypes.string
};

export default LookerEmbed;
