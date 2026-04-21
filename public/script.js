/* =========================
   SEARCH BOOKS
========================= */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function searchBooks() {

if (!searchInput) return;

const input = searchInput.value.toLowerCase();
const books = document.querySelectorAll(".book");

books.forEach(book => {

const title = book.dataset.title.toLowerCase();

if (title.includes(input)) {
book.style.display = "block";
} else {
book.style.display = "none";
}

});

}

if (searchBtn) {
searchBtn.addEventListener("click", searchBooks);
}

if (searchInput) {
searchInput.addEventListener("keyup", function(event){
if(event.key === "Enter"){
searchBooks();
}
});
}



/* =========================
   SHOPPING CART
========================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {

cart.push({ name, price });

localStorage.setItem("cart", JSON.stringify(cart));

alert(name + " added to cart 🛒");

}



/* =========================
   VIEW CART
========================= */

function viewCart() {

const items = JSON.parse(localStorage.getItem("cart")) || [];

if(items.length === 0){
alert("Your cart is empty");
return;
}

let text = "🛒 Cart Items:\n\n";

items.forEach((item,index) => {

text += (index+1) + ". " + item.name + " - ₹" + item.price + "\n";

});

alert(text);

}



/* =========================
   CLEAR CART
========================= */

function clearCart(){

localStorage.removeItem("cart");

cart = [];

alert("Cart cleared");

}



/* =========================
   REMOVE LAST ITEM
========================= */

function removeLastItem(){

let items = JSON.parse(localStorage.getItem("cart")) || [];

items.pop();

localStorage.setItem("cart", JSON.stringify(items));

alert("Last item removed");

}