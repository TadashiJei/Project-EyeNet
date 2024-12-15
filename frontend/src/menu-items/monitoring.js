// assets
import { IconDeviceAnalytics, IconAlertTriangle, IconHistory } from '@tabler/icons';

// constant
const icons = {
  IconDeviceAnalytics,
  IconAlertTriangle,
  IconHistory
};

// ==============================|| MONITORING MENU ITEMS ||============================== //

const monitoring = {
  id: 'monitoring',
  title: 'Monitoring',
  type: 'group',
  children: [
    {
      id: 'analytics',
      title: 'Analytics',
      type: 'item',
      url: '/monitoring/analytics',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    },
    {
      id: 'alerts',
      title: 'Alerts',
      type: 'item',
      url: '/monitoring/alerts',
      icon: icons.IconAlertTriangle,
      breadcrumbs: false
    },
    {
      id: 'history',
      title: 'History',
      type: 'item',
      url: '/monitoring/history',
      icon: icons.IconHistory,
      breadcrumbs: false
    }
  ]
};

export default monitoring;
