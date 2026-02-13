const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

class Config {
  constructor() {
    this.data = {};
    this.configPath = process.env.CONFIG_PATH || './config/employees.json';
  }

  async load() {
    try {
      const content = await fs.readFile(this.configPath, 'utf8');
      this.data = JSON.parse(content);
      logger.info('✅ 配置加载成功');
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.warn('⚠️ 配置文件不存在，使用默认配置');
        this.data = this.getDefaultConfig();
        await this.save();
      } else {
        throw error;
      }
    }
  }

  async save() {
    const dir = path.dirname(this.configPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.configPath, JSON.stringify(this.data, null, 2));
  }

  getDefaultConfig() {
    return {
      employees: [
        {
          id: 'demo-content-creator',
          name: '内容创作助手',
          role: 'content_creator',
          platform: 'xiaohongshu',
          enabled: false,
          schedule: '0 9,15,21 * * *',
          tasks: ['generate_post'],
          config: {
            topics: ['AI工具', '效率提升', '副业赚钱'],
            style: '轻松幽默',
            maxLength: 800
          }
        }
      ],
      global: {
        requestInterval: 3000,
        maxRetry: 3,
        notifyOnError: true
      }
    };
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
  }

  getEmployees() {
    return this.data.employees || [];
  }
}

module.exports = new Config();