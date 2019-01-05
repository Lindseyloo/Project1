/// Initialize Firebase
var config = {
  apiKey: "AIzaSyDcte2uBaoWV9plgoh8459pOgT-7ciQ-Bk",
  authDomain: "project-1-3dbd1.firebaseapp.com",
  databaseURL: "https://project-1-3dbd1.firebaseio.com",
  projectId: "project-1-3dbd1",
  storageBucket: "",
  messagingSenderId: "778205183350"
};
firebase.initializeApp(config);

var database = firebase.database();

var userLocationInfo = {
  zip: "84123",
  latitude: "",
  longitude: "",

};

var googleAPIkey = "AIzaSyDyl44m8YtRpjGj7OvGDc0XzLWRbxnc17w"
var walmartAPIkey = "xew4cg34gdd5d4p9u6uc3azd";
var itemArray = [""];
var walmartSearch = "";
var walmartItemResult = [];
var bestbuyItemResult = [];
var bestBuySearch = "";
var bestBuyItemSKU = ""
var amazonItemResult = "";
var lowestPrice = "";
var resultItems =
{
  item: "",
  store: "",
  price: "",
};

//Remove previous results from Firebase
window.onload = removeResults;
function removeResults() {
var adaRef = firebase.database().ref();
adaRef.remove()
  .then(function() {
    console.log("Remove succeeded.")
  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message)
  });

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
function bestBuyKeywordConfig() {

 
  arrayLength = itemArray.length - 1;
  var item = itemArray[arrayLength];
  
  bestBuySearch = "";
  for (i = 0; i < item.length; i++) {
    var itemChar = item.charAt(i);
   
    if (itemChar === " ") {
      bestBuySearch += "&search=";
     
    }
    else {
      bestBuySearch += itemChar;
     
    }
  }

};

function walmartKeywordConfig() {

  arrayLength = itemArray.length - 1;
  var item = itemArray[arrayLength];
 
  walmartSearch = "";
  for (i = 0; i < item.length; i++) {
    var itemChar = item.charAt(i);
    
    if (itemChar === " ") {
      walmartSearch += "+";
      
    }
    else {
      walmartSearch += itemChar;
    
    }
  }

};
 
function bestPrice() {
  var bestItem = "";
  
  console.log(walmartItemResult[walmartItemResult.length - 1].price);
  console.log(bestbuyItemResult[bestbuyItemResult.length - 1].price);
  if (walmartItemResult[walmartItemResult.length - 1].price < bestbuyItemResult[bestbuyItemResult.length - 1].price) {
    bestItem = (walmartItemResult[walmartItemResult.length - 1]);
    addtoFirebase(bestItem);
  };
};
function addtoFirebase(bestItem) {
 
  
  database.ref().push({
    
    bestItem: bestItem,
    
  });

  database.ref().on("child_added", function (childSnapshot) {
    bestItem = childSnapshot.val().bestItem;
    

    
    console.log(childSnapshot.val().bestItem);
    $("#tableBody").append("<tr><td>"
      + bestItem.item + "</td><td>"
      + bestItem.store + "</td><td>"
      + bestItem.price + "</td></tr>")
    

  });
};
  //console.log(bestbuyItemResult[bestbuyItemResult.length - 1].price);



//Find Best Buy Items in stock based on customers location
function BBlocalUserItem() {
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
    .then(function (response) {
      console.log(response);
      var results = response.stores[0].products;

      for (i = 0; i < results.length; i++) {

        let resultItems = {
          item: results[i].name,
          store: "Best Buy",
          price: results[i].salePrice,
        };

        bestbuyItemResult.push(resultItems);
        console.log("script.js-142", bestbuyItemResult);
      };
//Table Results
      var bestBuyItem = bestbuyItemResult[0].item;
      var bestBuyStore = bestbuyItemResult[0].store;
      var bestBuyPrice = bestbuyItemResult[0].price;
      var bestBuyItemSecond = bestbuyItemResult[1].item;
      var bestBuyStoreSecond = bestbuyItemResult[1].store;
      var bestBuyPriceSecond = bestbuyItemResult[1].price;
      var bestBuyItemThird = bestbuyItemResult[2].item;
      var bestBuyStoreThird = bestbuyItemResult[2].store;
      var bestBuyPriceThird = bestbuyItemResult[2].price;
   
      //Pushing Best Buy Results to table.
     // Push result to firebase database.
      database.ref().push({
        bestBuyItem: bestBuyItem,
        bestBuyStore: bestBuyStore,
        bestBuyPrice: bestBuyPrice,
        bestBuyItemSecond: bestBuyItemSecond,
        bestBuyStoreSecond: bestBuyStoreSecond,
        bestBuyPriceSecond: bestBuyPriceSecond,
        bestBuyItemThird: bestBuyItemThird,
        bestBuyStoreThird: bestBuyStoreThird,
        bestBuyPriceThird: bestBuyPriceThird,
     
      });
      console.log(resultItems);
      console.log(bestbuyItemResult);
    });
  console.log(bestBuyItemSKU)
};
database.ref().on("child_added", function (childSnapshot) {

  console.log(childSnapshot.val().bestBuyItem);
  console.log(childSnapshot.val().bestBuyStore);
  console.log(childSnapshot.val().bestBuyPrice);
  console.log(childSnapshot.val().bestBuyItemSecond);
  console.log(childSnapshot.val().bestBuyStoreSecond);
  console.log(childSnapshot.val().bestBuyPriceSecond);
  console.log(childSnapshot.val().bestBuyItemThird);
  console.log(childSnapshot.val().bestBuyStoreThird);
  console.log(childSnapshot.val().bestBuyPriceThird);


  //displays data to table body
  bestBuyItem = childSnapshot.val().bestBuyItem;
  bestBuyStore = childSnapshot.val().bestBuyStore;
  bestBuyPrice = childSnapshot.val().bestBuyPrice;
  bestBuyItemSecond = childSnapshot.val().bestBuyItemSecond;
  bestBuyStoreSecond = childSnapshot.val().bestBuyStoreSecond;
  bestBuyPriceSecond = childSnapshot.val().bestBuyPriceSecond;
  bestBuyItemThird = childSnapshot.val().bestBuyItemThird;
  bestBuyStoreThird = childSnapshot.val().bestBuyStoreThird;
  bestBuyPriceThird = childSnapshot.val().bestBuyPriceThird;


$("#tableBody").append("<tr><td>" + bestBuyItem + "</td><td>" + bestBuyStore + "</td><td>" + bestBuyPrice + "</td></tr>" + "<tr><td>" + bestBuyItemSecond + "</td><td>"  + bestBuyStoreSecond + "</td><td>" + bestBuyPriceSecond + "</td></tr>" + "<tr><td>" + bestBuyItemThird + "</td><td>"  + bestBuyStoreThird + "</td><td>" + bestBuyPriceThird + "</td><tr>")
})


// /ONCLICK BUTTONS
// onclick for create new list
$("#new-list").on("click", function (event) {
  $("#tableBody tr").remove();
  event.preventDefault();
});

    // $("#new-list").on("click", function (event) {
    //     $("#tableBody").find("tr:not(:first)").remove();
    // });


//onclick function that captures the users results and passes them through them
// through bestBuyKeywordcfig

$(".btn-submit").on("click", function (event) {
  document.getElementById("tableBody").deleteRow(0);
  event.preventDefault();

  //collects user search item and stores them in an item array
  var item = $("#item").val().trim();
  $("#item").val('');

  console.log(item);
  itemArray.push(item);
  console.log(itemArray);
  bestBuyKeywordConfig();
  walmartKeywordConfig();
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
    .then(function (response) {

      var results = response.products;
      bestBuyItemSKU = "";
      //console.log(results.length);
      for (i = 0; i < results.length; i++) {
        bestBuyItemSKU += results[i].sku + ",";
        //resultItems.item
      }

      console.log(results[0]);
      console.log(bestBuyItemSKU);
      BBlocalUserItem();
      
    });

//Walmart item search URL
var walmartURL = 
  "https://api.walmartlabs.com/v1/search"
  +"?query="+ walmartSearch
  +"&format=json"
  + "&facet=on"
  + "&apiKey=" + walmartAPIkey
  +"&sort=price&order=asc";
  
 console.log(walmartURL)   
  $.ajax({
      url: walmartURL,
      method: "GET",
      
    })
      
    .then(function (response) {
      console.log(response);
      var results = response.items;
      console.log(response.items[0]);
      console.log(results);

   
      for (i = 0; i < results.length; i++) {

        let resultItems = {
          item: results[i].name,
          store: "Walmart",
          price: results[i].msrp,
        };
      
        
        walmartItemResult.push(resultItems);
        console.log("script.js-294", walmartItemResult);
        walmartDisplay();
      };
        //console.log(walmartItemResult[walmartItemResult.length - 1]);
      //bestPrice();
        //Table Results
      var walmartItem = walmartItemResult[0].item;
      var walmartPrice = walmartItemResult[0].price;
      var walmartItemSecond = walmartItemResult[1].name;
      var walmartPriceSecond = walmartItemResult[1].salesPrice;
      var walmartItemThird = walmartItemResult[2].name;
      var walmartPriceThird = walmartItemResult[0].salesPrice;
      
      console.log(walmartItem);
      database.ref().push({
        walmartItem: walmartItem,
        walmartPrice: walmartPrice,
        walmartItemSecond: walmartItemSecond,
        walmartPriceSecond: walmartPriceSecond,
        walmartItemThird:  walmartItemThird,
        walmartPriceThird: walmartPriceThird,
        
      });
      database.ref().on("child_added", function (childSnapshot){

        console.log(childSnapshot.val().walmartItem);
        walmartItem = childSnapshot.val().walmartItem;
        walmartPrice = childSnapshot.val().walmartPrice;
        walmartItemSecond = childSnapshot.val().walmartItemSecond;
        walmartPriceSecond= childSnapshot.val().walmartPriceSecond;
        walmartItemThird= childSnapshot.val().walmartItemThird;
        walmartPriceThird= childSnapshot.val().walmartPriceThird;
        console.log(walmartPrice);

        $("#tableBody").append("<tr><td>"
         + walmartItem + "</td><td>"
          + "Walmart" + "</td><td>" 
          + walmartPrice + "</td></tr>" + "<tr><td>"
         + walmartItemSecond + "</td><td>"  
         + "Walmart" + "</td><td>"
          + walmartPriceSecond + "</td></tr>" + "<tr><td>" 
          + walmartItemThird + "</td><td>" 
          + "Walmart" + "</td><td>"
           + walmartPriceThird + "</td><tr>")
      });
      
      }); 

    
      database.ref().on("child_added", function (childSnapshot){

        console.log(childSnapshot.val().walmartItem);
        walmartItem = childSnapshot.val().walmartItem;
        walmartPrice = childSnapshot.val().walmartPrice;
        walmartItemSecond = childSnapshot.val().walmartItemSecond;
        walmartPriceSecond= childSnapshot.val().walmartPriceSecond;
        walmartItemThird= childSnapshot.val().walmartItemThird;
        walmartPriceThird= childSnapshot.val().walmartPriceThird;
        console.log(walmartPrice);

        $("#tableBody").append("<tr><td>"
         + walmartItem + "</td><td>"
          + "Walmart" + "</td><td>" 
          + walmartPrice + "</td></tr>" + "<tr><td>"
         + walmartItemSecond + "</td><td>"  
         + "Walmart" + "</td><td>"
          + walmartPriceSecond + "</td></tr>" + "<tr><td>" 
          + walmartItemThird + "</td><td>" 
          + "Walmart" + "</td><td>"
           + walmartPriceThird + "</td><tr>")
           
      });
    

    
  
});

function walmartDisplay(){
  var walmartItem = walmartItemResult[0].item;
  var walmartPrice = walmartItemResult[0].price;
  var walmartItemSecond = walmartItemResult[1].name;
  var walmartPriceSecond = walmartItemResult[1].salesPrice;
  var walmartItemThird = walmartItemResult[2].name;
  var walmartPriceThird = walmartItemResult[0].salesPrice;
  
  console.log(walmartItem);
  database.ref().push({
    walmartItem: walmartItem,
    walmartPrice: walmartPrice,
    walmartItemSecond: walmartItemSecond,
    walmartPriceSecond: walmartPriceSecond,
    walmartItemThird:  walmartItemThird,
    walmartPriceThird: walmartPriceThird,
    
  });
  database.ref().on("child_added", function (childSnapshot){

    console.log(childSnapshot.val().walmartItem);
    walmartItem = childSnapshot.val().walmartItem;
    walmartPrice = childSnapshot.val().walmartPrice;
    walmartItemSecond = childSnapshot.val().walmartItemSecond;
    walmartPriceSecond= childSnapshot.val().walmartPriceSecond;
    walmartItemThird= childSnapshot.val().walmartItemThird;
    walmartPriceThird= childSnapshot.val().walmartPriceThird;
    console.log(walmartPrice);

    $("#tableBody").append("<tr><td>"
     + walmartItem + "</td><td>"
      + "Walmart" + "</td><td>" 
      + walmartPrice + "</td></tr>" + "<tr><td>"
     + walmartItemSecond + "</td><td>"  
     + "Walmart" + "</td><td>"
      + walmartPriceSecond + "</td></tr>" + "<tr><td>" 
      + walmartItemThird + "</td><td>" 
      + "Walmart" + "</td><td>"
       + walmartPriceThird + "</td><tr>")
  });
};
//console.log(bestBuyItemSKU)



$("#zip-code-btn").on("click", function (event) {
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
    .then(function (response) {
      console.log(response);

      // Storing an array of results in the results variable
      userLocationInfo.latitude = response.results[0].geometry.location.lat;
      console.log(userLocationInfo.latitude);
      userLocationInfo.longitude = response.results[0].geometry.location.lng;
      console.log(userLocationInfo.longitude);
    });

});

//library addtion for interactive map
//mapquest option
L.mapquest.key = 'zgFKXJ2pWxFRwOSV49ARYwhDCodQh5DK';
let map = L.mapquest.map('map', {
  center: [40.760780, -111.891045],
  layers: L.mapquest.tileLayer('map'),
  zoom: 14,
  zoomControl: false
});

let directionsControl = L.mapquest.directionsControl({
  className: '',
  directions: {
    options: {
      timeOverage: 25,
      doReverseGeocode: false,
    }
  },
  directionsLayer: {
    startMarker: {
      title: 'Drag to change location',
      draggable: true,
      icon: 'marker-start',
      iconOptions: {
        size: 'sm'
      }
    },
    endMarker: {
      draggable: true,
      title: 'Drag to change location',
      icon: 'marker-end',
      iconOptions: {
        size: 'sm'
      }
    },
    viaMarker: {
      title: 'Drag to change route'
    },
    routeRibbon: {
      showTraffic: true
    },
    alternateRouteRibbon: {
      showTraffic: true
    },
    paddingTopLeft: [450, 20],
    paddingBottomRight: [180, 20],
  },
  startInput: {
    compactResults: true,
    disabled: false,
    location: {},
    placeholderText: 'Starting point or click on the map...',
    geolocation: {
      enabled: true
    },
    clearTitle: 'Remove starting point'
  },
  endInput: {
    compactResults: true,
    disabled: false,
    location: {},
    placeholderText: 'Destination',
    geolocation: {
      enabled: true
    },
    clearTitle: 'Remove this destination'
  },
  addDestinationButton: {
    enabled: true,
    maxLocations: 10,
  },
  routeTypeButtons: {
    enabled: true,
  },
  reverseButton: {
    enabled: true,
  },
  optionsButton: {
    enabled: true,
  },
  routeSummary: {
    enabled: true,
    compactResults: false,
  },
  narrativeControl: {
    enabled: true,
    compactResults: false,
    interactive: true,
  }
}).addTo(map);
}
