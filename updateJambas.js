#!/usr/bin/env node

var jambalaya = require('./integrations/jambalaya');

jambalaya.updateJambasFromSite(function(error) {
  if (error) {
    console.error(`Couldn't update jambas from site: ${error}`);
    process.exit(1);
  } else {
    process.exit(0);
  }
});
