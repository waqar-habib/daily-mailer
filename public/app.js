// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  console.log(data);

  for (var i = 0; i < data.length; i++) {

    var articleBlurb = "";
    if (data[i].blurb) {
      articleBlurb = `<p class="post-subtitle" id="synopsis">${data[i].blurb}</p>`
    }
    // var note = "";
    // if (data[i].note) {
    //   note = `<button type="button" class="btn btn-dark" id="addNote" data-id=${data[i].note}>View Note</button>`
    // }
    var articleElement = `
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <div class="post-preview" id="articles">
            <h2 class="post-title" id="title" data-id=${data[i]._id}>${data[i].title}</h2>
            ${articleBlurb}
            <a class="post-meta" id="url" target="_blank" href="https://www.aljazeera.com${data[i].url}">Read Full Article <br><br></a>
            <button type="button" class="btn btn-dark" id="addNote" data-id=${data[i]._id}>Add Note</button>
          </div>
          <hr>
        </div>
      </div>`;
    $(".article-container").append(articleElement);
  }
});

$(document).on("click", "#addNote", function () {
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
    .then(function (data) {
      //console.log(data);
      // if (data.note) {
      //   $("#noteBody").append(data.note);        
      // }
      // A button to submit a new note, with the id of the article saved to it
      $(".saveNote").data("id", thisId)
      $("#note").modal("show");

    });
});

$(document).on("click", ".saveNote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(".saveNote").data("id");
  console.log(thisId);
  var noteBody = $("#noteBody").val();
  console.log(noteBody);
  //Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from noteBody
        body: noteBody
      }
    })
    // // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      $("#noteBody").empty();
      $("#note").modal("hide");
    });
});

