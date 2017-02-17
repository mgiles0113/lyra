class TestPost {
    send(data, saveFile) {
        console.log('tp savefiel: ' + saveFile);
	    $.ajax({
            url: apiUrl,
            type: 'POST',
            data: {
                'entity' : 'testPost',
                'data' : data,
                'saveFile' : saveFile
            },
            dataType: 'json',
            context: this,
            success: function(response) {
                console.log('success');
            },
            error: function(response) {
                console.log(response);
                console.log('fail');
            }
        });
	}   
}