// CollabSheetContent.js
import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createSession, fetchSession } from "@/store/shop/session-slice";
import ChatComponent from "@/pages/UserSharedCart/ChatComponent"; // Adjust the import path as necessary

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
    if (user?.id) {
      dispatch(fetchSession({ userId: user.id }));
    }
  }, [user, dispatch]);

  console.log(sessionId, "sessionId");
  console.log(sessionLink, "sessionLink");

  return (
    <Sheet
      open={openCollabSheet}
      onOpenChange={() => setOpenCollabSheet(false)}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shop together with your friend</SheetTitle>
        </SheetHeader>
        <div className="p-4 flex flex-col h-full">
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
            <div className="mt-4 flex-1 flex flex-col">
              <h2>Chat with Your Friend</h2>
              <div className="flex-1 overflow-auto">
                <ChatComponent sessionId={sessionId} />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CollabSheetContent;
