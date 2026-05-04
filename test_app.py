#!/usr/bin/env python
"""K-Means 聚类实验平台 - 功能测试"""

import requests
import json
import time

BASE_URL = 'http://localhost:5000'

def test_index():
    """测试主页是否可访问"""
    response = requests.get(BASE_URL)
    assert response.status_code == 200
    assert 'K-Means 聚类实验平台' in response.text
    print('✓ 主页测试通过')

def test_datasets_api():
    """测试数据集 API"""
    response = requests.get(f'{BASE_URL}/api/datasets')
    data = response.json()
    assert data['success'] == True
    assert 'datasets' in data
    assert len(data['datasets']) > 0
    print('✓ 数据集列表 API 测试通过')

def test_load_dataset():
    """测试加载数据集"""
    response = requests.get(f'{BASE_URL}/api/dataset/blobs')
    data = response.json()
    assert data['success'] == True
    assert 'data' in data
    assert len(data['data']) > 0
    assert 'x' in data['data'][0]
    assert 'y' in data['data'][0]
    print('✓ 加载数据集 API 测试通过')

def test_cluster_api():
    """测试聚类 API"""
    points = [
        {'x': 1.0, 'y': 1.0},
        {'x': 2.0, 'y': 2.0},
        {'x': 8.0, 'y': 8.0},
        {'x': 9.0, 'y': 9.0}
    ]

    response = requests.post(f'{BASE_URL}/api/cluster', json={
        'points': points,
        'k': 2,
        'init_method': 'random',
        'max_iterations': 10
    })

    data = response.json()
    assert data['success'] == True
    assert 'state' in data
    assert 'points' in data['state']
    assert 'centroids' in data['state']
    assert 'k' in data['state']
    assert 'iteration' in data['state']
    print('✓ 聚类 API 测试通过')

def test_cluster_validation():
    """测试聚类参数验证"""
    points = [{'x': 1.0, 'y': 1.0}]

    response = requests.post(f'{BASE_URL}/api/cluster', json={
        'points': points,
        'k': 5,
        'init_method': 'random',
        'max_iterations': 10
    })

    data = response.json()
    assert data['success'] == False
    assert 'error' in data
    print('✓ 参数验证测试通过')

def run_all_tests():
    """运行所有测试"""
    print('\n开始测试 K-Means 聚类实验平台...\n')

    try:
        test_index()
        test_datasets_api()
        test_load_dataset()
        test_cluster_api()
        test_cluster_validation()

        print('\n✓ 所有测试通过！')
        print('\n测试总结：')
        print('- 主页可访问')
        print('- API 端点正常工作')
        print('- 数据集加载正常')
        print('- 聚类算法正常运行')
        print('- 参数验证有效')

    except AssertionError as e:
        print(f'\n✗ 测试失败: {e}')
    except requests.exceptions.ConnectionError:
        print('\n✗ 无法连接到服务器，请确保应用正在运行')
        print('运行命令: python run.py')

if __name__ == '__main__':
    run_all_tests()
