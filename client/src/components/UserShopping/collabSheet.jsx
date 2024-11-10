import React, { useEffect } from "react";
import ChatComponent from "@/pages/UserSharedCart/ChatComponent";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createSession, fetchSession } from "@/store/shop/session-slice";

const CollabSheetContent = ({ openCollabSheet, setOpenCollabSheet }) => {
  const dispatch = useDispatch();
  const { sessionId, sessionLink, loading, error } = useSelector(
    (state) => state.collabSlice
  );
  const { user } = useSelector((state) => state.auth);
  const handleGenerateLink = () => {
    dispatch(createSession({ userId: user?.id }));
  };

  useEffect(() => {
    fetchSession({ userId: user?.id });
  }, [user]);

  return (
    <Sheet
      open={openCollabSheet}
      onOpenChange={() => setOpenCollabSheet(false)}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shop together with your friend</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          {!sessionLink ? (
            <Button onClick={handleGenerateLink} disabled={loading}>
              {loading
                ? "Generating Link..."
                : "Generate Link for Collaboration"}
            </Button>
          ) : (
            <div>
              <p>Share this link with your friend:</p>
              <a href={sessionLink} target="_blank" rel="noopener noreferrer">
                {sessionLink}
              </a>
            </div>
          )}

          {error && <p className="text-red-500 mt-2">Error: {error}</p>}

          {sessionId && (
            <div className="mt-4">
              <h2>Chat with Your Friend</h2>
              <ChatComponent sessionId={sessionId} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CollabSheetContent;
