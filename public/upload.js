
function uploadFunction() {
    var file = document.getElementById("myFile").files[0];
    var formData = new FormData();
    formData.append("myFile", file);
    $.ajax({
        url: '/uploadfile', 
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        responseType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'                 
    }).done(function(resp){
        // console.log("Success: Files sent!",resp);
        if(resp.message) {
            $('#message').text(resp.message);
            return;
        }
        window.open("/download?path="+resp.path);
        $('#message').text('Success: File uploaded.');
    }).fail(function(){
        $('#message').text("An error occurred, the files couldn't be sent!");
        console.log("An error occurred, the files couldn't be sent!");
    });
}

// function downloadFunction() {
//     var path =  $('#filePath').val();
//     $.ajax({
//         url: '/download?path='+path, 
//         type: 'GET',
//         processData: false,
//         contentType: false                    
//     }).done(function() {
//         console.log("Success: Files sent!");
//     }).fail(function() {
//         $('#message').text("An error occurred, the files couldn't be downloaded.");
//         console.log("An error occurred, the files couldn't be downloaded!");
//     });
// }