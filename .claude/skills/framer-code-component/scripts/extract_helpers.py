#!/usr/bin/env python3
"""Extract framework-free helpers from a Framer component.

Used when shipping a static HTML build alongside the Framer component: the
colour utilities, stylesheet generator and embed helpers are plain functions,
so the HTML build can reuse them instead of duplicating the design.

    python extract_helpers.py Component.tsx parseColor withAlpha globalCSS > helpers.js
"""
import re
import sys


def blocks(source, names):
    lines = source.split("\n")
    starts = [
        i for i, line in enumerate(lines)
        if re.match(r"^(function |const |class |/\*|export |import )", line)
    ] + [len(lines)]

    out = []
    for name in names:
        for idx, i in enumerate(starts[:-1]):
            if not re.match(r"^(function|const|class)\s+%s\b" % re.escape(name), lines[i]):
                continue
            begin = i
            j = i - 1
            while j >= 0 and (lines[j].strip().startswith("*") or lines[j].strip().startswith("/**")):
                begin, j = j, j - 1
            end = starts[idx + 1]
            while end > begin and lines[end - 1].strip() == "":
                end -= 1
            out.append("\n".join(lines[begin:end]))
            break
        else:
            sys.exit("not found: " + name)
    return out


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    src = open(sys.argv[1]).read()
    print("\n\n".join(blocks(src, sys.argv[2:])))
