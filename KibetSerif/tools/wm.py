"""Step 3 of 3. KIBET wordmark (kibet-wordmark-thin.svg), version 1.002.
Letters from Kibet Serif Display Regular (same outlines as Regular), vertical stems thinned
by 14 units per side (Display Light uses 12), horizontal strokes and joints kept as in
Regular, so the joint of K stays solid. Letter positions are those of the approved
1.000 wordmark. Usage: python3 wm.py FONT.ttf OUT.svg"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.pointPen import PointToSegmentPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from thin import thin_contour

P, OUT = sys.argv[1], sys.argv[2]
STEM = 14
LEFT_EDGES = {'K': 0, 'I': 659, 'B': 986, 'E': 1595, 'T': 2161.1}   # from the 1.000 wordmark
f = TTFont(P); glyf = f['glyf']


def contours(name):
    g = glyf[name]; c = list(g.coordinates); fl = g.flags; s = 0; out = []
    for e in g.endPtsOfContours:
        pts = thin_contour(c[s:e + 1], STEM, 0)
        out.append((pts, [fl[i] & 1 for i in range(s, e + 1)])); s = e + 1
    return out


def draw_letter(pen, name, dx):
    pp = PointToSegmentPen(pen)
    for pts, on in contours(name):
        pp.beginPath()
        for i, ((px, py), o) in enumerate(zip(pts, on)):
            t = None if not o else ('qcurve' if not on[i - 1] else 'line')
            pp.addPoint((px + dx, py), t)
        pp.endPath()


placed = []
for name, left in LEFT_EDGES.items():
    bp = BoundsPen(None); draw_letter(bp, name, 0)
    placed.append((name, left - bp.bounds[0]))


def draw(pen):
    for name, dx in placed:
        draw_letter(pen, name, dx)


bp = BoundsPen(None); draw(bp); xmin, ymin, xmax, ymax = bp.bounds
sp = SVGPathPen(None, ntos=lambda v: ('%.1f' % v).rstrip('0').rstrip('.'))
draw(TransformPen(sp, (1, 0, 0, -1, -xmin, ymax)))
w, h = xmax - xmin, ymax - ymin
open(OUT, 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}">'
                     f'<title>KIBET</title><path fill="#000000" d="{sp.getCommands()}"/></svg>\n')
print('size', round(w, 1), round(h, 1))
