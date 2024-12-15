import axios from 'axios';

class LookerService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_LOOKER_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Set authentication token
  setToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Fetch data from a specific Looker report
  async getReportData(reportId, params = {}) {
    try {
      const response = await this.client.get(`/reports/${reportId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching Looker report data:', error);
      throw error;
    }
  }

  // Run a specific Looker query
  async runQuery(queryId, params = {}) {
    try {
      const response = await this.client.post(`/queries/${queryId}/run`, params);
      return response.data;
    } catch (error) {
      console.error('Error running Looker query:', error);
      throw error;
    }
  }

  // Get available fields for a specific model/view
  async getAvailableFields(modelName, viewName) {
    try {
      const response = await this.client.get(`/models/${modelName}/views/${viewName}/fields`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available fields:', error);
      throw error;
    }
  }
}

export const lookerService = new LookerService();
export default lookerService;
