const {existsSync, mkdirSync} = require('fs');

[
    './store',
    './log',
    './cert'

].forEach(function(dir){

    if(!existsSync(dir)){

        mkdirSync(dir);
    }
});