class TestPost {
    send(data) {
	    $.ajax({
            url: apiUrl,
            type: 'POST',
            data: {
                'entity' : 'testPost',
                'data' : data
            },
            dataType: 'json',
            context: this,
            success: function(response) {
                console.log('success');
            },
            error: function(response) {
                console.log('fail');
            }
        });
	}   
}