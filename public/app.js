// $('#addNote').on('click', function () {
//     $("#note").modal("show");
// })

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  console.log(data);
  var articles = [];

  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    //$("#articles").append("<p data-id='" + data[i]._id + "'>");
    console.log(data[i]._id);
  }
});

// + data[i].title + "<br />" + data[i].url + "</p>"