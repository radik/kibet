import math
MITER = 2.0

def thin_contour(pts, xs, ys):
    """Move every point (on- and off-curve) inward along the corner bisector.
    TrueType outer contours are clockwise, so ink lies to the right of travel:
    the inward normal of direction (dx, dy) is (dy, -dx)."""
    n = len(pts)
    out = []
    for i in range(n):
        px, py = pts[i]
        j = (i - 1) % n
        while pts[j] == pts[i] and j != i:
            j = (j - 1) % n
        k = (i + 1) % n
        while pts[k] == pts[i] and k != i:
            k = (k + 1) % n
        ax, ay = px - pts[j][0], py - pts[j][1]
        bx, by = pts[k][0] - px, pts[k][1] - py
        la, lb = math.hypot(ax, ay), math.hypot(bx, by)
        if la == 0 or lb == 0:
            out.append((px, py)); continue
        ax, ay, bx, by = ax / la, ay / la, bx / lb, by / lb
        n1 = (ay, -ax); n2 = (by, -bx)
        d = n1[0] * n2[0] + n1[1] * n2[1]
        if d <= -0.9375:          # needle-sharp corner: leave in place (as FreeType does)
            out.append((px, py)); continue
        mx, my = (n1[0] + n2[0]) / (1 + d), (n1[1] + n2[1]) / (1 + d)
        ml = math.hypot(mx, my)
        if ml > MITER:            # sharp wedge: cap the miter so tips don't run into neighbours
            mx, my = mx * MITER / ml, my * MITER / ml
        sx, sy = mx * xs, my * ys
        # never move a point further than the shorter adjacent segment
        lim = min(la, lb)
        mag = math.hypot(sx, sy)
        if mag > lim:
            sx, sy = sx * lim / mag, sy * lim / mag
        out.append((px + sx, py + sy))
    return out


