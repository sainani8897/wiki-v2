// Node.js program to demonstrate the
// fs.symlink() method
  
// Import the filesystem module
const fs = require('fs');
  
fs.symlink(__dirname + "../../../storage",
           __dirname + "../../../public/storage", 'junction', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("Symlink created");
    console.log("Symlink is a directory:",
       fs.statSync(__dirname + "../../../public/").isDirectory()
    );
  }
});