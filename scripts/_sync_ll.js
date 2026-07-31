const fs = require("fs");
let s = fs.readFileSync("lib/consulta-lower-leg-adaptive.ts", "utf8");
s = s.replace(/from ["']@\/lib\/consulta-timing["']/g, 'from "./consulta-timing"');
s = s.replace(/from ["']@\/lib\/detect-body-part["']/g, 'from "./detect-body-part"');
fs.writeFileSync("mobile/src/lib/consulta-lower-leg-adaptive.ts", s, "utf8");
console.log("ok");
