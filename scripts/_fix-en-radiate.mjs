import fs from "fs";
import path from "path";

const ROOT = "c:/Users/sergi/project-ai";
const files = [
  "consulta-shoulder-adaptive.ts",
  "consulta-elbow-adaptive.ts",
  "consulta-wrist-adaptive.ts",
  "consulta-finger-adaptive.ts",
  "consulta-head-adaptive.ts",
  "consulta-neck-adaptive.ts",
  "consulta-lower-leg-adaptive.ts",
  "consulta-knee-adaptive.ts",
  "consulta-back-adaptive.ts",
  "consulta-hip-adaptive.ts",
];

const pairs = [
  ['irradiacion: "Does the pain radiate down the arm?"', 'irradiacion: "Does the pain spread down the arm?"'],
  ['irradiacion: "Does the pain radiate to another area?"', 'irradiacion: "Does the pain spread to another area?"'],
  ['irradiacion: "Does the pain radiate to the buttock or leg?"', 'irradiacion: "Does the pain spread to the buttock or leg?"'],
  ['irradiacion: "Does the pain radiate to the thigh, knee, or groin?"', 'irradiacion: "Does the pain spread to the thigh, knee, or groin?"'],
  ['irradiacion: "Does the pain radiate to the foot, ankle, or another area?"', 'irradiacion: "Does the pain spread to the foot, ankle, or another area?"'],
  ['irradiacion: "Does the pain radiate to the leg, calf, or foot?"', 'irradiacion: "Does the pain spread to the leg, calf, or foot?"'],
  ['irradiacion_detalle: "How far does the radiation go?"', 'irradiacion_detalle: "How far does that pain go?"'],
  [
    'irradiacion_detalle: "Describe how far it goes and what the radiation feels like"',
    'irradiacion_detalle: "Describe how far that pain goes and what it feels like"',
  ],
];

for (const f of files) {
  const p = path.join(ROOT, "lib", f);
  let s = fs.readFileSync(p, "utf8");
  let n = 0;
  for (const [a, b] of pairs) {
    if (s.includes(a)) {
      s = s.split(a).join(b);
      n++;
    }
  }
  if (n) {
    fs.writeFileSync(p, s);
    fs.copyFileSync(p, path.join(ROOT, "mobile/src/lib", f));
    console.log("updated EN labels", f, n);
  }
}

console.log("done");
