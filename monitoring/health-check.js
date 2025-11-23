import axios from 'axios';

class HealthMonitor {
  constructor(backendUrl, frontendUrl) {
    this.backendUrl = backendUrl;
    this.frontendUrl = frontendUrl;
  }

  async checkBackend() {
    try {
      const response = await axios.get(`${this.backendUrl}/api/health`);
      return {
        status: response.status === 200 ? 'healthy' : 'unhealthy',
        responseTime: response.duration,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async checkFrontend() {
    try {
      const response = await axios.get(this.frontendUrl);
      return {
        status: response.status === 200 ? 'healthy' : 'unhealthy',
        responseTime: response.duration,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default HealthMonitor;