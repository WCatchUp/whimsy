class App {
    constructor() {
        this.canvas = new ClusterCanvas('cluster-canvas');
        this.controls = new Controls();
        this.metrics = new Metrics();
        this.socket = io();
        this.isInitialized = false;

        this.setupSocketListeners();
        this.setupControlCallbacks();
        this.loadDatasets();
    }

    setupSocketListeners() {
        this.socket.on('connect', () => {
            console.log('已连接到服务器');
        });

        this.socket.on('update', (state) => {
            this.canvas.updateState(state);
            this.metrics.update(state);

            if (state.converged) {
                this.controls.setCompletedState();
                this.showMessage('聚类已完成！', 'success');
            }
        });

        this.socket.on('complete', (data) => {
            this.controls.setCompletedState();
            this.showMessage(data.message, 'success');
        });

        this.socket.on('reset', (data) => {
            this.isInitialized = false;
            this.canvas.clear();
            this.metrics.reset();
            this.controls.reset();
            this.showMessage(data.message, 'info');
        });

        this.socket.on('error', (data) => {
            this.showMessage(data.message, 'error');
        });

        this.socket.on('disconnect', () => {
            console.log('已断开连接');
        });
    }

    setupControlCallbacks() {
        this.controls.setCallbacks({
            onInit: () => this.initializeClustering(),
            onStep: () => this.executeStep(),
            onRun: () => this.runClustering(),
            onReset: () => this.resetClustering(),
            onLoadDataset: (dataset) => this.loadDataset(dataset)
        });
    }

    async loadDatasets() {
        try {
            const response = await fetch('/api/datasets');
            const data = await response.json();

            if (data.success) {
                this.controls.populateDatasets(data.datasets);
            }
        } catch (error) {
            console.error('加载数据集列表失败:', error);
        }
    }

    async loadDataset(name) {
        try {
            const response = await fetch(`/api/dataset/${name}`);
            const data = await response.json();

            if (data.success) {
                this.canvas.setPoints(data.data);
                this.showMessage(`已加载数据集: ${name}`, 'success');
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            this.showMessage('加载数据集失败', 'error');
        }
    }

    async initializeClustering() {
        const points = this.canvas.getPointsData();

        if (points.length < 2) {
            this.showMessage('请至少添加 2 个数据点', 'error');
            return;
        }

        const params = this.controls.getParameters();

        if (params.k > points.length) {
            this.showMessage('K 值不能大于数据点数量', 'error');
            return;
        }

        try {
            const response = await fetch('/api/cluster', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    points: points,
                    ...params
                })
            });

            const data = await response.json();

            if (data.success) {
                this.isInitialized = true;
                this.canvas.updateState(data.state);
                this.metrics.update(data.state);
                this.controls.setInitializedState(true);
                this.showMessage('初始化完成，可以开始聚类', 'success');
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            this.showMessage('初始化失败', 'error');
        }
    }

    executeStep() {
        if (!this.isInitialized) {
            this.showMessage('请先初始化聚类', 'error');
            return;
        }
        this.socket.emit('step');
    }

    runClustering() {
        if (!this.isInitialized) {
            this.showMessage('请先初始化聚类', 'error');
            return;
        }
        this.controls.setRunningState(true);
        this.socket.emit('run');
    }

    resetClustering() {
        this.socket.emit('reset');
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;

        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        switch (type) {
            case 'success':
                messageDiv.style.background = 'linear-gradient(135deg, #4ECDC4, #45B7D1)';
                break;
            case 'error':
                messageDiv.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
                break;
            default:
                messageDiv.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
