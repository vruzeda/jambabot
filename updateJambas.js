#!/usr/bin/env node

const jambalaya = require('./integrations/jambalaya');

jambalaya.updateJambasFromSite()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
