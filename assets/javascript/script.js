// Initialize Firebase
//var config = {
//api info will go here
//};
//firebase.initializeApp(config);

//var database = firebase.database();
var userLocationInfo = {
  zip: "84123",
  latitude: "",
  longitude: "",

};

var googleAPIkey = "AIzaSyDyl44m8YtRpjGj7OvGDc0XzLWRbxnc17w"
var itemArray = [""];

var macyItemResult = "";
var bestbuyItemResult = [];
var bestBuySearch = "";
var bestBuyItemSKU = ""
var amazonItemResult = "";
var lowestPrice = "";
var resultItems = 
  {
  item: "",
  store:"",
  price: "",
  };

  
  
  
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

//Best Buy Store Search URL that searches for items in the users chosen area
var bestBuyInStoreURL = {
  baseURL: "https://api.bestbuy.com/v1/stores",
  areaFunction: "((area(" + userLocationInfo.zip + ",25)))",
  apiKey: "?apiKey=5jj3YuGF43lg9OFLbNcrxS4w",
  inStoreAvailability: "+products(sku%20in%20(", //+ bestBuyItemSKU + "))",
  show: "&show=products.sku,products.name,products.shortDescription,products.salePrice,products.regularPrice,products.addToCartURL,products.url,products.image,products.customerReviewCount,products.customerReviewAverage,city,country,location,fullPostalCode,services,region",
  responseFormat: "&format=json"
}



  /*Takes the last items searched and creates "&search=" for every empty character in the users item search
  * returns the @param bestBuySearch item that is used to build the best buy URL
  */
 function bestBuyKeywordConfig(){
 
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

 

  //Find Best Buy Items in stock based on customers location
  function BBlocalUserItem(){
    queryURL =
    bestBuyInStoreURL.baseURL +
    bestBuyInStoreURL.areaFunction +
    bestBuyInStoreURL.inStoreAvailability + bestBuyItemSKU + "))" +
    bestBuyInStoreURL.apiKey +
    bestBuyInStoreURL.show +
    bestBuyInStoreURL.responseFormat
    console.log(queryURL);
  
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function(response) {
        console.log(response);
        var results = response.stores[0].products;
        console.log(response.stores[0].products[0].name)
        console.log(results);
         
        
        for(i = 0; i < results.length; i++){

         let resultItems =  {
          item: results[i].name,
          store:"Best Buy",
          price: results[i].salePrice,
          };
      
        bestbuyItemResult.push(resultItems);  
        console.log("script.js-114",bestbuyItemResult);
        };
        console.log(resultItems);
        console.log(bestbuyItemResult);
    });
    console.log(bestBuyItemSKU)
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
     .then(function(response) {
    
        var results = response.products;
        bestBuyItemSKU = "";
        //console.log(results.length);
        for(i = 0; i < results.length; i++ ){
          bestBuyItemSKU += results[i].sku + ",";
          //resultItems.item
        }
       
        console.log(results[0]);
        console.log(bestBuyItemSKU);
        BBlocalUserItem();
    });

    //Waits until the SKU numbers get pulled from the Users Search
    //setTimeout(function(){ BBlocalUserItem();}, 1000);

 });
 console.log(bestBuyItemSKU)
 
 

 $("#zip-code-btn").on("click", function(event){
  event.preventDefault();

  var zip = $("#zip-code").val().trim();
  userLocationInfo.zip = zip;
  console.log(zip);
  var queryURL =
  "https://maps.googleapis.com/maps/api/geocode/json?address=" +
  userLocationInfo.zip +
  "&key=" +
  googleAPIkey;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // After the data comes back from the API
    .then(function(response) {
      console.log(response);
      // Storing an array of results in the results variable
      userLocationInfo.latitude = response.results[0].geometry.location.lat;
      console.log(userLocationInfo.latitude);
      userLocationInfo.longitude = response.results[0].geometry.location.lng;
      console.log(userLocationInfo.longitude);
  });
 });
/*If user ignores the zipcode input pop up modal to remind them to add zipcode. Function called if adding information in the 


*/

  
// // Get the modal
// var modal = document.getElementById('myModal');

// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks the button, open the modal 
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
  // }
// }