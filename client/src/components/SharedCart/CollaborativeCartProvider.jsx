import React, { useEffect } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { updateSessionCartItems } from "@/store/shop/cart-slice";
import { updateUserCount } from "@/store/shop/cart-slice";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  withCredentials: true,
});

const CollaborativeCartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { sessionId } = useSelector((state) => state.collabSlice);

  useEffect(() => {
    if (sessionId) {
      socket.emit("join_session", sessionId);

      socket.on("cart_updated", (data) => {
        dispatch(updateSessionCartItems(data.items));
      });

      socket.on("user_count_updated", (data) => {
        dispatch(updateUserCount(data.userCount));
      });
    }

    return () => {
      if (sessionId) {
        socket.emit("leave_session", sessionId);
        socket.off("cart_updated");
        socket.off("user_count_updated");
      }
    };
  }, [sessionId, dispatch]);

  return <>{children}</>;
};

export default CollaborativeCartProvider;
