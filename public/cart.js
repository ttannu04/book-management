let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name,price){

cart.push({name,price});

localStorage.setItem("cart",JSON.stringify(cart));

alert("Book added to cart!");

}

function displayCart(){

const container = document.getElementById("cartItems");

cart.forEach(item=>{

container.innerHTML += `
<p>${item.name} - ₹${item.price}</p>
`;

});

}

displayCart();