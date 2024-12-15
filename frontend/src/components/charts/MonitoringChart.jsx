import React, { useState, useEffect } from 'react';
import { Box, useTheme, Menu, MenuItem } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

const MonitoringChart = ({ type = 'performance', height = 350 }) => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [timeRange, setTimeRange] = useState('1h');

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        handleClose();
    };

    // Simulated data - replace with actual API calls
    useEffect(() => {
        const generateData = () => {
            const now = new Date();
            const data = [];
            for (let i = 0; i < 24; i++) {
                data.push({
                    x: new Date(now.getTime() - (23 - i) * 3600000),
                    y: Math.floor(Math.random() * 100)
                });
            }
            return data;
        };

        setData(generateData());
    }, [timeRange]);

    const getChartOptions = () => {
        const isPerformance = type === 'performance';
        
        return {
            chart: {
                type: isPerformance ? 'area' : 'donut',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                foreColor: theme.palette.text.secondary,
                background: 'transparent',
                fontFamily: theme.typography.fontFamily
            },
            ...(isPerformance ? {
                xaxis: {
                    type: 'datetime',
                    labels: {
                        style: {
                            colors: theme.palette.text.secondary
                        }
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: theme.palette.text.secondary
                        }
                    }
                },
                grid: {
                    borderColor: theme.palette.divider,
                    strokeDashArray: 4,
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                    yaxis: {
                        lines: {
                            show: true
                        }
                    },
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.4,
                        opacityTo: 0.1,
                        stops: [0, 90, 100]
                    }
                },
                tooltip: {
                    theme: theme.palette.mode,
                    x: {
                        format: 'dd MMM yyyy HH:mm'
                    }
                },
                colors: [theme.palette.primary.main]
            } : {
                labels: ['IPv4', 'IPv6', 'Other'],
                colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main],
                legend: {
                    show: true,
                    position: 'bottom',
                    fontSize: '14px',
                    fontWeight: 500,
                    labels: {
                        colors: theme.palette.text.primary
                    },
                    markers: {
                        width: 12,
                        height: 12,
                        radius: 6
                    },
                    itemMargin: {
                        horizontal: 10,
                        vertical: 0
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '70%',
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Total IPs',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: theme.palette.text.primary
                                }
                            }
                        }
                    }
                }
            })
        };
    };

    const getChartData = () => {
        if (type === 'performance') {
            return [{
                name: 'Performance',
                data: data
            }];
        } else {
            return [65, 25, 10];
        }
    };

    return (
        <Box sx={{ width: '100%', height }}>
            <ReactApexChart
                options={getChartOptions()}
                series={getChartData()}
                type={type === 'performance' ? 'area' : 'donut'}
                height={height}
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleTimeRangeChange('1h')}>Last Hour</MenuItem>
                <MenuItem onClick={() => handleTimeRangeChange('24h')}>Last 24 Hours</MenuItem>
                <MenuItem onClick={() => handleTimeRangeChange('7d')}>Last 7 Days</MenuItem>
            </Menu>
        </Box>
    );
};

export default MonitoringChart;
