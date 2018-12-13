// Initialize Firebase
var config = {
//api info will go here
};
firebase.initializeApp(config);

var database = firebase.database();
var zipCode = "";
var item = [];

var macyItemResult = "";
var bestbuyItemResult = "";
var amazonItemResult = "";
var lowestPrice = "";
var resultItems = 
  {
  item: "",
  store: "",
  price: "",
  }

  
  
  
  
  
  
  
  
  
//If user ignores the zipcode input pop up modal to remind them to add zipcode. Function called if adding information in the 
//

  
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