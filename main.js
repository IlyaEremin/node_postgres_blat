var restify = require('restify');
var pgRestify = require('pg-restify');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.use(restify.authorizationParser());
server.use(function (req, res, next) {
    var users;
    users = {
        foo: {
            id: 1,
            password: 'bar'
        }
    };

    // Ensure that user is not anonymous; and
    // That user exists; and
    // That user password matches the record in the database.
    if (req.username == 'anonymous' || !users[req.username] 
    	|| req.authorization.basic.password !== users[req.username].password) {
        // Respond with { code: 'NotAuthorized', message: '' }
        next(new restify.NotAuthorizedError());
    } else {
        next();
    }
});

server.get('/hello/:name', respond);

server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});

// run "node main.js" in terminal to launch server
// curl -isu foo:bar http://localhost:8080/hello/mark -> "Hello mark"
// curl http://localhost:8080/hello/mark -> {"code":"NotAuthorized","message":""}
