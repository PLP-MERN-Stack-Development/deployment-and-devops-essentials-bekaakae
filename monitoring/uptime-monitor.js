import axios from 'axios';
import fs from 'fs';
import path from 'path';

class UptimeMonitor {
  constructor() {
    this.services = [];
    this.logFile = path.join(process.cwd(), 'monitoring', 'uptime.log');
  }

  addService(name, url, checkInterval = 60000) { // 1 minute default
    this.services.push({
      name,
      url,
      checkInterval,
      lastCheck: null,
      status: 'unknown',
      responseTime: null
    });
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    console.log(logMessage.trim());
    
    // Append to log file
    fs.appendFileSync(this.logFile, logMessage, 'utf8');
  }

  async checkService(service) {
    const startTime = Date.now();
    
    try {
      const response = await axios.get(service.url, { timeout: 10000 });
      const responseTime = Date.now() - startTime;
      
      service.status = response.status === 200 ? 'healthy' : 'unhealthy';
      service.responseTime = responseTime;
      service.lastCheck = new Date();
      
      this.log(`✅ ${service.name} is healthy - Response time: ${responseTime}ms`);
      
    } catch (error) {
      service.status = 'unhealthy';
      service.responseTime = null;
      service.lastCheck = new Date();
      
      this.log(`❌ ${service.name} is down - Error: ${error.message}`);
    }
  }

  start() {
    this.log('🚀 Starting uptime monitor...');
    
    // Check all services immediately
    this.services.forEach(service => {
      this.checkService(service);
    });

    // Set up interval checks for each service
    this.services.forEach(service => {
      setInterval(() => {
        this.checkService(service);
      }, service.checkInterval);
    });

    // Log summary every 5 minutes
    setInterval(() => {
      this.logSummary();
    }, 300000);
  }

  logSummary() {
    const healthy = this.services.filter(s => s.status === 'healthy').length;
    const total = this.services.length;
    
    this.log(`📊 Status Summary: ${healthy}/${total} services healthy`);
    
    this.services.forEach(service => {
      const statusIcon = service.status === 'healthy' ? '✅' : '❌';
      const responseTime = service.responseTime ? `${service.responseTime}ms` : 'N/A';
      this.log(`   ${statusIcon} ${service.name}: ${service.status} (${responseTime})`);
    });
  }

  getStatus() {
    return this.services.map(service => ({
      name: service.name,
      status: service.status,
      responseTime: service.responseTime,
      lastCheck: service.lastCheck,
      url: service.url
    }));
  }
}

// Example usage
const monitor = new UptimeMonitor();

// Add services to monitor
monitor.addService('Backend API', 'http://localhost:5000/api/health');
monitor.addService('Frontend App', 'http://localhost:3000');

export default monitor;

// Start monitoring if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  monitor.start();
}