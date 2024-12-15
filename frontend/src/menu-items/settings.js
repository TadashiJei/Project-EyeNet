// assets
import { IconSettings, IconUserCircle, IconBellRinging } from '@tabler/icons';

// constant
const icons = {
  IconSettings,
  IconUserCircle,
  IconBellRinging
};

// ==============================|| SETTINGS MENU ITEMS ||============================== //

const settings = {
  id: 'settings',
  title: 'Settings',
  type: 'group',
  children: [
    {
      id: 'profile',
      title: 'Profile',
      type: 'item',
      url: '/settings/profile',
      icon: icons.IconUserCircle,
      breadcrumbs: false
    },
    {
      id: 'notifications',
      title: 'Notifications',
      type: 'item',
      url: '/settings/notifications',
      icon: icons.IconBellRinging,
      breadcrumbs: false
    },
    {
      id: 'general',
      title: 'General',
      type: 'item',
      url: '/settings/general',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  ]
};

export default settings;
