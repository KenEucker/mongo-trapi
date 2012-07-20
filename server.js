var restify = require('restify');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/seven20?auto_reconnect');

function getDataV1(req, res, next) {
    console.log('GET /' + req.params.name);
    console.log('id: ' + req.params.id);
    console.log('query:' + req.query.find);

    if(req.params.name !== undefined)
    {
        if(req.query.find !== undefined && req.query.find !=='')
        {
            findDataFromDb(res, req.params.name, JSON.parse(req.query.find));
        }
        else
        {
            getDataFromDb(res, req.params.name, req.params.id);
        }
    }
    else
    {
        res.send('Enter the content name');
    }
}

function setDataV1(req, res, next) {
    console.log('PUT /' + req.params.name);
    console.log('document: ' + req.params.doc);

    if(req.params.name !== undefined)
    {
        setDataInDb(res, req.params.name, req.params.doc);
    }
    else
    {
        res.send('Enter the content name');
    }
}

function deleteDataV1(req, res, next) {
    console.log('DELETE /' + req.params.name);
    console.log('id: ' + req.params.id);
    console.log('document: ' + req.params.doc);

    if(req.params.name !== undefined)
    {
        deleteDataFromDb(res, req.params.name, req.params.id);
    }
    else
    {
        res.send('Enter the content name');
    }
}

function sendResultV1(res, error, result)
{
    res.send(result);
}

function getDataFromDb(res, collection, id)
{
    if(id !== undefined)
    {
        db.collection(collection).find({_id:db.bson_serializer.ObjectID.createFromHexString(id)}).toArray(function(err, result) {
            sendResultV1(res, err, result);
        });
    }
    else
    {
        db.collection(collection).find().toArray(function(err, result) {
            sendResultV1(res, err, result);
        });
    }
}

function setDataInDb(res, collection, data)
{
    db.collection(collection).save(data, {}, function(err, result) {
        sendResultV1(res, err, result);
    });
}

function deleteDataFromDb(res, collection, id)
{
    if(id !== undefined)
    {
        db.collection(collection).removeById({_id:id}, {}, function(err, result) {
            sendResultV1(res, err, result);
        });
    }
    else
    {
        db.collection(collection).remove(function(err, result) {
            sendResultV1(res, err, result);
        });
    }
}

function findDataFromDb(res, collection, query)
{
    db.collection(collection).find(query).toArray(function(err, result) {
        sendResultV1(res, err, result);
    });
}

function send(req, res, next) {
    console.log('request recieved at ' + req.params.name);
    res.send('hello ' + req.params.name);
    return next();
}

function configureRestfulRoute(version, base, modifier, get, post, del, put, head)
{
    var fullPath = base + modifier;

    if(head !== undefined) { server.head({path: fullPath, version: version}, head); }
    if(put !== undefined) { server.put({path: fullPath, version: version}, put); }
    if(get !== undefined) { server.get({path: fullPath, version: version}, get); }
    if(post !== undefined) { server.post({path: fullPath, version: version}, post); }
    if(del !== undefined) { server.del({path: fullPath, version: version},del); }
}

var server = restify.createServer();
server.use(restify.queryParser());

configureRestfulRoute('1.0.0', '/_id', '', getDataV1, setDataV1, deleteDataV1);
configureRestfulRoute('1.0.0', '/d', '/:name', getDataV1, setDataV1, deleteDataV1);
configureRestfulRoute('1.0.0', '/d', '/:name/:id', getDataV1, setDataV1, deleteDataV1);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});