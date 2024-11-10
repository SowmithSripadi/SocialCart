// frontend/components/SharedCart.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with server URL if needed

const SharedCart = ({ sessionId }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    socket.emit("join_session", sessionId);

    socket.on("cart_updated", (updatedCart) => {
      setCartItems(updatedCart.items);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const addItem = (productId, quantity) => {
    socket.emit("add_item_to_cart", { sessionId, productId, quantity });
  };

  const removeItem = (productId) => {
    socket.emit("remove_item_from_cart", { sessionId, productId });
  };

  return (
    <div className="shared-cart">
      <h2>Shared Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.product_id}>
            <span>{item.product_id}</span>
            <span>Quantity: {item.quantity}</span>
            <button onClick={() => removeItem(item.product_id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addItem("example-product-id", 1)}>
        Add Example Product
      </button>
    </div>
  );
};

export default SharedCart;
