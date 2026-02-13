const schedule = require('node-schedule');
const logger = require('../utils/logger');
const ContentCreator = require('./ContentCreator');
const CustomerService = require('./CustomerService');
const DataAnalyst = require('./DataAnalyst');

class EmployeeManager {
  constructor() {
    this.employees = new Map();
    this.jobs = new Map();
    this.running = false;
  }

  async start() {
    this.running = true;
    
    // 加载所有员工
    await this.loadEmployees();
    
    // 启动定时任务
    this.scheduleTasks();
    
    logger.info('👔 员工管理器已启动');
  }

  async stop() {
    this.running = false;
    
    // 取消所有定时任务
    for (const [id, job] of this.jobs) {
      job.cancel();
      logger.info(`⏹️ 已停止员工任务: ${id}`);
    }
    
    this.jobs.clear();
    this.employees.clear();
    
    logger.info('👔 员工管理器已停止');
  }

  async loadEmployees() {
    const config = require('../utils/config');
    const employeesConfig = config.getEmployees();

    for (const empConfig of employeesConfig) {
      if (!empConfig.enabled) {
        logger.info(`⏸️ 员工已禁用: ${empConfig.name}`);
        continue;
      }

      const employee = this.createEmployee(empConfig);
      if (employee) {
        this.employees.set(empConfig.id, employee);
        logger.info(`👤 加载员工: ${empConfig.name} (${empConfig.role})`);
      }
    }
  }

  createEmployee(config) {
    switch (config.role) {
      case 'content_creator':
        return new ContentCreator(config);
      case 'customer_service':
        return new CustomerService(config);
      case 'data_analyst':
        return new DataAnalyst(config);
      default:
        logger.warn(`⚠️ 未知角色类型: ${config.role}`);
        return null;
    }
  }

  scheduleTasks() {
    for (const [id, employee] of this.employees) {
      const config = employee.getConfig();
      
      if (config.schedule) {
        const job = schedule.scheduleJob(config.schedule, async () => {
          try {
            logger.info(`🔄 执行任务: ${config.name}`);
            await employee.work();
          } catch (error) {
            logger.error(`❌ 员工任务失败 ${config.name}:`, error.message);
          }
        });
        
        this.jobs.set(id, job);
        logger.info(`⏰ 已设置定时任务: ${config.name} (${config.schedule})`);
      }
    }
  }

  getEmployeeCount() {
    return this.employees.size;
  }

  getStatus() {
    const status = [];
    for (const [id, employee] of this.employees) {
      status.push({
        id,
        name: employee.getConfig().name,
        role: employee.getConfig().role,
        running: this.jobs.has(id)
      });
    }
    return status;
  }
}

module.exports = EmployeeManager;