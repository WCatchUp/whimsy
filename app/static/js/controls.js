class Controls {
    constructor() {
        this.datasetSelect = document.getElementById('dataset-select');
        this.loadDatasetBtn = document.getElementById('load-dataset');
        this.kValueInput = document.getElementById('k-value');
        this.kDisplay = document.getElementById('k-display');
        this.initMethodSelect = document.getElementById('init-method');
        this.maxIterInput = document.getElementById('max-iter');
        this.btnInit = document.getElementById('btn-init');
        this.btnStep = document.getElementById('btn-step');
        this.btnRun = document.getElementById('btn-run');
        this.btnReset = document.getElementById('btn-reset');

        this.callbacks = {
            onInit: null,
            onStep: null,
            onRun: null,
            onReset: null,
            onLoadDataset: null
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.kValueInput.addEventListener('input', () => {
            this.kDisplay.textContent = this.kValueInput.value;
        });

        this.loadDatasetBtn.addEventListener('click', () => {
            const dataset = this.datasetSelect.value;
            if (dataset && this.callbacks.onLoadDataset) {
                this.callbacks.onLoadDataset(dataset);
            }
        });

        this.btnInit.addEventListener('click', () => {
            if (this.callbacks.onInit) {
                this.callbacks.onInit();
            }
        });

        this.btnStep.addEventListener('click', () => {
            if (this.callbacks.onStep) {
                this.callbacks.onStep();
            }
        });

        this.btnRun.addEventListener('click', () => {
            if (this.callbacks.onRun) {
                this.callbacks.onRun();
            }
        });

        this.btnReset.addEventListener('click', () => {
            if (this.callbacks.onReset) {
                this.callbacks.onReset();
            }
        });
    }

    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    populateDatasets(datasets) {
        this.datasetSelect.innerHTML = '<option value="">选择预设数据集</option>';
        datasets.forEach(dataset => {
            const option = document.createElement('option');
            option.value = dataset;
            option.textContent = dataset.charAt(0).toUpperCase() + dataset.slice(1);
            this.datasetSelect.appendChild(option);
        });
    }

    getParameters() {
        return {
            k: parseInt(this.kValueInput.value),
            init_method: this.initMethodSelect.value,
            max_iterations: parseInt(this.maxIterInput.value)
        };
    }

    setRunningState(isRunning) {
        this.btnStep.disabled = isRunning;
        this.btnRun.disabled = isRunning;
        this.btnInit.disabled = isRunning;
        this.loadDatasetBtn.disabled = isRunning;
        this.kValueInput.disabled = isRunning;
        this.initMethodSelect.disabled = isRunning;
        this.maxIterInput.disabled = isRunning;
    }

    setInitializedState(isInitialized) {
        this.btnStep.disabled = !isInitialized;
        this.btnRun.disabled = !isInitialized;
    }

    setCompletedState() {
        this.btnStep.disabled = true;
        this.btnRun.disabled = true;
        this.btnInit.disabled = false;
        this.loadDatasetBtn.disabled = false;
        this.kValueInput.disabled = false;
        this.initMethodSelect.disabled = false;
        this.maxIterInput.disabled = false;
    }

    reset() {
        this.btnStep.disabled = true;
        this.btnRun.disabled = true;
        this.btnInit.disabled = false;
        this.loadDatasetBtn.disabled = false;
        this.kValueInput.disabled = false;
        this.initMethodSelect.disabled = false;
        this.maxIterInput.disabled = false;
    }
}
