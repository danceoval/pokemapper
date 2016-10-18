var server = require('http').createServer( require('./app'));
var db = require('./db');

const port = process.env.PORT || 3000;


db.sync()
.then(function(){
  console.log('data tables created');
})
.catch(function(err){
  console.log(err);
});

server.listen(port, function(){
  console.log('listening on port ' + port);
});
