var restify = require('restify');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var dbUrl = "mongodb://root:example@localhost:27017/seven20?authSource=admin";
const monk = require('monk')
const db = monk(dbUrl);

function getDataV1(req, res, next) {
    console.log('GET /' + req.params.name);
    console.log('id: ' + req.params.id);
    console.log('data: ' + req.body);
    console.log('find: ' + req.params.find);

    if (req.params.name !== undefined) {
        if (req.params.find !== undefined) {
            var data = JSON.parse(req.params.find);
            findDataFromDb(res, req.params.name, makeIdSafe(data));
        }
        else {
            getDataFromDb(res, req.params.name, req.params.id);
        }
    }
    else if (req.params.id !== undefined) {
        getDataFromDb(res, req.params.name, req.params.id);
    }
    else {
        res.send('Enter the content name');
    }
}

function makeIdSafe(obj) {
    if (obj._id !== undefined) {
        if (obj._id === "")
            delete obj._id;
        else {
            var temp = new ObjectID(obj._id);
            obj._id = temp;
        }
    }

    return obj;
}

function setDataV1(req, res, next) {
    console.log('PUT /' + req.params.name);
    console.log('id: ' + req.params.id);
    console.log('data: ' + req.body);

    if (req.params.name !== undefined) {
        setDataInDb(res, req.params.name, makeIdSafe(req.body));
    }
    else {
        res.send('Enter the content name');
    }
}

function deleteDataV1(req, res, next) {
    console.log('DELETE /' + req.params.name);
    console.log('id: ' + req.params.id);
    console.log('find: ' + req.params.find);

    if (req.params.name !== undefined) {
        if (req.params.find !== undefined) {
            var data = JSON.parse(req.params.find);
            deleteDataFromDb(res, req.params.name, req.params.id, makeIdSafe(data));
        }
        else {
            deleteDataFromDb(res, req.params.name, req.params.id);
        }
    }
    else {
        res.send('Enter the content name');
    }
}

function sendResultV1(res, error, result) {
    res.send(result);
}

function getDataFromDb(res, collection, id) {
    if (id !== undefined) {
        if (collection === undefined) {

        }
        else {
            const docs = db.get(collection, { castIds: false });

            docs.find({ _id: id }).then(function (result) {
                sendResultV1(res, null, result);
            });
        }
    }
    else {
        const docs = db.get(collection, { castIds: false });

        docs.find({ }).then(function (result) {
            sendResultV1(res, null, result);
        });
    }
}

function setDataInDb(res, collection, data) {
    db.collection(collection).save(data, {}, function (err, result) {
        sendResultV1(res, err, result);
    });
}

function deleteDataFromDb(res, collection, id, data) {
    if (id !== undefined) {
        db.collection(collection).removeById(id, function (err, result) {
            sendResultV1(res, err, result);
        });
    }
    else if (data !== undefined) {
        db.collection(collection).remove(data, {}, function (err, result) {
            sendResultV1(res, err, result);
        });
    }
    else {
        db.collection(collection).remove(function (err, result) {
            sendResultV1(res, err, result);
        });
    }
}

function findDataFromDb(res, collection, query) {
    db.collection(collection).find(query).toArray(function (err, result) {
        sendResultV1(res, err, result);
    });
}

function send(req, res, next) {
    console.log('request recieved at ' + req.params.name);
    res.send('hello ' + req.params.name);
    return next();
}

function configureRestfulRoute(version, base, modifier, get, post, del, head) {
    var fullPath = base + modifier;

    if (head !== undefined) { server.head({ path: fullPath, version: version }, head); }
    if (post !== undefined) {
        server.put({ path: fullPath, version: version }, post);
        server.post({ path: fullPath, version: version }, post);
    }
    if (get !== undefined) { server.get({ path: fullPath, version: version }, get); }
    if (del !== undefined) { server.del({ path: fullPath, version: version }, del); }
}

var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonp());
server.use(restify.plugins.bodyParser({mapParams: false}));

configureRestfulRoute('1.0.0', '/_id/:id', '', getDataV1, setDataV1, deleteDataV1);
configureRestfulRoute('1.0.0', '/d', '/:name', getDataV1, setDataV1, deleteDataV1);
configureRestfulRoute('1.0.0', '/d', '/:name/:id', getDataV1, setDataV1, deleteDataV1);

server.get('/*', restify.plugins.serveStatic({
    directory: './documentation',
    default: './home.html',
   })
);

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});