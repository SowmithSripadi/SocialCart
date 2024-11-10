// frontend/pages/CollaborativeShoppingPage.js
import React from "react";
import ChatComponent from "./ChatComponent";
import SharedCart from "../../components/SharedCart/SharedCart";

const CollaborativeShoppingPage = ({ sessionId, userId }) => (
  <div className="collaborative-shopping">
    <ChatComponent sessionId={sessionId} userId={userId} />
    <SharedCart sessionId={sessionId} />
  </div>
);

export default CollaborativeShoppingPage;
