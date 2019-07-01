// $(document).on('click', '#addNote', function () {
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
    var articleBlurb = "";
    if (data[i].blurb) {
      articleBlurb = `<p class="post-subtitle" id="synopsis">${data[i].blurb}</p>`
    }
    var articleElement = `
   <div class="row">
    <div class="col-lg-8 col-md-10 mx-auto">
      <div class="post-preview" id="articles">
        <h2 class="post-title" id="title" data-id=${data[i]._id}>${data[i].title}</h2>
        ${articleBlurb}
        <p class="post-meta" id="url">${data[i].url}</p>
        <button type="button" class="btn btn-dark" id="addNote" data-id=${data[i]._id}>Add Note</button>
      </div>
      <hr>
    </div>
  </div>`;
  $(".article-container").append(articleElement);
  }
});

$(document).on("click", "#addNote", function() {
  // Empty the notes from the note section
  $("#noteBody").val("");
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      if (data.note) {
        $("#noteBody").val(data.note);        
      }
      // A button to submit a new note, with the id of the article saved to it
      $(".saveNote").data("id", thisId)
      $("#note").modal("show");
      
    });
});

$(document).on("click", ".saveNote", function () {
  console.log($("#noteBody").val());
  console.log($(this).data("id"));
  $("#note").modal("hide");
})