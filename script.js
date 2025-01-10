// Fetch the cart data from API
fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
    .then(response => response.json())
    .then(data => {
        const cartItems = data.items;
        const cartItemsList = document.querySelector('#cart-items-list tbody');
        let subtotal = 0;

        cartItems.forEach((item, index) => {
            // Calculate the subtotal for the item
            const itemSubtotal = (item.line_price / 100).toFixed(2);

            // Create a table row for each cart item
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <span>${item.title}</span>
                </td>
                <td>₹${(item.price / 100).toFixed(2)}</td>
                <td>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                </td>
                <td>₹<span class="item-subtotal">${itemSubtotal}</span></td>
                <td class="delete-btn">
                    <img src="https://img.icons8.com/?size=100&id=cUD57nntjaHY&format=png&color=000000" alt="Delete Icon" class="delete-icon">
                </td>
            `;

            // Append the row to the table body
            cartItemsList.appendChild(row);
            subtotal += parseFloat(itemSubtotal);
        });

        // Update subtotal and total
        document.getElementById('subtotal').innerText = `₹${subtotal.toFixed(2)}`;
        document.getElementById('total').innerText = `₹${subtotal.toFixed(2)}`;

        // Add event listeners for quantity changes and item removal
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const removeButtons = document.querySelectorAll('.delete-btn');

        quantityInputs.forEach((input, index) => {
            input.addEventListener('change', () => {
                const newQuantity = parseInt(input.value);
                const itemSubtotal = document.querySelectorAll('.item-subtotal')[index];
                const itemPrice = cartItems[index].price / 100;

                // Update the subtotal for that item
                itemSubtotal.innerText = (newQuantity * itemPrice).toFixed(2);

                // Update the overall total
                updateTotals();
            });
        });

        removeButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Remove the item
                cartItemsList.children[index].remove();
                cartItems.splice(index, 1);

                // Update the totals
                updateTotals();
            });
        });

        function updateTotals() {
            let newSubtotal = 0;

            document.querySelectorAll('.item-subtotal').forEach(sub => {
                newSubtotal += parseFloat(sub.innerText);
            });

            document.getElementById('subtotal').innerText = `₹${newSubtotal.toFixed(2)}`;
            document.getElementById('total').innerText = `₹${newSubtotal.toFixed(2)}`;
        }
    });
