# CLAUDE.md - K-Means 聚类实验平台

## 项目概述

这是一个交互式的 K-Means 聚类可视化工具，用于帮助有编程基础的学习者深入理解无监督学习过程。

## 技术栈

- **后端**: Python 3.8+ / Flask / Flask-SocketIO
- **前端**: HTML5 / CSS3 / JavaScript / Canvas API
- **实时通信**: WebSocket (Socket.IO)

## 项目结构

```
Whimsy-github/
├── app/
│   ├── __init__.py          # Flask 应用初始化
│   ├── routes.py            # API 路由和 WebSocket 处理
│   ├── templates/
│   │   └── index.html       # 主页面模板
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css    # 样式文件
│   │   └── js/
│   │       ├── canvas.js    # Canvas 可视化
│   │       ├── controls.js  # 控制面板逻辑
│   │       ├── metrics.js   # 指标显示
│   │       └── app.js       # 主应用逻辑
│   └── utils/
│       ├── __init__.py
│       ├── kmeans_engine.py # K-Means 算法实现
│       └── data_manager.py  # 数据管理
├── data/                    # 数据文件目录
├── requirements.txt         # Python 依赖
├── run.py                   # 应用入口
├── test_app.py              # 测试脚本
└── README.md                # 项目说明
```

## 开发指南

### 环境设置

```bash
# 创建虚拟环境（推荐）
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt
```

### 运行应用

```bash
python run.py
```

应用将在 http://localhost:5000 启动。

### 运行测试

```bash
# 确保应用正在运行
python test_app.py
```

## 代码规范

### Python 代码风格

- 遵循 PEP 8 规范
- 使用类型注解（Type Hints）
- 函数和类必须有文档字符串
- 保持函数简洁，单一职责

### JavaScript 代码风格

- 使用 ES6+ 语法
- 类和方法必须有注释
- 使用 const/let，避免 var
- 异步操作使用 async/await

### 命名规范

- Python: snake_case（变量、函数、模块）
- JavaScript: camelCase（变量、函数）、PascalCase（类）
- CSS: kebab-case（类名）

## 核心模块说明

### kmeans_engine.py

K-Means 算法核心实现，包含：
- 距离计算（欧几里得距离）
- 簇分配逻辑
- 中心点更新
- 收敛判断
- K-Means++ 初始化

### data_manager.py

数据集管理，提供：
- 预设数据集生成（blobs、circles、moons、random）
- 数据集加载和保存
- 数据格式转换

### routes.py

Flask 路由和 WebSocket 处理：
- RESTful API 端点
- WebSocket 事件处理
- 错误处理和验证

## API 端点

### REST API

- `GET /` - 主页面
- `GET /api/datasets` - 获取数据集列表
- `GET /api/dataset/<name>` - 加载指定数据集
- `POST /api/cluster` - 初始化聚类

### WebSocket 事件

- `step` - 执行单步聚类
- `run` - 自动运行聚类
- `reset` - 重置聚类状态
- `update` - 接收状态更新
- `complete` - 聚类完成通知

## 扩展指南

### 添加新数据集

1. 在 `data_manager.py` 中添加生成函数
2. 在 `preset_datasets` 字典中注册
3. 更新前端数据集选择器

### 添加新算法

1. 在 `utils/` 目录创建新引擎文件
2. 实现标准接口：`initialize()`、`step()`、`get_state()`
3. 在 `routes.py` 中添加 API 端点
4. 更新前端控制面板

### 自定义样式

修改 `static/css/style.css` 文件：
- 颜色主题：修改 CSS 变量
- 布局：调整 Flexbox/Grid
- 响应式：修改媒体查询

## 调试技巧

### 后端调试

```python
# 在 Flask 应用中启用调试模式
app.run(debug=True)

# 使用 Python 调试器
import pdb; pdb.set_trace()
```

### 前端调试

- 使用浏览器开发者工具（F12）
- 查看 Console 输出
- 使用 Network 面板检查 API 请求
- 使用 Elements 面板检查 DOM

### WebSocket 调试

- 查看浏览器 Console 的 Socket.IO 日志
- 使用 Flask-SocketIO 的调试模式
- 检查 WebSocket 连接状态

## 性能优化

### 算法优化

- 使用 NumPy 向量化计算
- 实现增量更新
- 添加收敛阈值

### 前端优化

- 使用 requestAnimationFrame 优化动画
- 实现 Canvas 局部重绘
- 减少 DOM 操作

## 常见问题

### Q: 应用启动失败
A: 检查端口 5000 是否被占用，或修改 `run.py` 中的端口号。

### Q: WebSocket 连接失败
A: 检查防火墙设置，确保 WebSocket 端口开放。

### Q: 聚类结果不稳定
A: 使用 K-Means++ 初始化方法，或增加迭代次数。

## 版本控制

### 提交规范

使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

### 分支策略

- `main` - 生产环境
- `develop` - 开发分支
- `feature/*` - 功能分支
- `hotfix/*` - 紧急修复

## 部署

### 生产环境部署

```bash
# 使用 Gunicorn
pip install gunicorn
gunicorn -k gevent -w 4 -b 0.0.0.0:5000 run:app

# 或使用 Docker
docker build -t kmeans-platform .
docker run -p 5000:5000 kmeans-platform
```

### 环境变量

- `SECRET_KEY` - Flask 密钥
- `FLASK_ENV` - 运行环境（development/production）
- `PORT` - 监听端口

## 学习资源

- [K-Means 算法详解](https://en.wikipedia.org/wiki/K-means_clustering)
- [Flask 官方文档](https://flask.palletsprojects.com/)
- [Socket.IO 文档](https://socket.io/docs/)
- [Canvas API 教程](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 许可证

MIT License

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
