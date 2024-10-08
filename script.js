document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalContainer = document.getElementById("subtotal");
    const totalContainer = document.getElementById("total");
    const checkoutButton = document.getElementById("checkout-button");

    const fetchCartData = async () => {
        try {
            const response = await fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889");
            const data = await response.json();
            renderCartItems(data.items);
            updateTotals(data.original_total_price);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    const renderCartItems = (items) => {
        cartItemsContainer.innerHTML = "";
        items.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <div>Price: ₹${(item.price / 100).toFixed(2)}</div>
                    <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
                    <div>Subtotal: ₹${((item.price * item.quantity) / 100).toFixed(2)}</div>
                    <button class="remove-item" data-id="${item.id}">🗑️</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        attachEventListeners();
    };

    const updateTotals = (originalTotalPrice) => {
        const total = originalTotalPrice / 100;
        subtotalContainer.innerHTML = `Subtotal: ₹${total.toFixed(2)}`;
        totalContainer.innerHTML = `Total: ₹${total.toFixed(2)}`;
    };

    const attachEventListeners = () => {
        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("change", updateSubtotal);
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", removeItem);
        });
    };

    const updateSubtotal = (event) => {
        const input = event.target;
        const id = input.dataset.id;
        const itemElement = input.closest('.cart-item');
        const price = parseFloat(itemElement.querySelector('div:nth-child(2)').textContent.replace(/Price: ₹|,/g, '').trim());
        const quantity = parseInt(input.value);
        const subtotal = price * quantity;
        itemElement.querySelector('div:nth-child(4)').innerHTML = `Subtotal: ₹${(subtotal / 100).toFixed(2)}`;
        updateCartTotal();
    };

    const removeItem = (event) => {
        const id = event.target.dataset.id;
        const itemElement = event.target.closest('.cart-item');
        itemElement.remove();
        updateCartTotal();
    };

    const updateCartTotal = () => {
        let total = 0;
        document.querySelectorAll(".cart-item").forEach(item => {
            const subtotal = parseFloat(item.querySelector('div:nth-child(4)').textContent.replace(/Subtotal: ₹|,/g, '').trim());
            total += subtotal;
        });
        subtotalContainer.innerHTML = `Subtotal: ₹${total.toFixed(2)}`;
        totalContainer.innerHTML = `Total: ₹${total.toFixed(2)}`;
    };

    checkoutButton.addEventListener("click", () => {
        alert("Proceeding to checkout...");
    });

    fetchCartData();
});
