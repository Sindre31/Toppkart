"""Least-cost ascent router over the Kartverket terrain model.

Given a corridor (trailhead -> waypoints -> summit) this finds the line a ski
tourer would actually skin, by running Dijkstra over the DTM with a cost that
prices the things that matter on the way up:

  * gentle skinning gradient is cheap, steep is expensive, ~45 deg is impassable
  * losing height on an ascent is penalised
  * traversing a steep side-slope is penalised even when the step itself is flat,
    which is what keeps the line off cliff bands and out of terrain traps
  * sea is impassable; frozen lakes are not (this is a winter product)

The corridor comes from route research; the geometry comes from here. Neither is
much use without the other: the terrain model does not know which valley the
standard tour uses, and the route description does not know where the cliffs are.
"""

import heapq
import json
import math

import numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import dijkstra

from geo import Dem, dem_tile, haversine

# 16-neighbour connectivity: the 8 compass steps plus knight moves. The knight
# moves matter — with 8 neighbours a diagonal line can only be built from 45 deg
# staircases, which puts a visible sawtooth on every traverse.
OFFSETS = [
    (-1, -1), (-1, 0), (-1, 1),
    (0, -1), (0, 1),
    (1, -1), (1, 0), (1, 1),
    (-1, -2), (-1, 2), (1, -2), (1, 2),
    (-2, -1), (-2, 1), (2, -1), (2, 1),
]

MAX_ANGLE = 45.0      # steeper than this is not a skinning line
SEA_LEVEL = 0.4       # DTM metres below which we call it sea
TARGET_PX = 620       # long side of the routing grid


def _slope_deg(z, mx, my):
    dzdy, dzdx = np.gradient(z, my, mx)
    return np.degrees(np.arctan(np.hypot(dzdx, dzdy)))


def _step_factor(theta):
    """Cost multiplier for skinning at `theta` degrees (negative = downhill)."""
    f = np.ones_like(theta)

    up = theta >= 0
    t = np.clip(theta, 0, None)
    # Cheap and linear up to ~20 deg, then quadratic — that is roughly where
    # skinning stops being efficient and starts needing kick turns.
    f = np.where(up, 1.0 + 0.8 * np.minimum(t, 20.0) / 20.0, f)
    f = np.where(up & (t > 20), 1.8 + ((t - 20.0) / 5.0) ** 2, f)
    f = np.where(up & (t > 38), (1.8 + ((t - 20.0) / 5.0) ** 2) * 30.0, f)

    down = ~up
    a = np.abs(np.clip(theta, None, 0))
    # An ascent that gives back height is usually the router cheating; a steep
    # drop is a cliff we should not be standing on at all.
    f = np.where(down, 1.0 + 3.0 * a / 20.0, f)
    f = np.where(down & (a > 40), (1.0 + 3.0 * a / 20.0) * 25.0, f)
    return f


class Router:
    def __init__(self, points, pad_m=900):
        lats = [p[0] for p in points]
        lngs = [p[1] for p in points]
        midlat = (min(lats) + max(lats)) / 2
        dlat = pad_m / 110540.0
        dlng = pad_m / (111320.0 * math.cos(math.radians(midlat)))
        minlat, maxlat = min(lats) - dlat, max(lats) + dlat
        minlng, maxlng = min(lngs) - dlng, max(lngs) + dlng

        span_y = (maxlat - minlat) * 110540.0
        span_x = (maxlng - minlng) * 111320.0 * math.cos(math.radians(midlat))
        res = max(span_x, span_y) / TARGET_PX
        width = max(64, int(round(span_x / res)))
        height = max(64, int(round(span_y / res)))

        key = f"route_{minlat:.4f}_{minlng:.4f}_{maxlat:.4f}_{maxlng:.4f}_{width}x{height}"
        self.dem = Dem(dem_tile(key, minlng, minlat, maxlng, maxlat, width, height))
        self.res_m = res
        d = self.dem
        self.z = np.where(np.isnan(d.z), -9999.0, d.z)
        self.blocked = np.isnan(d.z) | (d.z < SEA_LEVEL)
        self.slope = _slope_deg(np.where(np.isnan(d.z), 0.0, d.z), d.mx, d.my)
        self._graph = None

    def _build_graph(self):
        d = self.dem
        H, W = d.height, d.width
        idx = np.arange(H * W).reshape(H, W)
        rows, cols, data = [], [], []

        # Traversing steep ground is costly even on a flat step: this is the term
        # that steers the line onto benches and ridges instead of across faces.
        side = 1.0 + (np.clip(self.slope, 0, None) / 28.0) ** 3

        for dr, dc in OFFSETS:
            r0, r1 = max(0, -dr), min(H, H - dr)
            c0, c1 = max(0, -dc), min(W, W - dc)
            if r0 >= r1 or c0 >= c1:
                continue
            src = idx[r0:r1, c0:c1]
            dst = idx[r0 + dr : r1 + dr, c0 + dc : c1 + dc]

            za = self.z[r0:r1, c0:c1]
            zb = self.z[r0 + dr : r1 + dr, c0 + dc : c1 + dc]
            ba = self.blocked[r0:r1, c0:c1]
            bb = self.blocked[r0 + dr : r1 + dr, c0 + dc : c1 + dc]

            dist = math.hypot(dr * d.my, dc * d.mx)
            dz = zb - za
            theta = np.degrees(np.arctan2(dz, dist))
            cost = dist * _step_factor(theta) * side[r0 + dr : r1 + dr, c0 + dc : c1 + dc]

            bad = ba | bb | (np.abs(theta) > MAX_ANGLE)
            keep = ~bad
            rows.append(src[keep])
            cols.append(dst[keep])
            data.append(cost[keep])

        rows = np.concatenate(rows)
        cols = np.concatenate(cols)
        data = np.concatenate(data)
        self._graph = coo_matrix((data, (rows, cols)), shape=(H * W, H * W)).tocsr()

    def snap(self, lat, lng, max_px=25):
        """Nearest routable cell to a coordinate."""
        d = self.dem
        row, col = d.rc(lat, lng)
        row = min(max(row, 0), d.height - 1)
        col = min(max(col, 0), d.width - 1)
        if not self.blocked[row, col]:
            return row, col
        for rad in range(1, max_px + 1):
            r0, r1 = max(0, row - rad), min(d.height, row + rad + 1)
            c0, c1 = max(0, col - rad), min(d.width, col + rad + 1)
            sub = self.blocked[r0:r1, c0:c1]
            free = np.argwhere(~sub)
            if len(free):
                rr, cc = free[0]
                return r0 + int(rr), c0 + int(cc)
        raise RuntimeError(f"no routable cell near {lat},{lng}")

    def leg(self, a, b):
        """Cell path between two coordinates, inclusive of both ends."""
        if self._graph is None:
            self._build_graph()
        d = self.dem
        ra, ca = self.snap(*a)
        rb, cb = self.snap(*b)
        src = ra * d.width + ca
        tgt = rb * d.width + cb
        _, pred = dijkstra(self._graph, indices=src, return_predecessors=True)
        if pred[tgt] == -9999 and tgt != src:
            raise RuntimeError(f"no route {a} -> {b}")
        path = [tgt]
        while path[-1] != src:
            nxt = pred[path[-1]]
            if nxt < 0:
                raise RuntimeError(f"broken predecessor chain {a} -> {b}")
            path.append(int(nxt))
        path.reverse()
        return [divmod(p, d.width) for p in path]

    def route(self, corridor):
        """Full path through an ordered corridor of coordinates."""
        cells = []
        for a, b in zip(corridor, corridor[1:]):
            seg = self.leg(a, b)
            cells.extend(seg if not cells else seg[1:])
        return cells

    def elevation_at(self, lat, lng):
        """Bilinear DTM sample."""
        d = self.dem
        y = (lat - d.lat0) / d.dlat - 0.5
        x = (lng - d.lng0) / d.dlng - 0.5
        r = min(max(y, 0), d.height - 1.001)
        c = min(max(x, 0), d.width - 1.001)
        r0, c0 = int(r), int(c)
        fr, fc = r - r0, c - c0
        z = self.z
        v = (
            z[r0, c0] * (1 - fr) * (1 - fc)
            + z[r0 + 1, c0] * fr * (1 - fc)
            + z[r0, c0 + 1] * (1 - fr) * fc
            + z[r0 + 1, c0 + 1] * fr * fc
        )
        return float(v)


# ---------------------------------------------------------------- geometry


def cells_to_latlng(dem, cells):
    return [dem.latlng(r, c) for r, c in cells]


def _perp_m(p, a, b):
    """Perpendicular distance p->ab, in metres, in a local flat frame."""
    latscale = 110540.0
    lngscale = 111320.0 * math.cos(math.radians(a[0]))
    ax, ay = a[1] * lngscale, a[0] * latscale
    bx, by = b[1] * lngscale, b[0] * latscale
    px, py = p[1] * lngscale, p[0] * latscale
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def simplify(points, eps_m):
    """Douglas-Peucker — strips the grid staircase without losing the shape."""
    if len(points) < 3:
        return list(points)
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        worst, wi = -1.0, -1
        for k in range(i + 1, j):
            dd = _perp_m(points[k], points[i], points[j])
            if dd > worst:
                worst, wi = dd, k
        if worst > eps_m:
            keep[wi] = True
            stack.append((i, wi))
            stack.append((wi, j))
    return [p for p, k in zip(points, keep) if k]


def turn_deg(a, b, c):
    """How far the line turns at b, in degrees. 0 is straight on, 180 doubles back."""
    lngscale = 111320.0 * math.cos(math.radians(b[0]))
    ax, ay = (a[1] - b[1]) * lngscale, (a[0] - b[0]) * 110540.0
    cx, cy = (c[1] - b[1]) * lngscale, (c[0] - b[0]) * 110540.0
    if (ax == 0 and ay == 0) or (cx == 0 and cy == 0):
        return 0.0
    return 180.0 - math.degrees(
        math.acos(max(-1.0, min(1.0, (ax * cx + ay * cy) / (math.hypot(ax, ay) * math.hypot(cx, cy)))))
    )


# A skin track turns through nearly 180° at every kick turn, and those corners
# are the route: they are how the line stays at a skinnable angle on ground that
# is not. Both smoothing passes below cut corners, which on an open slope is what
# you want and on a switchback deletes the zigzag — the line then runs straight
# up the fall line between two legs of the track. On Hamperokken that replaced
# 376 m of walking at 14° with a 30 m chord at 48°, and the 48° was then reported
# as the terrain being unskiable. Corners sharper than this are kept intact.
KICK_TURN_DEG = 55.0


def chaikin(points, iterations=2, keep_turn_deg=KICK_TURN_DEG):
    """Corner cutting, endpoints and kick turns pinned."""
    pts = list(points)
    for _ in range(iterations):
        if len(pts) < 3:
            break
        sharp = {
            i
            for i in range(1, len(pts) - 1)
            if turn_deg(pts[i - 1], pts[i], pts[i + 1]) >= keep_turn_deg
        }
        out = [pts[0]]
        for i, (a, b) in enumerate(zip(pts, pts[1:])):
            if i in sharp:
                out.append(a)
            out.append((a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25))
            out.append((a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75))
            if i + 1 in sharp:
                out.append(b)
        out.append(pts[-1])
        pts = out
    return pts


def resample(points, step_m):
    """Even spacing along the line — endpoints and every input vertex preserved.

    Interpolated points are added *between* the input vertices rather than
    instead of them. Dropping a vertex is only safe where the line is straight,
    and the places it is not straight are exactly the kick turns; a step longer
    than a switchback leg would otherwise skip the apex and join the two legs
    with a chord straight up the fall line.
    """
    if len(points) < 2:
        return list(points)
    out = [points[0]]
    carry = 0.0
    for a, b in zip(points, points[1:]):
        seg = haversine(a[0], a[1], b[0], b[1])
        if seg <= 0:
            continue
        t = step_m - carry
        while t <= seg:
            f = t / seg
            out.append((a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f))
            t += step_m
        carry = (carry + seg) % step_m
        out.append(b)
    out[-1] = points[-1]
    return out


def path_length_m(points):
    return sum(haversine(a[0], a[1], b[0], b[1]) for a, b in zip(points, points[1:]))


# Shortest run of ground over which calling something «a slope» means anything.
# Below this the number is the terrain model's own noise: on Hamperokken the
# steepest «step» in the line was 1.5 m long and 2.0 m high, which is not a
# 53° slope, it is two adjacent DTM cells disagreeing.
SLOPE_WINDOW_M = 30.0


def steepest_span(points, elevations, window_m=SLOPE_WINDOW_M):
    """Steepest sustained gradient along the line: (degrees, start index, end index).

    Measured over the ground actually covered rather than between neighbouring
    vertices, for two reasons that both used to inflate it:

    - Adjacent vertices can be a metre apart, and a metre of DTM1 is noise.
    - A skin track's straight-line displacement across a kick turn is nearly
      zero while its climb is not, so the chord between two points either side
      of a switchback reads as a cliff. Walking distance is also the honest
      denominator: it is what the skier climbs over.

    The indices come back because a guide that says "the steepest step measures
    29 degrees" is worth little next to one that says where it is, and the two
    elevations are then a measurement the checker can source rather than prose.
    """
    if len(points) < 2:
        return 0.0, 0, 0
    d = [0.0]
    for a, b in zip(points, points[1:]):
        d.append(d[-1] + haversine(a[0], a[1], b[0], b[1]))

    worst = (0.0, 0, 0)
    j = 0
    for i in range(len(points)):
        j = max(j, i + 1)
        while j < len(points) and d[j] - d[i] < window_m:
            j += 1
        if j >= len(points):
            break
        run = d[j] - d[i]
        ang = abs(math.degrees(math.atan2(elevations[j] - elevations[i], run)))
        if ang > worst[0]:
            worst = (ang, i, j)
    return worst


def steepest_gradient(points, elevations, window_m=SLOPE_WINDOW_M):
    """Just the angle from `steepest_span`, for callers that only price the line."""
    return steepest_span(points, elevations, window_m)[0]
