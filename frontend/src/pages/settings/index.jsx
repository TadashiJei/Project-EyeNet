import { useState } from 'react';

// material-ui
import {
  Box,
  Tab,
  Tabs,
  Grid
} from '@mui/material';

// project imports
import MainCard from '../../components/cards/MainCard';
import { gridSpacing } from '../../config';

// tabs
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import GeneralSettings from './GeneralSettings';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`
  };
}

// ==============================|| SETTINGS ||============================== //

const SettingsPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            aria-label="settings tabs"
            sx={{
              mb: 3,
              '& a': {
                minHeight: 'auto',
                minWidth: 10,
                py: 1.5,
                px: 1,
                mr: 2.25,
                color: 'grey.600',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              },
              '& a.Mui-selected': {
                color: 'primary.main'
              },
              '& a > svg': {
                mb: '0px !important',
                mr: 1.25
              }
            }}
          >
            <Tab
              label="Profile"
              {...a11yProps(0)}
            />
            <Tab
              label="Notifications"
              {...a11yProps(1)}
            />
            <Tab
              label="General"
              {...a11yProps(2)}
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <ProfileSettings />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <NotificationSettings />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <GeneralSettings />
          </TabPanel>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SettingsPage;
