class Metrics {
    constructor() {
        this.iterationElement = document.getElementById('metric-iteration');
        this.sseElement = document.getElementById('metric-sse');
        this.convergedElement = document.getElementById('metric-converged');
    }

    update(state) {
        this.iterationElement.textContent = state.iteration || 0;
        this.sseElement.textContent = (state.sse || 0).toFixed(2);

        if (state.converged) {
            this.convergedElement.textContent = '已收敛';
            this.convergedElement.style.color = '#4ECDC4';
        } else if (state.iteration > 0) {
            this.convergedElement.textContent = '进行中';
            this.convergedElement.style.color = '#FFEAA7';
        } else {
            this.convergedElement.textContent = '未开始';
            this.convergedElement.style.color = '#667eea';
        }
    }

    reset() {
        this.iterationElement.textContent = '0';
        this.sseElement.textContent = '0.00';
        this.convergedElement.textContent = '未开始';
        this.convergedElement.style.color = '#667eea';
    }
}
