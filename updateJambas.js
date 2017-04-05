#!/usr/bin/env node

const jambalaya = require('./integrations/jambalaya');

jambalaya.updateJambasFromSite((error) => {
  if (error) {
    console.error(`Couldn't update jambas from site: ${error}`);
    process.exit(1);
  } else {
    process.exit(0);
  }
});
