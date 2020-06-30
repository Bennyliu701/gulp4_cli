$.ajax({
    type: 'POST',
    url: '/korea/order/list',
    data: {
        account: "",
        start_time: '2020-05-29',
        end_time: '2020-06-29',
        page: 1,
        size: 10
    },
    dataType: "json",
    contentType: 'application/x-www-form-urlencoded',
    xhrFields: {
        withCredentials: true
    },
    success: function (data, textStatus, request) {
        if ((request.getResponseHeader('X-Forwarded-For')) !== undefined)
            alert("Proxy detected !");
    }
})

$.ajax({
    type: 'GET',
    // url: 'http://localhost:3001/comment/get.action',
    url: '/api/comment/get.action',
    dataType: "json",
    success: function (data) {
        console.log(data)
    },
})

$.ajax({
    type: 'POST',
    url: '/api/comment/add.action',
    success: function (data) {
        console.log(data)
    }
})