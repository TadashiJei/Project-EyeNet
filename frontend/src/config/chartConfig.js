export const chartThemes = {
  light: {
    primary: '#2196f3',
    secondary: '#90caf9',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    background: '#ffffff',
    text: '#333333'
  },
  dark: {
    primary: '#90caf9',
    secondary: '#2196f3',
    success: '#81c784',
    warning: '#ffb74d',
    error: '#e57373',
    background: '#1a223f',
    text: '#ffffff'
  }
};

export const chartTypes = {
  performance: {
    type: 'line',
    height: 360,
    options: {
      chart: {
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      markers: {
        size: 0,
        hover: {
          size: 5
        }
      },
      grid: {
        show: true,
        strokeDashArray: 5,
        position: 'back'
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
      },
      dataLabels: {
        enabled: false
      }
    }
  },
  alerts: {
    type: 'bar',
    height: 360,
    options: {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      }
    }
  }
};

export const monitoringMetrics = {
  system: {
    cpu: {
      usage: {
        title: 'CPU Usage',
        unit: '%',
        thresholds: {
          warning: 70,
          critical: 90
        }
      },
      temperature: {
        title: 'CPU Temperature',
        unit: '°C',
        thresholds: {
          warning: 70,
          critical: 85
        }
      },
      load: {
        title: 'System Load',
        unit: '',
        thresholds: {
          warning: 0.7,
          critical: 0.9
        }
      }
    },
    memory: {
      usage: {
        title: 'Memory Usage',
        unit: '%',
        thresholds: {
          warning: 80,
          critical: 95
        }
      },
      available: {
        title: 'Available Memory',
        unit: 'GB',
        thresholds: {
          warning: 2,
          critical: 1
        }
      },
      swap: {
        title: 'Swap Usage',
        unit: '%',
        thresholds: {
          warning: 50,
          critical: 80
        }
      }
    },
    disk: {
      usage: {
        title: 'Disk Usage',
        unit: '%',
        thresholds: {
          warning: 80,
          critical: 90
        }
      },
      io: {
        title: 'Disk I/O',
        unit: 'MB/s',
        thresholds: {
          warning: 100,
          critical: 200
        }
      }
    }
  },
  network: {
    bandwidth: {
      incoming: {
        title: 'Incoming Traffic',
        unit: 'Mbps',
        thresholds: {
          warning: 800,
          critical: 950
        }
      },
      outgoing: {
        title: 'Outgoing Traffic',
        unit: 'Mbps',
        thresholds: {
          warning: 800,
          critical: 950
        }
      }
    },
    latency: {
      title: 'Network Latency',
      unit: 'ms',
      thresholds: {
        warning: 100,
        critical: 200
      }
    },
    packets: {
      loss: {
        title: 'Packet Loss',
        unit: '%',
        thresholds: {
          warning: 1,
          critical: 5
        }
      },
      errors: {
        title: 'Packet Errors',
        unit: 'count',
        thresholds: {
          warning: 100,
          critical: 500
        }
      }
    }
  },
  services: {
    availability: {
      title: 'Service Availability',
      unit: '%',
      thresholds: {
        warning: 95,
        critical: 90
      }
    },
    response: {
      title: 'Response Time',
      unit: 'ms',
      thresholds: {
        warning: 500,
        critical: 1000
      }
    },
    errors: {
      title: 'Error Rate',
      unit: '%',
      thresholds: {
        warning: 5,
        critical: 10
      }
    }
  }
};

export const realTimeConfig = {
  refreshIntervals: {
    fast: 5,    // 5 seconds
    normal: 30,  // 30 seconds
    slow: 300    // 5 minutes
  },
  dataPoints: {
    max: 100,    // Maximum number of data points to show
    initial: 20  // Initial number of data points to load
  },
  animations: {
    duration: 1000,
    easing: 'linear'
  }
};
