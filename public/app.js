$('#addNote').on('click', function () {
    $("#note").modal("show");
  })

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#title").append("<h2 itemid='" + data[i]._id + "'>");
  }
});

//"<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].url + "</p>"