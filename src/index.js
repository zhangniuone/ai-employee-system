#!/usr/bin/env node
/**
 * AI Employee System - Main Entry
 * 全自动内容运营助手
 */

require('dotenv').config();
const EmployeeManager = require('./employees/Manager');
const logger = require('./utils/logger');
const config = require('./utils/config');

class AIEmployeeSystem {
  constructor() {
    this.manager = new EmployeeManager();
    this.isRunning = false;
  }

  async start() {
    logger.info('🚀 启动 AI 员工系统...');
    
    try {
      // 初始化配置
      await config.load();
      
      // 启动员工管理器
      await this.manager.start();
      
      this.isRunning = true;
      logger.info('✅ AI 员工系统启动成功');
      logger.info(`📊 已加载 ${this.manager.getEmployeeCount()} 名员工`);
      
      // 保持进程运行
      this.keepAlive();
      
    } catch (error) {
      logger.error('❌ 启动失败:', error.message);
      process.exit(1);
    }
  }

  async stop() {
    logger.info('🛑 正在关闭 AI 员工系统...');
    this.isRunning = false;
    await this.manager.stop();
    logger.info('👋 系统已安全关闭');
    process.exit(0);
  }

  keepAlive() {
    setInterval(() => {
      if (!this.isRunning) {
        process.exit(0);
      }
    }, 5000);
  }

  getStatus() {
    return {
      running: this.isRunning,
      employees: this.manager.getStatus(),
      uptime: process.uptime()
    };
  }
}

// 单例模式
const system = new AIEmployeeSystem();

// 信号处理
process.on('SIGINT', () => system.stop());
process.on('SIGTERM', () => system.stop());

// 启动
if (require.main === module) {
  system.start();
}

module.exports = system;