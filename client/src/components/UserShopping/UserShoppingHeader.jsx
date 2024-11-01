import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { House, LogOut, Menu, ShoppingCart, CircleUser } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/Userauth-slice";
import UserCartWrapper from "./cart-wrapper";

const MenuItems = () => {
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Link
          className="text-md font-medium"
          key={menuItem.id}
          to={menuItem.path}
        >
          {menuItem.label}
        </Link>
      ))}
    </nav>
  );
};

const HeaderRightContent = ({ setOpenSheet }) => {
  const { user } = useSelector((state) => state.auth);
  const FLName = user.name.split(" ");
  let initials = FLName.map((name) => name[0].toUpperCase()).join("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openCartSheet, setOpenCartSheet] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black sm:mt-7 md:mt-0 lg:mt-0">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-10 mt-2">
          <DropdownMenuLabel>Logged in as {user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate("/shop/account");
              setOpenSheet(false);
            }}
            className="cursor-pointer"
          >
            <CircleUser className="mr-2 h-4 w-4 " />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleLogout()}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4 " />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button onClick={() => setOpenCartSheet(true)}>
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper />
      </Sheet>
    </div>
  );
};

function UserShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [openSheet, setOpenSheet] = useState(false);

  const handleSheetOpen = (open) => {
    setOpenSheet(open);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background p-4">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex flex-col items-center mt-3">
          <House className="h-6 w-6" />
          <span className="font-bold">Home</span>
        </Link>
        <Sheet open={openSheet} onOpenChange={handleSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs lg:hidden">
            <MenuItems />
            <HeaderRightContent setOpenSheet={setOpenSheet} />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default UserShoppingHeader;
