# K-Means 聚类实验平台

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

一个交互式的 K-Means 聚类可视化工具，帮助有编程基础的学习者深入理解无监督学习过程。

## 功能特性

- **可视化聚类过程**：实时观察数据点分组和簇心移动
- **参数实验**：调整 K 值、初始化方法、迭代次数等参数
- **多种数据集**：提供预设数据集（blobs、circles、moons、random）
- **交互式操作**：点击添加数据点，拖拽移动点
- **实时指标**：显示迭代次数、SSE（簇内误差）、收敛状态
- **算法说明**：内置 K-Means 算法步骤说明

## 技术栈

- **后端**：Python + Flask + Flask-SocketIO
- **前端**：HTML5 + CSS3 + JavaScript + Canvas
- **实时通信**：WebSocket

## 快速开始

### 系统要求

- Python 3.8 或更高版本
- pip（Python 包管理器）
- 现代浏览器（Chrome、Firefox、Edge 等）

### 安装步骤

1. **克隆或下载项目**
   ```bash
   git clone https://github.com/WCatchUp/whimsy.git
   cd Whimsy-github
   ```

2. **（可选）创建虚拟环境**
   
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```
   
3. **安装依赖**
   ```bash
   pip install -r requirements.txt
   ```

4. **启动应用**
   ```bash
   python run.py
   ```

5. **访问应用**
   
   打开浏览器访问：http://localhost:5000

### 验证安装

运行测试脚本验证应用是否正常工作：

```bash
# 确保应用正在运行
python test_app.py
```

## 使用说明

### 基本操作

1. **加载数据集**
   - 从左侧面板选择预设数据集
   - 点击"加载数据集"按钮

2. **调整参数**
   - 使用滑块调整 K 值（1-10）
   - 选择初始化方法（随机/K-Means++）
   - 设置最大迭代次数

3. **执行聚类**
   - 点击"初始化"按钮开始
   - 使用"单步执行"观察每一步
   - 或使用"自动运行"观察完整过程

4. **交互操作**
   - 点击画布空白处添加数据点
   - 拖拽数据点移动位置
   - 点击数据点删除

### 界面说明

- **左侧控制面板**：数据集选择、参数设置、控制按钮
- **中央画布**：可视化聚类过程
- **右侧指标面板**：实时显示聚类指标和算法说明

## K-Means 算法简介

K-Means 是一种经典的无监督学习算法，用于将数据点分成 K 个簇：

1. **初始化**：随机选择 K 个初始簇心
2. **分配**：将每个数据点分配到最近的簇心
3. **更新**：重新计算每个簇的中心点
4. **迭代**：重复步骤 2-3 直到收敛

**收敛条件**：
- 簇心不再移动（变化小于阈值）
- 或达到最大迭代次数

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
└── README.md                # 项目说明
```

## 学习目标

通过这个实验平台，你可以：

1. **理解 K-Means 算法原理**
   - 观察簇心如何移动
   - 理解簇分配过程
   - 学习收敛条件

2. **探索参数影响**
   - K 值对聚类结果的影响
   - 初始化方法的差异
   - 迭代次数与收敛的关系

3. **实践数据操作**
   - 创建自定义数据集
   - 观察不同数据分布的效果
   - 理解数据预处理的重要性

## 扩展学习

完成基础实验后，可以尝试：

1. **对比不同算法**：实现层次聚类、DBSCAN 等
2. **性能优化**：使用向量化计算、并行处理
3. **高级功能**：添加肘部法则、轮廓系数等评估指标
4. **数据集扩展**：导入真实数据集（如鸢尾花数据集）

## API 文档

### REST API

| 端点 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/` | GET | 主页面 | - |
| `/api/datasets` | GET | 获取数据集列表 | - |
| `/api/dataset/<name>` | GET | 加载指定数据集 | `name`: 数据集名称 |
| `/api/cluster` | POST | 初始化聚类 | `points`, `k`, `init_method`, `max_iterations` |

### WebSocket 事件

| 事件 | 方向 | 描述 |
|------|------|------|
| `step` | 客户端→服务器 | 执行单步聚类 |
| `run` | 客户端→服务器 | 自动运行聚类 |
| `reset` | 客户端→服务器 | 重置聚类状态 |
| `update` | 服务器→客户端 | 接收状态更新 |
| `complete` | 服务器→客户端 | 聚类完成通知 |
| `error` | 服务器→客户端 | 错误通知 |

## 常见问题

**Q: 为什么聚类结果每次都不一样？**
A: K-Means 对初始簇心敏感，使用 K-Means++ 初始化可以获得更稳定的结果。

**Q: 如何选择合适的 K 值？**
A: 可以使用肘部法则（Elbow Method）或轮廓系数（Silhouette Score）来评估。

**Q: 为什么算法不收敛？**
A: 可能是数据分布特殊或 K 值设置不当，尝试调整参数或增加迭代次数。

**Q: 如何导入自己的数据集？**
A: 参考 `data_manager.py` 中的实现，添加新的数据加载函数。

**Q: 应用无法启动怎么办？**
A: 检查端口 5000 是否被占用，或查看控制台错误信息。

## 性能优化建议

- 使用 NumPy 向量化计算提高算法性能
- 实现 Canvas 局部重绘优化前端动画
- 使用 Web Workers 处理复杂计算
- 实现数据缓存减少重复计算

## 相关资源

- [K-Means 算法详解 (Wikipedia)](https://en.wikipedia.org/wiki/K-means_clustering)
- [Scikit-learn K-Means 文档](https://scikit-learn.org/stable/modules/clustering.html#k-means)
- [Flask 官方文档](https://flask.palletsprojects.com/)
- [Socket.IO 文档](https://socket.io/docs/)
- [Canvas API 教程 (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 更新日志

### v1.0.0 (2026-05-04)
- ✨ 初始版本发布
- ✨ 实现 K-Means 聚类算法
- ✨ 提供 4 种预设数据集
- ✨ 支持参数实验和可视化
- ✨ 实现实时动画和交互操作

## 路线图

- [ ] 添加更多聚类算法（层次聚类、DBSCAN）
- [ ] 实现肘部法则自动选择 K 值
- [ ] 支持导入自定义数据集（CSV、JSON）
- [ ] 添加聚类评估指标（轮廓系数、Calinski-Harabasz）
- [ ] 实现数据导出功能
- [ ] 添加暗色主题
- [ ] 支持移动端适配

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 致谢

感谢所有为这个项目做出贡献的开发者！

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 [Issue](../../issues)
- 发送邮件至：your.email@example.com

---

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**
