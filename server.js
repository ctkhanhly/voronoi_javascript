const express = require('express');
let path = require( 'path' );

const app = express();
const port = process.env.PORT || 3000;
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );
// app.use(express.static(__dirname + '/src'));

app.get('/', (req, res) => {
  res.sendFile('./index.html', {root: __dirname });
});
app.get('/details', (req, res)=>{
  res.sendFile('./report.html', {root: __dirname });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/*
git push -u heroku gh-pages
*/