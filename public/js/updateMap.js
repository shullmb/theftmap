
$('#edit').on('submit', function(e) {
    e.preventDefault();
    
    if($('#public').is(':checked')) {
        $('#public').val(true);
    } else {
        $('#public').val(false);
        $('#public').prop('checked', true);
    }

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
    }).done( function(data) {
        console.log(data);
        window.location = "/maps";
    })
})
