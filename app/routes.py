from flask import Blueprint, render_template, jsonify, request
from flask_socketio import emit
from . import socketio
from .utils.kmeans_engine import KMeansEngine
from .utils.data_manager import DataManager

main = Blueprint('main', __name__)
data_manager = DataManager()
kmeans_engine = None

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/api/datasets', methods=['GET'])
def get_datasets():
    return jsonify({
        'success': True,
        'datasets': data_manager.get_preset_datasets()
    })

@main.route('/api/dataset/<name>', methods=['GET'])
def get_dataset(name):
    dataset = data_manager.load_dataset(name)
    if dataset:
        return jsonify({
            'success': True,
            'data': dataset
        })
    return jsonify({
        'success': False,
        'error': '数据集不存在'
    }), 404

@main.route('/api/cluster', methods=['POST'])
def cluster():
    global kmeans_engine
    data = request.get_json()

    if not data or 'points' not in data:
        return jsonify({
            'success': False,
            'error': '缺少数据点'
        }), 400

    points = data['points']
    k = data.get('k', 3)
    init_method = data.get('init_method', 'random')
    max_iterations = data.get('max_iterations', 100)

    if len(points) < k:
        return jsonify({
            'success': False,
            'error': 'K 值不能大于数据点数量'
        }), 400

    kmeans_engine = KMeansEngine(k=k, init_method=init_method, max_iterations=max_iterations)
    kmeans_engine.initialize(points)

    return jsonify({
        'success': True,
        'state': kmeans_engine.get_state()
    })

@socketio.on('step')
def handle_step():
    global kmeans_engine
    if kmeans_engine is None:
        emit('error', {'message': '请先初始化聚类'})
        return

    result = kmeans_engine.step()
    emit('update', result)

@socketio.on('run')
def handle_run():
    global kmeans_engine
    if kmeans_engine is None:
        emit('error', {'message': '请先初始化聚类'})
        return

    while not kmeans_engine.converged:
        result = kmeans_engine.step()
        emit('update', result)
        socketio.sleep(0.5)

    emit('complete', {'message': '聚类完成'})

@socketio.on('reset')
def handle_reset():
    global kmeans_engine
    kmeans_engine = None
    emit('reset', {'message': '已重置'})
