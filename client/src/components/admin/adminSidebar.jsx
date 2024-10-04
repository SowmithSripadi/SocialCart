import React, { Fragment } from "react";
import {
  MonitorCog,
  Presentation,
  ShoppingCart,
  PackageSearch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSideBarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <Presentation />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <ShoppingCart />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <PackageSearch />,
  },
];

function MenuBar({ setOpen }) {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-col gap-4 mt-5">
      {adminSideBarMenuItems.map((menuitems) => (
        <div
          key={menuitems.id}
          className="cursor-pointer text-md flex text-center px-3 py-2 gap-3 hover:bg-muted rounded-2xl text-muted-foreground hover:text-foreground"
          onClick={() => {
            navigate(menuitems.path);
            setOpen && setOpen(false);
          }}
        >
          {menuitems.icon}
          <span>{menuitems.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b flex-row gap-4 items-center">
              <MonitorCog size={27} />
              <SheetTitle className="px-2 pb-2">Admin Panel </SheetTitle>
            </SheetHeader>
            <MenuBar setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div className="flex cursor-pointer items-center gap-2 border-b-2 pb-4">
          <MonitorCog size={27} />
          <h1 className="text-xl font-medium ">Admin Panel</h1>
        </div>
        <MenuBar />
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;
