// CollabSheetContent.js
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  createSession,
  fetchSession,
  endSession as endSessionThunk,
  leaveSession as leaveSessionThunk,
} from "@/store/shop/session-slice";
import ChatComponent from "@/pages/UserSharedCart/ChatComponent"; // Adjust the import path as necessary
import { Copy } from "lucide-react";

const CollabSheetContent = ({ openCollabSheet, setOpenCollabSheet }) => {
  const dispatch = useDispatch();
  const { sessionId, sessionLink, loading, error } = useSelector(
    (state) => state.collabSlice
  );
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState();
  const { userCount } = useSelector((state) => state.shopCart);
  const [connectedUsers, setConnectedUsers] = useState([]);
  // console.log(userCount);

  const handleGenerateLink = async () => {
    await dispatch(createSession({ userId: user?.id }));
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSession({ userId: user.id }));
    }
  }, [user, dispatch]);

  // removed username syncing; we will only show session active indicator now

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const endSession = () => {
    if (!user?.id) return;
    dispatch(endSessionThunk({ userId: user.id }));
  };

  const leaveSession = () => {
    if (!user?.id) return;
    dispatch(leaveSessionThunk({ userId: user.id }));
  };

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
          ) : userCount <= 1 ? (
            <div className=" break-words">
              <p className="mb-2">Share this link with your friend:</p>
              <span className="text-gray-500">{sessionLink}</span>
              <div className="flex  items-center mt-2 gap-4">
                <span onClick={handleCopy} className="cursor-pointer">
                  Copy Link
                </span>
                <Copy onClick={handleCopy} className="cursor-pointer mt-2" />
                {copied && <span className="text-green-500">Copied!</span>}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-700">Session active</span>
            </div>
          )}

          {error && <p className="text-red-500 mt-2">Error: {error}</p>}

          {sessionId && (
            <div className="absolute bottom-0 left-0 w-full h-[400px] rounded-lg flex flex-col">
              <h2 className="mb-2 ml-4">Chat with Your Friend</h2>
              <div className="flex-1 overflow-auto p-4 bg-gray-100">
                <ChatComponent sessionId={sessionId} />
              </div>
              <div className="flex justify-end gap-3 p-4">
                <Button variant="outline" onClick={leaveSession}>
                  Leave Session
                </Button>
                <Button variant="destructive" onClick={endSession}>
                  End Session
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CollabSheetContent;
