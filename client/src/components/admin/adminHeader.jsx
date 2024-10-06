import { SquareMenu, LogOut } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

function adminHeader({ setOpen }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b-2 ">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="lg:hidden sm:block shadow"
      >
        <SquareMenu />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          variant="outline"
          className="px-6 py-4 flex gap-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default adminHeader;
