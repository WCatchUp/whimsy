import numpy as np
from typing import List, Dict, Tuple

class KMeansEngine:
    def __init__(self, k: int = 3, init_method: str = 'random', max_iterations: int = 100):
        self.k = k
        self.init_method = init_method
        self.max_iterations = max_iterations
        self.points = []
        self.centroids = []
        self.assignments = []
        self.iteration = 0
        self.converged = False
        self.sse = 0.0

    def initialize(self, points: List[Dict]):
        self.points = np.array([[p['x'], p['y']] for p in points])
        self.iteration = 0
        self.converged = False
        self.assignments = [-1] * len(self.points)

        if self.init_method == 'random':
            indices = np.random.choice(len(self.points), self.k, replace=False)
            self.centroids = self.points[indices].copy()
        elif self.init_method == 'kmeans++':
            self.centroids = self._kmeans_plus_plus_init()
        else:
            self.centroids = self.points[:self.k].copy()

        self._calculate_sse()

    def _kmeans_plus_plus_init(self) -> np.ndarray:
        centroids = []
        first_idx = np.random.randint(len(self.points))
        centroids.append(self.points[first_idx])

        for _ in range(1, self.k):
            distances = np.array([
                min([np.linalg.norm(p - c) ** 2 for c in centroids])
                for p in self.points
            ])
            probabilities = distances / distances.sum()
            next_idx = np.random.choice(len(self.points), p=probabilities)
            centroids.append(self.points[next_idx])

        return np.array(centroids)

    def step(self) -> Dict:
        if self.converged:
            return self.get_state()

        old_centroids = self.centroids.copy()

        self.assignments = self._assign_clusters()
        self.centroids = self._update_centroids()
        self.iteration += 1
        self._calculate_sse()

        if np.allclose(old_centroids, self.centroids, atol=1e-4):
            self.converged = True

        if self.iteration >= self.max_iterations:
            self.converged = True

        return self.get_state()

    def _assign_clusters(self) -> List[int]:
        assignments = []
        for point in self.points:
            distances = [np.linalg.norm(point - centroid) for centroid in self.centroids]
            assignments.append(int(np.argmin(distances)))
        return assignments

    def _update_centroids(self) -> np.ndarray:
        new_centroids = []
        for i in range(self.k):
            cluster_points = self.points[np.array(self.assignments) == i]
            if len(cluster_points) > 0:
                new_centroids.append(cluster_points.mean(axis=0))
            else:
                new_centroids.append(self.centroids[i])
        return np.array(new_centroids)

    def _calculate_sse(self):
        sse = 0.0
        for i, point in enumerate(self.points):
            centroid = self.centroids[self.assignments[i]]
            sse += np.linalg.norm(point - centroid) ** 2
        self.sse = sse

    def get_state(self) -> Dict:
        points_data = []
        for i, point in enumerate(self.points):
            points_data.append({
                'x': float(point[0]),
                'y': float(point[1]),
                'cluster': self.assignments[i] if i < len(self.assignments) else -1
            })

        centroids_data = []
        for i, centroid in enumerate(self.centroids):
            centroids_data.append({
                'id': i,
                'x': float(centroid[0]),
                'y': float(centroid[1])
            })

        return {
            'k': self.k,
            'iteration': self.iteration,
            'converged': self.converged,
            'sse': float(self.sse),
            'points': points_data,
            'centroids': centroids_data
        }
