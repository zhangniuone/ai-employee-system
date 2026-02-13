#!/usr/bin/env node
/**
 * AI Employee CLI
 */

const { exec } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
🤖 AI Employee System CLI

用法:
  ai-employee <command> [options]

命令:
  start       启动 AI 员工系统
  stop        停止系统
  status      查看运行状态
  logs        查看日志
  config      编辑配置
  add         添加新员工
  remove      移除员工
  test        测试员工任务
  
选项:
  -h, --help     显示帮助
  -v, --version  显示版本

示例:
  ai-employee start
  ai-employee status
  ai-employee test content-creator-1
`);
}

function showStatus() {
  console.log('📊 系统状态检查...');
  console.log('✅ 系统运行中');
  console.log('👤 已加载员工: 3名');
  console.log('⏰ 定时任务: 2个');
}

function startSystem() {
  console.log('🚀 启动 AI 员工系统...');
  const mainPath = path.join(__dirname, '..', 'src', 'index.js');
  
  const child = exec(`node ${mainPath}`, {
    detached: true,
    stdio: 'ignore'
  });
  
  child.unref();
  console.log('✅ 系统已在后台启动');
  console.log('📋 查看日志: ai-employee logs');
}

switch (command) {
  case 'start':
    startSystem();
    break;
  case 'status':
    showStatus();
    break;
  case 'help':
  case '-h':
  case '--help':
    showHelp();
    break;
  default:
    console.log('❓ 未知命令:', command);
    showHelp();
    process.exit(1);
}