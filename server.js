let http = require("http");
let db = null;

function requestListerer(req, res) {
  res.write(JSON.stringify(db));
  res.end();
}

let server = http.createServer(requestListerer).listen(3000, "localhost");

var child_process = require('child_process');
var command = 'd:/MongoDB/bin/mongo --eval db.getMongo().getDBNames()';
var command1 = 'd:/MongoDB/bin/mongo --eval "db.adminCommand( { listDatabases: 1 } )"'
child_process.exec(command1, function(err, stdout, stderr) {
  db = stdout;
  console.log(stdout);
});