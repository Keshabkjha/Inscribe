'use strict';

const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'gopd', 'gOPD.js');

if (!fs.existsSync(target)) {
  const content = "'use strict';\n\nmodule.exports = Object.getOwnPropertyDescriptor || null;\n";
  fs.writeFileSync(target, content);
}
