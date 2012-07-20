function getData(request, callback, host, data, port)
{
    makeAjax(request, callback, "GET", data, host, port);
}

function setData(request, callback, data, host, port)
{
    makeAjax(request, callback, "PUT", data, host, port);
}

function deleteData(request, callback, data, host, port)
{
    makeAjax(request, callback, "DELETE", data, host, port);
}

function makeAjax(request, callback, type, data, host, port)
{
    if (type === '' || type === undefined)
        type = "GET";
    if (port === '' || port === undefined)
        port = 8080;
    if (host === '' || host === undefined)
        host = "http://localhost";

    $.ajax({
        url:host + ':' + port + request,
        type: type,
        data: data,
        success:function(data){callback(data);},
        error:function(xhr, textStatus, errorThrown)
        { callback('ajax request failure:' + textStatus + '\nxhr:' +  xhr + '\nerror:' + errorThrown);}
    });
}