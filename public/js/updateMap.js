
$('#edit').on('submit', function(e) {
    e.preventDefault();
    let updatedInfo = $(this).serialize();
    let url = $(this).attr('action');
    $.ajax({
        method: 'PUT',
        url: url,
        data: updatedInfo
    }).done(function (data) {
        console.log(data);
        window.location = url;
    })
})


$('#delete').click( function(e){
    e.preventDefault();
    let url = $(this).attr('href');
    $.ajax({
        method: 'DELETE',
        url: url
    }).then( function(data) {
        console.log(data);
        window.location = "/maps";
    })
})