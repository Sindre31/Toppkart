"""Regression test for the reassurance rule in check_guides.py.

The rule has to do two opposite things at once: report a guide that tells the
reader terrain is safe, and stay quiet about a guide that tells the reader it is
not. A word search does the first and fails the second, and every guide's
forecast paragraph ends with a denial — so the noise arrives on all 39 tours at
once and the temptation is to widen the exemption until the rule never fires.

These cases pin both directions. Run it after touching REASSURING or DENIAL.

    python3 test_check_guides.py
"""

import importlib.util
import sys

spec = importlib.util.spec_from_file_location("cg", "check_guides.py")
cg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cg)

# (text, should the checker report it?)
CASES = [
    # Denials of safety — the shape every forecast paragraph ends with.
    ("an empty page does not mean a safe mountain", False),
    ("ei tom side betyr ikkje trygt fjell", False),
    ("en tom side betyr ikke trygt fjell", False),
    ("there is no safe line off the summit plateau", False),
    ("ryggen er aldri trygg i vestlig vind", False),
    # Claims of safety, in the inflections both languages actually use.
    ("the ridge is safe in stable conditions", True),
    ("the northeast ridge is the safest line choice on the mountain", True),
    ("the north side is safer than the south", True),
    ("ryggen er trygg i stabile forhold", True),
    ("dette er trygt terreng hele veien", True),
    ("ryggen er trygge nok når snøen har satt seg", True),
    ("nordsida er tryggere enn sørsida", True),
    ("nordaustryggen er det tryggaste linjevalet på fjellet", True),
    # A negation earlier in the sentence does not license a claim later in it.
    ("it is not steep here, and the bowl below is safe", True),
    ("det er ikke bratt her, og skåla under er trygg", True),
]


def reported(text):
    for pat, label in cg.REASSURING:
        if label.startswith("under-N"):
            continue  # checked against maxAngle, not by wording
        for m in pat.finditer(text):
            if not cg.DENIAL.search(text[max(0, m.start() - 40): m.start()]):
                return True
    return False


def main():
    bad = 0
    for text, want in CASES:
        got = reported(text)
        if got != want:
            bad += 1
        print(f"  {'ok  ' if got == want else 'FAIL'} reported={got!s:<5} "
              f"want={want!s:<5} {text!r}")
    print(f"\n{len(CASES)} cases, " + ("all behave" if not bad else f"{bad} failed"))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
