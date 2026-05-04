class ClusterCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.centroids = [];
        this.isDragging = false;
        this.dragIndex = -1;
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];

        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.draw();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        window.addEventListener('resize', () => this.setupCanvas());
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
            if (distance < 10) {
                this.isDragging = true;
                this.dragIndex = i;
                return;
            }
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging || this.dragIndex === -1) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.points[this.dragIndex].x = x;
        this.points[this.dragIndex].y = y;
        this.draw();
    }

    handleMouseUp() {
        this.isDragging = false;
        this.dragIndex = -1;
    }

    handleClick(e) {
        if (this.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
            if (distance < 10) {
                this.points.splice(i, 1);
                this.draw();
                return;
            }
        }

        this.points.push({ x, y, cluster: -1 });
        this.draw();
    }

    setPoints(points) {
        this.points = points.map(p => ({
            x: p.x * (this.canvas.width / 10),
            y: p.y * (this.canvas.height / 10),
            cluster: p.cluster || -1
        }));
        this.draw();
    }

    setCentroids(centroids) {
        this.centroids = centroids.map(c => ({
            x: c.x * (this.canvas.width / 10),
            y: c.y * (this.canvas.height / 10),
            id: c.id
        }));
        this.draw();
    }

    updateState(state) {
        if (state.points) {
            this.points = state.points.map(p => ({
                x: p.x * (this.canvas.width / 10),
                y: p.y * (this.canvas.height / 10),
                cluster: p.cluster
            }));
        }
        if (state.centroids) {
            this.centroids = state.centroids.map(c => ({
                x: c.x * (this.canvas.width / 10),
                y: c.y * (this.canvas.height / 10),
                id: c.id
            }));
        }
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGrid();

        for (let i = 0; i < this.points.length; i++) {
            this.drawPoint(this.points[i], i);
        }

        for (let i = 0; i < this.centroids.length; i++) {
            this.drawCentroid(this.centroids[i]);
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawPoint(point, index) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);

        if (point.cluster >= 0) {
            this.ctx.fillStyle = this.colors[point.cluster % this.colors.length];
        } else {
            this.ctx.fillStyle = '#999';
        }

        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.fillStyle = '#333';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(index.toString(), point.x, point.y - 12);
    }

    drawCentroid(centroid) {
        this.ctx.beginPath();
        this.ctx.arc(centroid.x, centroid.y, 12, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colors[centroid.id % this.colors.length];
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(centroid.x, centroid.y, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();

        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`C${centroid.id}`, centroid.x, centroid.y - 16);
    }

    getPointsData() {
        return this.points.map(p => ({
            x: p.x / (this.canvas.width / 10),
            y: p.y / (this.canvas.height / 10)
        }));
    }

    clear() {
        this.points = [];
        this.centroids = [];
        this.draw();
    }
}
