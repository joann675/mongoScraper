$(document).on("click", ".scrape", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .then(function(data) {
    
    
    location.reload();
  });


});

$(document).on("click", ".clear", function () {
  $.ajax({
    method: "GET",
    url: "/clear"
  })
  location.reload();


});

$(document).on("click", ".save", function () {
  
  $.ajax({
    method: "PUT",
    url: "/save/"+$(this).attr("attrId")
    
  }) .then(function(data) {
    // Log the response
    console.log(data);
  
    
  });

 
  location.reload();


});

$(document).on("click", ".delete", function () {
  
  $.ajax({
    method: "PUT",
    url: "/delsave/"+$(this).attr("attrId")
    
  }) .then(function(data) {
    // Log the response
    console.log(data);
  
    
  });

 
  location.reload();


});



