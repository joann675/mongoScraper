// GET request to server route /scrape
$(document).on("click", ".scrape", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function (data) {
      location.reload();
    });

});


// PUT request to server route /save/articleId
$(document).on("click", ".save", function () {

  $.ajax({
    method: "PUT",
    url: "/save/" + $(this).attr("attrId")

  }).then(function (data) {
    // Log the response
    console.log(data);

  });
  location.reload();
});

// PUT request to server route /delsave/articleId
$(document).on("click", ".delete", function () {

  $.ajax({
    method: "PUT",
    url: "/delsave/" + $(this).attr("attrId")

  }).then(function (data) {
    // Log the response
    console.log(data);
  });

  location.reload();
});

// Populate data and show modal with existing notes and form for new note
$(document).on("click", ".addNote", function () {
  event.preventDefault();
  var articleId = $(this).attr("attrId")
  $("h5.modal-title").text("Notes for article: " + articleId);
  $.ajax({
    method: "GET",
    url: "/articles/" + articleId
  })
    .then(function (data) {

      console.log(data);
      $("#dbNotes").empty();
      for (var i = 0; i < data.notes.length; i++) {
        var txt2 = $("<span></span>").text(data.notes[i].title + ":" + data.notes[i].body);
        var delbutton = $("<button class='buttonSmall'>&times;</button>");
        delbutton.attr("attrId", data.notes[i]._id);
        delbutton.attr("articleId", articleId)
        delbutton.addClass("delnotebutton");
        var linebreak = $("<br>");
        $("#dbNotes").append(txt2, delbutton, linebreak, linebreak);


      }
      $(".saveNote").attr("articleId", articleId);

      $('#myModal').modal('show');

    });
});

// POST request to server route /articles/articleId
// body of request contains title and body of note
$(document).on("click", ".saveNote", function () {

  $.ajax({
    method: "POST",
    url: "/articles/" + $(this).attr("articleId"),
    data: {
      // Value taken from title input
      title: $("#title").val(),
      // Value taken from note textarea
      body: $("#body").val()
    }

  }).then(function (data) {

    // Log the response
    console.log(data);
    $("#title").val("");
    $("#body").val("");
    $("#myModal").modal("toggle");

  });
});

// POST request to server route /delarticles/articleId

$(document).on("click", ".delnotebutton", function () {

  $.ajax({
    method: "POST",
    url: "/delarticles/" + $(this).attr("articleId") + "/" + $(this).attr("attrId")
  }).then(function (data) {
    // Log the response
    console.log(data);
    $("#myModal").modal("toggle");

  });
});
