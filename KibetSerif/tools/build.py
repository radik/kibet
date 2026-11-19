"""Step 1 of 3 (then display.py, then wm.py).
Rebuild Kibet Serif Light from Regular with curve-preserving thinning,
plus small metadata fixes for all fonts. Usage: python3 build.py SRC_DIR OUT_DIR"""
import sys, os, math, io, copy
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates
from fontTools.pens.areaPen import AreaPen
import ttfautohint

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT + '/otf_ttf', exist_ok=True)
os.makedirs(OUT + '/web', exist_ok=True)
VERSION = 1.002
VSTR = 'Version 1.002; derived from PT Serif 1.000W (ParaType, OFL)'

STEM_X = 12      # per side, horizontal thinning of stems (units, UPM 1000)
STAR = 5       # per side, isotropic thinning for the Kibet star
MITER = 2.0      # max miter length (in units of the offset)
SHIFT = -6       # recentring after advance -12


from thin import thin_contour


def thin_glyph(glyf, name, xs, ys, shift):
    g = glyf[name]
    if g.isComposite():
        return
    if g.numberOfContours <= 0:
        return
    coords = list(g.coordinates)
    ends = g.endPtsOfContours
    new = []
    start = 0
    for e in ends:
        new += thin_contour(coords[start:e + 1], xs, ys)
        start = e + 1
    g.coordinates = GlyphCoordinates([(round(x + shift), round(y)) for x, y in new])
    g.program = None if not hasattr(g, 'program') else g.program
    if hasattr(g, 'program'):
        from fontTools.ttLib.tables import ttProgram
        g.program = ttProgram.Program(); g.program.fromBytecode(b'')


def strip_hinting(f):
    for t in ('fpgm', 'prep', 'cvt ', 'hdmx', 'LTSH', 'VDMX', 'DSIG'):
        if t in f:
            del f[t]
    from fontTools.ttLib.tables import ttProgram
    for name in f.getGlyphOrder():
        g = f['glyf'][name]
        if hasattr(g, 'program'):
            g.program = ttProgram.Program(); g.program.fromBytecode(b'')


def recalc_lsb(f):
    glyf = f['glyf']; hmtx = f['hmtx']
    for name in f.getGlyphOrder():
        g = glyf[name]
        if g.numberOfContours == 0:
            continue
        g.recalcBounds(glyf)
        hmtx[name] = (hmtx[name][0], g.xMin)


def avg_width(f):
    ws = [w for w, _ in f['hmtx'].metrics.values() if w > 0]
    return round(sum(ws) / len(ws))


def add_latin_schwa(f):
    """Latin Ə/ə (U+018F/U+0259) often shows up in typed Tatar text; draw them with the
    Cyrillic Ә/ә glyphs instead of falling back to another font."""
    for st in f['cmap'].tables:
        if st.isUnicode():
            if 0x04D8 in st.cmap:
                st.cmap.setdefault(0x018F, st.cmap[0x04D8])
            if 0x04D9 in st.cmap:
                st.cmap.setdefault(0x0259, st.cmap[0x04D9])


def set_version(f):
    f['head'].fontRevision = VERSION
    name = f['name']
    for rec in list(name.names):
        if rec.nameID == 5:
            name.setName(VSTR, 5, rec.platformID, rec.platEncID, rec.langID)
        if rec.nameID == 3:
            s = rec.toUnicode().replace('1.000;', '1.002;', 1).replace('1.001;', '1.002;', 1)
            name.setName(s, 3, rec.platformID, rec.platEncID, rec.langID)


def save(f, base, autohint=False):
    buf = io.BytesIO(); f.save(buf)
    data = buf.getvalue()
    if autohint:
        data = ttfautohint.ttfautohint(in_buffer=data, no_info=True,
                                       hint_composites=False, windows_compatibility=True)
    path = f'{OUT}/otf_ttf/{base}.ttf'
    open(path, 'wb').write(data)
    w = TTFont(io.BytesIO(data)); w.flavor = 'woff2'
    w.save(f'{OUT}/web/{base}.woff2')
    return path


# ---------- 1. Light and Display Light, rebuilt from Regular ----------
reg_src = f'{SRC}/otf_ttf/KibetSerif-Regular.ttf'
for base in ('KibetSerif-Light',):
    old = TTFont(f'{SRC}/otf_ttf/{base}.ttf')     # names, widths and OS/2 style bits to keep
    f = TTFont(reg_src)
    strip_hinting(f)
    glyf = f['glyf']
    for name in f.getGlyphOrder():
        if name == '.notdef':
            continue
        if name in ('bar', 'brokenbar'):
            thin_glyph(glyf, name, 6, 0, SHIFT)      # already hairline-thin in Regular
        elif name == 'asterisk':
            thin_glyph(glyf, name, STAR, STAR, SHIFT)
        else:
            thin_glyph(glyf, name, STEM_X, 0, SHIFT)
    # composites: a flipped component (Һ = rotated Ч, ģ) moves the opposite way when its
    # base glyph is shifted, so put it back
    for name in f.getGlyphOrder():
        g = glyf[name]
        if g.isComposite():
            for c in g.components:
                if hasattr(c, 'transform'):
                    s = 0 if c.glyphName == '.notdef' else SHIFT
                    c.x += round(SHIFT - s * c.transform[0][0])
                    c.y += round(-s * c.transform[0][1])
    # keep the advance widths already in use (Regular −12, Display −22 more)
    for name in f.getGlyphOrder():
        f['hmtx'][name] = (old['hmtx'][name][0], f['hmtx'][name][1])
    recalc_lsb(f)
    f['name'] = old['name']
    o = f['OS/2']; oo = old['OS/2']
    o.usWeightClass = 300; o.fsSelection = oo.fsSelection; o.achVendID = oo.achVendID
    o.panose.bWeight = 3                      # PANOSE "Light"
    f['head'].macStyle = 0
    o.xAvgCharWidth = avg_width(f)
    add_latin_schwa(f); set_version(f)
    f['maxp'].recalc(f)
    save(f, base, autohint=True)
    print('built', base)

# ---------- 2. Other fonts: metadata fixes only (outlines untouched) ----------
# Display fonts are made from the text fonts afterwards by display.py.
for base in ('KibetSerif-Regular', 'KibetSerif-Bold', 'KibetSerif-Italic', 'KibetSerif-BoldItalic'):
    f = TTFont(f'{SRC}/otf_ttf/{base}.ttf')
    if 'DSIG' in f:
        del f['DSIG']                         # stale signature from the original PT Serif files
    f['OS/2'].xAvgCharWidth = avg_width(f)
    add_latin_schwa(f); set_version(f)
    save(f, base)
    print('fixed', base)
