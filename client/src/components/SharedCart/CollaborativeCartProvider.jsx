import React, { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useDispatch, useSelector } from "react-redux";
import { updateSessionCartItems, updateUserCount, clearSessionId } from "@/store/shop/cart-slice";
import { clearSession } from "@/store/shop/session-slice";

// shared socket instance

const CollaborativeCartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { sessionId } = useSelector((state) => state.collabSlice);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (sessionId) {
      socket.emit("join_session", {
        sessionId,
        userId: user?.id,
        userName: user?.name,
      });

      socket.on("cart_updated", (data) => {
        dispatch(updateSessionCartItems(data.items));
      });

      socket.on("user_count_updated", (data) => {
        dispatch(updateUserCount(data.userCount));
      });

      socket.on("session_ended", () => {
        dispatch(clearSessionId());
        dispatch(clearSession());
      });

      // Ask for the current user list when we join
      socket.emit("get_user_list", sessionId);
    }

    return () => {
      if (sessionId) {
        socket.emit("leave_session", sessionId);
        socket.off("cart_updated");
        socket.off("user_count_updated");
        socket.off("session_ended");
      }
    };
  }, [sessionId, user?.id, user?.name, dispatch]);

  return <>{children}</>;
};

export default CollaborativeCartProvider;
