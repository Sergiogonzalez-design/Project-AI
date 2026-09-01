from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

def patch_web(path: Path) -> None:
    t = path.read_text(encoding="utf-8")
    orig = t
    if "consultaNavLabels" not in t:
        if t.startswith('"use client"'):
            t = t.replace(
                '"use client";\n',
                '"use client";\n\nimport { consultaNavLabels } from "@/lib/consulta-nav-labels";\n',
                1,
            )
        else:
            t = 'import { consultaNavLabels } from "@/lib/consulta-nav-labels";\n' + t
    t = re.sub(r"(>\s*)Anterior(\s*<)", r"\1{consultaNavLabels(locale).previous}\2", t)
    t = re.sub(r"(>\s*)Siguiente(\s*<)", r"\1{consultaNavLabels(locale).next}\2", t)
    if t != orig:
        path.write_text(t, encoding="utf-8")
        print("web", path.name)


def patch_mobile(path: Path) -> None:
    t = path.read_text(encoding="utf-8")
    orig = t
    if "consultaNavLabels" not in t:
        lines = t.splitlines(True)
        insert_at = 0
        for i, line in enumerate(lines):
            if line.startswith("import "):
                insert_at = i + 1
        lines.insert(
            insert_at, 'import { consultaNavLabels } from "../lib/consulta-nav-labels";\n'
        )
        t = "".join(lines)
    t = t.replace(">Anterior</Text>", ">{consultaNavLabels(locale).previous}</Text>")
    t = t.replace(">Siguiente</Text>", ">{consultaNavLabels(locale).next}</Text>")
    if t != orig:
        path.write_text(t, encoding="utf-8")
        print("mob", path.name)


for p in (ROOT / "components").glob("consulta-adaptive-*.tsx"):
    patch_web(p)

for p in (ROOT / "mobile" / "src" / "components").glob("ConsultaAdaptive*.tsx"):
    patch_mobile(p)

print("done")
