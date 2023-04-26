const express = require('express')
const app = express()

let count="1";

app.use('/app', express.static(__dirname + '/ui/dist'));

app.get('/', (req, res) => {
  res.json({"changed" :count});
})

const background=function() {
    console.log('backgroung executed');
    setTimeout(background, 5000);
    count++;
}

background();
