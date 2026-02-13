#!/bin/bash
# AI Employee System 一键安装脚本

set -e

echo "🤖 AI 员工系统安装程序"
echo "======================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        echo "请访问 https://nodejs.org/ 下载安装 Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 版本过低 (需要 18+)${NC}"
        echo "当前版本: $(node -v)"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js 版本: $(node -v)${NC}"
}

# 检查 Git
check_git() {
    if ! command -v git &> /dev/null; then
        echo -e "${YELLOW}⚠️ Git 未安装，将跳过 git 初始化${NC}"
        return
    fi
    echo -e "${GREEN}✅ Git 已安装${NC}"
}

# 下载项目
download_project() {
    echo ""
    echo "📥 下载项目..."
    
    REPO_URL="https://github.com/zhangniuone/ai-employee-system.git"
    INSTALL_DIR="${HOME}/ai-employee-system"
    
    if [ -d "$INSTALL_DIR" ]; then
        echo -e "${YELLOW}⚠️ 目录已存在: $INSTALL_DIR${NC}"
        read -p "是否覆盖? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$INSTALL_DIR"
        else
            echo "安装已取消"
            exit 0
        fi
    fi
    
    git clone "$REPO_URL" "$INSTALL_DIR" || {
        echo -e "${RED}❌ 下载失败，请检查网络${NC}"
        exit 1
    }
    
    cd "$INSTALL_DIR"
    echo -e "${GREEN}✅ 项目下载完成${NC}"
}

# 安装依赖
install_deps() {
    echo ""
    echo "📦 安装依赖..."
    npm install
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
}

# 配置环境
setup_config() {
    echo ""
    echo "⚙️ 配置环境..."
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ 配置文件已创建: .env${NC}"
        echo -e "${YELLOW}⚠️ 请编辑 .env 文件，填入你的 API Keys${NC}"
    fi
    
    # 创建必要目录
    mkdir -p logs data/content
    echo -e "${GREEN}✅ 目录结构已创建${NC}"
}

# 创建快捷方式
create_alias() {
    echo ""
    echo "🔗 创建命令快捷方式..."
    
    SHELL_RC=""
    if [ -f "$HOME/.bashrc" ]; then
        SHELL_RC="$HOME/.bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
        SHELL_RC="$HOME/.zshrc"
    fi
    
    if [ -n "$SHELL_RC" ]; then
        echo "alias ai-employee='node $INSTALL_DIR/bin/cli.js'" >> "$SHELL_RC"
        echo -e "${GREEN}✅ 快捷命令已添加${NC}"
        echo -e "${YELLOW}💡 运行 'source $SHELL_RC' 或重新打开终端以生效${NC}"
    fi
}

# 显示完成信息
show_finish() {
    echo ""
    echo "======================="
    echo -e "${GREEN}🎉 安装完成!${NC}"
    echo "======================="
    echo ""
    echo "📂 安装目录: $INSTALL_DIR"
    echo ""
    echo "🚀 快速开始:"
    echo "   cd $INSTALL_DIR"
    echo "   # 1. 编辑配置"
    echo "   nano .env"
    echo ""
    echo "   # 2. 启动系统"
    echo "   npm start"
    echo ""
    echo "📖 详细文档: https://github.com/zhangniuone/ai-employee-system#readme"
    echo ""
    echo -e "${YELLOW}💰 开始赚钱之旅吧!${NC}"
}

# 主流程
main() {
    check_node
    check_git
    download_project
    install_deps
    setup_config
    create_alias
    show_finish
}

main