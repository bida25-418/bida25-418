// Load cart from browser storage so it never gets erased
var cart = JSON.parse(localStorage.getItem("lexx_cart")) || [];

// Save cart to browser storage
function saveCart() {
    localStorage.setItem("lexx_cart", JSON.stringify(cart));
}

// Add item to cart
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    saveCart();
    updateCartBadge();
    alert(name + " added to cart! P" + price.toFixed(2));
}

// Update the little number next to Order in the menu
function updateCartBadge() {
    var badges = document.getElementsByClassName("cart-badge");
    for (var i = 0; i < badges.length; i++) {
        badges[i].textContent = cart.length;
    }
}

// Get cart items as text for the email
function getOrderText() {
    var items = [];
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        items.push(cart[i].name + " - P" + cart[i].price.toFixed(2));
        total += cart[i].price;
    }
    return {
        items: items.length > 0 ? items.join(" | ") : "No items",
        total: "P" + total.toFixed(2)
    };
}

// Show the order table on the order page
function showOrderSummary() {
    var tableBody = document.getElementById("order-items");
    var totalDiv = document.getElementById("order-total");

    if (!tableBody) return;

    tableBody.innerHTML = "";
    var total = 0;

    for (var i = 0; i < cart.length; i++) {
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + cart[i].name + "</td><td>P" + cart[i].price.toFixed(2) + "</td>";
        tableBody.appendChild(row);
        total += cart[i].price;
    }

    if (cart.length === 0) {
        var row = document.createElement("tr");
        row.innerHTML = "<td colspan='2' style='text-align:center;'>Your cart is empty. <a href='menu.html'>Go to Menu</a></td>";
        tableBody.appendChild(row);
    }

    totalDiv.textContent = "Total: P" + total.toFixed(2);
}

// Submit order to Formspree
function submitOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty! Add items from the menu first.");
        return;
    }

    // Put cart data into hidden fields
    var orderData = getOrderText();
    document.getElementById("hidden-items").value = orderData.items;
    document.getElementById("hidden-total").value = orderData.total;

    // Get the form
    var form = event.target;

    // Send to Formspree
    fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
    })
    .then(function(response) {
        if (response.ok) {
            alert("Order placed successfully! You will receive a confirmation email.");
            // Clear everything
            cart = [];
            saveCart();
            updateCartBadge();
            showOrderSummary();
            form.reset();
        } else {
            alert("Something went wrong. Please try again.");
        }
    })
    .catch(function() {
        alert("Network error. Check your internet connection and try again.");
    });
}

// Submit contact form to Formspree
function submitContact(event) {
    event.preventDefault();

    var form = event.target;

    fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
    })
    .then(function(response) {
        if (response.ok) {
            alert("Message sent! We will get back to you soon.");
            form.reset();
        } else {
            alert("Something went wrong. Please try again.");
        }
    })
    .catch(function() {
        alert("Network error. Check your internet connection.");
    });
}

// Run on every page load
window.onload = function() {
    updateCartBadge();
    showOrderSummary();
};