import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ThresholdConfig = ({ open, onClose, onSave }) => {
  const [thresholds, setThresholds] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchThresholds();
    }
  }, [open]);

  const fetchThresholds = async () => {
    try {
      const response = await fetch('/api/monitoring/thresholds');
      if (!response.ok) throw new Error('Failed to fetch thresholds');
      const data = await response.json();
      setThresholds(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/monitoring/thresholds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thresholds),
      });

      if (!response.ok) throw new Error('Failed to save thresholds');
      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleThresholdChange = (category, metric, value) => {
    setThresholds(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [metric]: parseFloat(value)
      }
    }));
  };

  if (!thresholds) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configure Alert Thresholds</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* System Thresholds */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">System Thresholds</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="CPU Usage (%)"
                type="number"
                value={thresholds.system.cpu}
                onChange={(e) => handleThresholdChange('system', 'cpu', e.target.value)}
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Memory Usage (%)"
                type="number"
                value={thresholds.system.memory}
                onChange={(e) => handleThresholdChange('system', 'memory', e.target.value)}
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Disk Space (%)"
                type="number"
                value={thresholds.system.diskSpace}
                onChange={(e) => handleThresholdChange('system', 'diskSpace', e.target.value)}
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* API Thresholds */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">API Thresholds</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="Error Rate (%)"
                type="number"
                value={thresholds.api.errorRate}
                onChange={(e) => handleThresholdChange('api', 'errorRate', e.target.value)}
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Response Time (ms)"
                type="number"
                value={thresholds.api.responseTime}
                onChange={(e) => handleThresholdChange('api', 'responseTime', e.target.value)}
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Request Rate (req/min)"
                type="number"
                value={thresholds.api.requestRate}
                onChange={(e) => handleThresholdChange('api', 'requestRate', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* EyeNet Thresholds */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">EyeNet Thresholds</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="Department Load"
                type="number"
                value={thresholds.eyenet.departmentLoad}
                onChange={(e) => handleThresholdChange('eyenet', 'departmentLoad', e.target.value)}
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Analytics Queue Size"
                type="number"
                value={thresholds.eyenet.analyticsQueueSize}
                onChange={(e) => handleThresholdChange('eyenet', 'analyticsQueueSize', e.target.value)}
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Model Accuracy (%)"
                type="number"
                value={thresholds.eyenet.modelAccuracy * 100}
                onChange={(e) => handleThresholdChange('eyenet', 'modelAccuracy', e.target.value / 100)}
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Prediction Latency (ms)"
                type="number"
                value={thresholds.eyenet.predictionLatency}
                onChange={(e) => handleThresholdChange('eyenet', 'predictionLatency', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Custom Metrics Thresholds */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Custom Metrics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="grid" gridTemplateColumns="1fr" gap={2}>
              {Object.entries(thresholds.custom).map(([name, value]) => (
                <Box key={name} display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  <TextField
                    label={`${name} (min)`}
                    type="number"
                    value={value.min}
                    onChange={(e) => handleThresholdChange('custom', `${name}.min`, e.target.value)}
                  />
                  <TextField
                    label={`${name} (max)`}
                    type="number"
                    value={value.max}
                    onChange={(e) => handleThresholdChange('custom', `${name}.max`, e.target.value)}
                  />
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Thresholds
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThresholdConfig;
