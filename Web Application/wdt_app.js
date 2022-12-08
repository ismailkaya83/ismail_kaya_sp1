//create a staffUserGet function that makes the API call(s) and processes the response(s)

function staffUserGet() {
    $.ajax({
    url: 'https://randomuser.me/api/',
    dataType: 'json',
    success: function(data) {
      console.log(data);
    },
    error: function() {
        console.log("Something went wrong!");
    }
  })
}