// Initialize Firebase
//var config = {
//api info will go here
//};
//firebase.initializeApp(config);

//var database = firebase.database();
var userLocationInfo = {
  zip: "",
  latitude: "",
  longitude: "",

};
var itemArray = [""];

var macyItemResult = "";
var bestbuyItemResult = "";
var bestBuySearch = "";
var amazonItemResult = "";
var lowestPrice = "";
var resultItems = 
  {
  item: "",
  store: "",
  price: "",
  }

  
  
  
//Best Buy Item URL builder  
var bestBuyitemURL = {

  baseURL: "https://api.bestbuy.com/v1/products(",
  attribute: "&inStoreAvailability=true)",
  keyword: "(search=",
  apiKey: "?apiKey=5jj3YuGF43lg9OFLbNcrxS4w",
  sortOptions: "&sort=salePrice.asc",
  showOptions: "&show=SKU,salePrice,thumbnailImage,image,manufacturer",
  facets: "&facet=inStoreAvailability",
  responseFormat: "&format=json",
}


 function bestBuyKeywordConfig(){
  //Takes the last items searched and 
  //console.log(itemArray.length);
  arrayLength = itemArray.length - 1;
  var item = itemArray[arrayLength];
  console.log(item);
  bestBuySearch = "";
  for(i = 0; i < item.length; i++){
    var itemChar = item.charAt(i);
    console.log(itemChar);
    if(itemChar === " "){
      bestBuySearch += "&search=";
      console.log(bestBuySearch);
    }
    else {
      bestBuySearch += itemChar;
      console.log(bestBuySearch);
    }
  }
  console.log(bestBuySearch);
  console.log(bestBuyitemURL.keyword);
 };

//onclick function that captures the users results and passes them through them
// through bestBuyKeywordcfig

 $(".btn-submit").on("click", function(event){
  event.preventDefault();

  //collects user search item and stores them in an item array
  var item = $("#item").val().trim();
  console.log(item);
  itemArray.push(item);
  console.log(itemArray);
   bestBuyKeywordConfig();

   var queryURL = 
    bestBuyitemURL.baseURL +
    bestBuyitemURL.keyword + bestBuySearch + ")" +
    bestBuyitemURL.attribute + 
    bestBuyitemURL.apiKey +
    bestBuyitemURL.showOptions +
    bestBuyitemURL.facets +
    bestBuyitemURL.responseFormat;
  console.log(queryURL);
    // Performing our AJAX GET request
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After the data comes back from the API
      .then(function(response) {
        // Storing an array of results in the results variable
        var results = response.products;
        console.log(results);
    });

 });
  
  
/*If user ignores the zipcode input pop up modal to remind them to add zipcode. Function called if adding information in the 


*/

  
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}