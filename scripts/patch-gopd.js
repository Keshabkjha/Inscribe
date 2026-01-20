'use strict';

const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'gopd', 'gOPD.js');
const content = "'use strict';\n\nmodule.exports = Object.getOwnPropertyDescriptor || null;\n";

const shouldWrite = !fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== content;

if (shouldWrite) {
  fs.writeFileSync(target, content);
}
