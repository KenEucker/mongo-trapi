function loadData(host, port, request, callback)
{
	if (port === '')
		port = 80;
	$.ajax({
		url:host + ':' + port + request,
		success:function(data){callback(data);},
		error:function(xhr, textStatus, errorThrown)
		{ alert('ajax request failure:' + textStatus + '\nxhr:' +  xhr + '\nerror:' + errorThrown);}
	});
}