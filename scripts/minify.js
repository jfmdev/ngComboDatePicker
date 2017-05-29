// Load dependencies.
const fs = require('fs');
const UglifyJS = require('uglify-js');
const SaveLicense = require('uglify-save-license');

// Minify code.
let minified_code = UglifyJS.minify('source/ngComboDatePicker.js', {
    output: {
        comments: SaveLicense
    }
}).code;

// Save result.
fs.writeFile('source/ngComboDatePicker.min.js', minified_code, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was generated!");
}); 
