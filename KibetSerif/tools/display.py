"""Build Kibet Serif Display (Regular, Bold, Light) from the text fonts.

Display tightening, version 1.002: up to 11 units are taken from EACH side of a glyph
(22 per glyph in total), but a side is never brought below FLOOR units. Glyphs whose
serifs or diagonals already reach the edge (K, К, Ж, А, Х, У, k, к, x, y ...) keep that
side as is, and descender tails that overhang the glyph box (Җ) get up to 11 units back,
so they no longer run into their neighbours.
In 1.000/1.001 all 22 units were cut from the right side, which made K/К/Ж etc.
overlap the next letter (e.g. "КА" in Display Bold merged into one shape).

Step 2 of 3. Usage: python3 display.py FONT_DIR NAMES_DIR
(text fonts are read from FONT_DIR/otf_ttf, Display fonts are written to FONT_DIR/otf_ttf and
FONT_DIR/web; names and style bits are taken from the Display fonts in NAMES_DIR/otf_ttf)"""
import sys, io
from fontTools.ttLib import TTFont

D = sys.argv[1]
NAMES = sys.argv[2]
PER_SIDE = 11
FLOOR = 10
VERSION = 1.002
VSTR = 'Version 1.002; derived from PT Serif 1.000W (ParaType, OFL)'
SKIP = {'.notdef', '.null', 'space', 'uni00A0'}


def bounds(f, name):
    g = f['glyf'][name]
    if g.numberOfContours == 0:
        return None
    g.recalcBounds(f['glyf'])
    return g.xMin, g.xMax


def side_cut(sb_body, tail_overhang):
    """Units to take from one side.
    sb_body: side bearing of the glyph; tail_overhang: how far a descender tail sticks out
    past the glyph box on this side (Җ, җ), 0 if it does not.
    Sides that are already tight keep their spacing; an overhanging descender tail gets up
    to 11 units back, because the neighbour on that side is tightened."""
    if tail_overhang > 0:
        return -min(PER_SIDE, tail_overhang)
    return min(PER_SIDE, sb_body - FLOOR) if sb_body > FLOOR else 0


def outline_points(f, name):
    from fontTools.pens.recordingPen import DecomposingRecordingPen
    gs = f.getGlyphSet(); r = DecomposingRecordingPen(gs); gs[name].draw(r)
    return [p for _, args in r.value for p in args if p is not None]


def build(text_base, display_base):
    src = TTFont(f'{D}/otf_ttf/{text_base}.ttf')      # spacing source
    old = TTFont(f'{NAMES}/otf_ttf/{display_base}.ttf')   # names / OS/2 to keep
    f = src
    glyf, hmtx = f['glyf'], f['hmtx']
    shift, cut = {}, {}
    for name in f.getGlyphOrder():
        adv = hmtx[name][0]
        b = bounds(f, name)
        if name in SKIP or b is None or adv <= 2 * PER_SIDE:
            shift[name], cut[name] = 0, 0
            continue
        pts = outline_points(f, name)
        # overhang that belongs to a descender tail: ink past the box edge below the baseline
        left_tail = -min([x for x, y in pts if y < 0] or [0]) if min(y for _, y in pts) < -50 else 0
        right_tail = max([x for x, y in pts if y < 0] or [0]) - adv if min(y for _, y in pts) < -50 else 0
        rl = side_cut(b[0], left_tail)
        rr = side_cut(adv - b[1], right_tail)
        shift[name], cut[name] = -rl, rl + rr
    # move outlines; composites: compensate for the shift already applied to components
    for name in f.getGlyphOrder():
        g = glyf[name]
        if g.isComposite():
            for c in g.components:
                # a flipped component (Һ = rotated Ч, ģ) moves the other way
                xx, xy = (c.transform[0][0], c.transform[0][1]) if hasattr(c, 'transform') else (1, 0)
                c.x += round(shift[name] - shift[c.glyphName] * xx)
                c.y += round(-shift[c.glyphName] * xy)
        elif g.numberOfContours > 0:
            g.coordinates.translate((shift[name], 0))
    for name in f.getGlyphOrder():
        adv, _ = hmtx[name]
        hmtx[name] = (adv - cut[name], 0)
    for name in f.getGlyphOrder():
        b = bounds(f, name)
        hmtx[name] = (hmtx[name][0], b[0] if b else 0)
    f['name'] = old['name']
    o, oo = f['OS/2'], old['OS/2']
    for a in ('usWeightClass', 'fsSelection', 'achVendID'):
        setattr(o, a, getattr(oo, a))
    o.panose = oo.panose
    ws = [w for w, _ in hmtx.metrics.values() if w > 0]
    o.xAvgCharWidth = round(sum(ws) / len(ws))
    f['head'].fontRevision = VERSION
    for rec in list(f['name'].names):
        if rec.nameID == 5:
            f['name'].setName(VSTR, 5, rec.platformID, rec.platEncID, rec.langID)
        if rec.nameID == 3:
            s = rec.toUnicode().replace('1.001;', '1.002;').replace('1.000;', '1.002;')
            f['name'].setName(s, 3, rec.platformID, rec.platEncID, rec.langID)
    buf = io.BytesIO(); f.save(buf)
    open(f'{D}/otf_ttf/{display_base}.ttf', 'wb').write(buf.getvalue())
    w = TTFont(io.BytesIO(buf.getvalue())); w.flavor = 'woff2'
    w.save(f'{D}/web/{display_base}.woff2')
    from collections import Counter
    print(display_base, 'cut per glyph:', Counter(cut.values()).most_common(6))


for t, d in (('KibetSerif-Regular', 'KibetSerifDisplay-Regular'),
             ('KibetSerif-Bold', 'KibetSerifDisplay-Bold'),
             ('KibetSerif-Light', 'KibetSerifDisplay-Light')):
    build(t, d)
