import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar, AdminHeader } from "..";
import { useState } from "react";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      {/* admin siderbar */}
      <AdminSidebar open={open} setOpen={setOpen} />
      <div className="flex flex-1 flex-col">
        {/* admin header  */}
        <AdminHeader setOpen={setOpen} />
        <main className="bg-muted/40 p-4 md:p-6">
          {/* flex-1 flex */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
