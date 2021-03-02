const express = require('express');
const config = require('./congfig');
const path = require('path');

let app = express();  

require('./libs/run')(app);

app.listen(config.common.port, () => {
    console.log(`App run in ${config.common.port}`);
})