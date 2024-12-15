export const lookerConfig = {
  reports: {
    systemPerformance: {
      id: 'your_performance_report_id',
      title: 'System Performance',
      description: 'Real-time system performance metrics',
      metrics: [
        'CPU Usage',
        'Memory Usage',
        'Disk I/O',
        'Network Traffic'
      ]
    },
    resourceUsage: {
      id: 'your_resource_report_id',
      title: 'Resource Usage Trends',
      description: 'Historical resource usage patterns',
      metrics: [
        'Memory Allocation',
        'CPU Utilization',
        'Storage Usage',
        'Network Bandwidth'
      ]
    },
    alerts: {
      id: 'your_alerts_report_id',
      title: 'System Alerts',
      description: 'Real-time system alerts and notifications',
      metrics: [
        'Critical Alerts',
        'Warning Alerts',
        'System Events',
        'Performance Issues'
      ]
    },
    summary: {
      id: 'your_summary_report_id',
      title: 'System Summary',
      description: 'Overall system health and status',
      metrics: [
        'System Health Score',
        'Active Issues',
        'Resource Status',
        'Performance Score'
      ]
    }
  },
  queries: {
    performance: {
      id: 'your_performance_query_id',
      refreshInterval: 60, // seconds
      metrics: [
        {
          name: 'CPU Usage',
          field: 'cpu_usage',
          type: 'percentage'
        },
        {
          name: 'Memory Usage',
          field: 'memory_usage',
          type: 'percentage'
        },
        {
          name: 'Disk I/O',
          field: 'disk_io',
          type: 'bytes'
        },
        {
          name: 'Network Traffic',
          field: 'network_traffic',
          type: 'bytes'
        }
      ]
    },
    resources: {
      id: 'your_resource_query_id',
      refreshInterval: 300, // seconds
      metrics: [
        {
          name: 'Memory Allocation',
          field: 'memory_allocated',
          type: 'bytes'
        },
        {
          name: 'CPU Utilization',
          field: 'cpu_utilization',
          type: 'percentage'
        },
        {
          name: 'Storage Usage',
          field: 'storage_usage',
          type: 'bytes'
        },
        {
          name: 'Network Bandwidth',
          field: 'network_bandwidth',
          type: 'bytes'
        }
      ]
    }
  },
  // Default chart configurations
  chartDefaults: {
    performance: {
      type: 'line',
      height: 360,
      options: {
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        stroke: {
          curve: 'smooth'
        },
        markers: {
          size: 0
        }
      }
    },
    resources: {
      type: 'area',
      height: 360,
      options: {
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
          }
        }
      }
    }
  }
};
