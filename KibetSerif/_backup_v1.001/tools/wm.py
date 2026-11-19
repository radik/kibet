"""Rebuild the KIBET wordmark from Kibet Serif Display Regular with a curve-preserving
isotropic thinning (default 14 units), output as SVG with quadratic curves."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.pointPen import PointToSegmentPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb
from thin import thin_contour
P, OUT, OFF, TRACK = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
f = TTFont(P); glyf = f['glyf']
face = hb.Face(hb.Blob.from_file_path(P)); font = hb.Font(face)
buf = hb.Buffer(); buf.add_str('KIBET'); buf.guess_segment_properties(); hb.shape(font, buf, {'kern': True})
parts = []; x = 0
for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
    parts.append((f.getGlyphName(info.codepoint), x + pos.x_offset)); x += pos.x_advance + TRACK

def contours(name):
    g = glyf[name]; c = list(g.coordinates); fl = g.flags; s = 0; out = []
    for e in g.endPtsOfContours:
        pts = thin_contour(c[s:e + 1], OFF, OFF); on = [fl[i] & 1 for i in range(s, e + 1)]
        out.append(([(round(a, 1), round(b, 1)) for a, b in pts], on)); s = e + 1
    return out

def draw(pen):
    pp = PointToSegmentPen(pen)
    for name, dx in parts:
        for pts, on in contours(name):
            pp.beginPath()
            n = len(pts)
            for i, ((px, py), o) in enumerate(zip(pts, on)):
                if not o: t = None
                else: t = 'qcurve' if not on[i - 1] else 'line'
                pp.addPoint((px + dx, py), t)
            pp.endPath()

bp = BoundsPen(None); draw(bp); xmin, ymin, xmax, ymax = bp.bounds
sp = SVGPathPen(None, ntos=lambda v: ('%.1f' % v).rstrip('0').rstrip('.'))
draw(TransformPen(sp, (1, 0, 0, -1, -xmin, ymax)))
w, h = xmax - xmin, ymax - ymin
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}">'
       f'<title>KIBET</title><path fill="#000000" d="{sp.getCommands()}"/></svg>\n')
open(OUT, 'w').write(svg)
print(parts, 'size', round(w, 1), round(h, 1))
