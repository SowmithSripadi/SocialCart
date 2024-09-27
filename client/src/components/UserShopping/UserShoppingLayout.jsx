import React from "react";
import { Outlet } from "react-router-dom";
import UserShoppingHeader from "../";

function UserShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* header */}
      <UserShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default UserShoppingLayout;
