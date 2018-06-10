const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hi there');
});

app.listen(3000, () => {
  console.log('Your listening to the smooth sound of port 3000...');
});
