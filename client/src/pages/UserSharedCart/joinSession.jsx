// pages/JoinSession.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { joinSession } from "@/store/shop/session-slice";

const JoinSession = () => {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.collaborativeSession);

  useEffect(() => {
    if (isAuthenticated && sessionId) {
      dispatch(joinSession({ userId: user.id, sessionId }));
    }
  }, [isAuthenticated, sessionId, dispatch, user]);

  // Handle success or error
  useEffect(() => {
    if (!loading && !error) {
      navigate("/shop/home"); // Redirect to main shop page
    }
  }, [loading, error, navigate]);

  return (
    <div>
      {loading ? (
        <p>Joining session...</p>
      ) : error ? (
        <p>Error joining session: {error}</p>
      ) : (
        <p>Session joined successfully! Redirecting...</p>
      )}
    </div>
  );
};

export default JoinSession;
