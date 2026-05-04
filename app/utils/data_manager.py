import json
import os
from typing import List, Dict, Optional

class DataManager:
    def __init__(self, data_dir: str = 'data'):
        self.data_dir = data_dir
        self.preset_datasets = {
            'blobs': self._generate_blobs,
            'circles': self._generate_circles,
            'moons': self._generate_moons,
            'random': self._generate_random
        }

    def get_preset_datasets(self) -> List[str]:
        return list(self.preset_datasets.keys())

    def load_dataset(self, name: str) -> Optional[List[Dict]]:
        if name in self.preset_datasets:
            return self.preset_datasets[name]()
        return None

    def save_dataset(self, name: str, points: List[Dict]):
        os.makedirs(self.data_dir, exist_ok=True)
        filepath = os.path.join(self.data_dir, f'{name}.json')
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(points, f, ensure_ascii=False, indent=2)

    def _generate_blobs(self) -> List[Dict]:
        import numpy as np
        points = []
        centers = [(2, 2), (8, 8), (2, 8)]
        for cx, cy in centers:
            for _ in range(30):
                x = cx + np.random.randn() * 0.8
                y = cy + np.random.randn() * 0.8
                points.append({'x': float(x), 'y': float(y)})
        return points

    def _generate_circles(self) -> List[Dict]:
        import numpy as np
        points = []
        for _ in range(50):
            angle = np.random.uniform(0, 2 * np.pi)
            r = 2 + np.random.randn() * 0.2
            x = 5 + r * np.cos(angle)
            y = 5 + r * np.sin(angle)
            points.append({'x': float(x), 'y': float(y)})
        for _ in range(50):
            angle = np.random.uniform(0, 2 * np.pi)
            r = 4 + np.random.randn() * 0.2
            x = 5 + r * np.cos(angle)
            y = 5 + r * np.sin(angle)
            points.append({'x': float(x), 'y': float(y)})
        return points

    def _generate_moons(self) -> List[Dict]:
        import numpy as np
        points = []
        for _ in range(50):
            t = np.random.uniform(0, np.pi)
            x = np.cos(t) + np.random.randn() * 0.1
            y = np.sin(t) + np.random.randn() * 0.1
            points.append({'x': float(x), 'y': float(y)})
        for _ in range(50):
            t = np.random.uniform(0, np.pi)
            x = 1 - np.cos(t) + np.random.randn() * 0.1
            y = 1 - np.sin(t) - 0.5 + np.random.randn() * 0.1
            points.append({'x': float(x), 'y': float(y)})
        return points

    def _generate_random(self) -> List[Dict]:
        import numpy as np
        points = []
        for _ in range(100):
            x = np.random.uniform(0, 10)
            y = np.random.uniform(0, 10)
            points.append({'x': float(x), 'y': float(y)})
        return points
