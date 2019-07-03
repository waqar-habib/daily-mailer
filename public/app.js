// Ln 3-42: Gets the articles from the database and constructs the html dynamically based on the JSON response. 

// Grab the articles as a json
$.getJSON("/articles", function (data) {

  // Clg the data object
  console.log(data);

  // For each article...
  for (var i = 0; i < data.length; i++) {

    // IF the blurb exists, then construct the p class, otherwise omit
    var articleBlurb = "";
    if (data[i].blurb) {
      articleBlurb = `<p class="post-subtitle" id="synopsis">${data[i].blurb}</p>`
    }

    // IF there is a note attached to the article, then construct the "view note" button, otherwise omit
    var note = "";
    if (data[i].note) {
      note = `<button type="button" class="btn btn-dark" id="viewNote" data-id=${data[i].note}>View Note</button>`
    }

    // Construct the html using the article data returned from the database
    var articleElement = `
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <div class="post-preview" id="articles">
            <h2 class="post-title" id="title" data-id=${data[i]._id}>${data[i].title}</h2>
            ${articleBlurb}
            <a class="post-meta" id="url" target="_blank" href="https://www.aljazeera.com${data[i].url}">Click to Read Full Article <br><br></a>
            <button type="button" class="btn btn-dark" id="addNote" data-id=${data[i]._id}>Add Note</button>
            ${note}
          </div>
          <hr>
        </div>
      </div>`;
    
    // Append the constructed html onto the article container
    // $(".article-container").empty();
    $(".article-container").append(articleElement);
  }
});

// Ln 35-59: When "add note" btn is clicked, show a modal where the user enters a note

$(document).on("click", "#addNote", function () {
  
  // Empty the input from the noteBody modal
  $("#noteBody").val("");

  // Store id from the Note model into "thisId"
  var thisId = $(this).attr("data-id");
  
  // Now make an ajax call for the Article and its Notes
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })

    // With that done, add the note information to the page
    .then(function (data) {

      // A button to submit a new note, with the id of the article saved to it
      $(".saveNote").data("id", thisId)

      // Show the modal
      $("#note").modal("show");

    });
});

// Ln 63-96: When "save note" btn is clicked, save the note to the database 

$(document).on("click", ".saveNote", function () {
  
  // Grab the id associated with the article from the save note button
  var thisId = $(".saveNote").data("id");
  
  // Take the input from the form and store it into noteBody
  var noteBody = $("#noteBody").val();
  
  
  //Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        
        body: noteBody
      }
    })
    // With that done
    .then(function (data) {
      
      // Log the response
      console.log(data);

      // Empty the noteBody
      $("#noteBody").empty();

      // Hide the modal
      $("#note").modal("hide");

      // Reload the window
      window.location.href='/';
    });
});

// Ln 100-138: When "view note" btn is clicked, get the note from the database 

$(document).on("click", "#viewNote", function () {
  
  // Grab the id associated with the note from the view note button
  var thisId = $(this).attr("data-id");

  //Run a GET request to retrive the note from the db
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId,
      data: {}
    })

    // With that done
    .then(function (data) {
      
      // Store the note body into var noteText
      var noteText = data.body;
      
      // Empty out modal
      $("#existingNoteBody").empty();

      // Append the note body retrived from db 
      $("#existingNoteBody").append(noteText);

      // Show the note Modal
      $("#noteModal").modal("show");
    });
});

//Ln 141-144: When the scrape button is clicked it routes to /scrape page. 
$(document).on("click", ".scrape", function () {
  window.location.href='/scrape';
  return false;
});

//Ln 147-150: When the home button is clicked it routes to index.html
$(document).on("click", ".home", function () {
  window.location.href='/';
  return false;
});

