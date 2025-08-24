import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import SpecialButton from "../ui/specialButton";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/Userauth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import CollabSheetContent from "../UserShopping/collabSheet";

// Inline truck icon (Tabler) as React component for the brand mark
const TruckIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
    <path d="M3 9l4 0" />
  </svg>
);

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`))
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-3 lg:gap-5 lg:flex-row font-robotoFlex">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="cursor-pointer text-[0.90rem] font-semibold  text-gray-700 hover:text-foreground px-2 py-2 rounded-full hover:bg-muted transition-colors"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { sessionId } = useSelector((state) => state.collabSlice);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openCollabSheet, setOpenCollabSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchCartItems({ sessionId }));
    } else {
      dispatch(fetchCartItems({ userId: user?.id }));
    }
  }, [dispatch, sessionId, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button onClick={() => setOpenCartSheet(true)} variant="outline" size="icon" className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">{(cartItems?.items || []).reduce((t, i) => t + (i?.quantity || 0), 0)}</span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []}
        />
      </Sheet>
      <div onClick={() => setOpenCollabSheet(true)}>
        <SpecialButton name={"Collaborate"} onClick={() => setOpenCollabSheet(true)} />
      </div>
      <CollabSheetContent openCollabSheet={openCollabSheet} setOpenCollabSheet={setOpenCollabSheet} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">{user?.name?.[0]?.toUpperCase() || user?.userName?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="w-56">
          <DropdownMenuLabel>Logged in as {user?.name || user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}> 
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        <Link to="/shop/home" className="flex items-center gap-2 md:gap-3">
          <TruckIcon className="h-6 w-6 md:h-7 md:w-7" />
          <span className="font-extrabold tracking-tight text-lg md:text-xl font-space">SocialCart</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
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

export default ShoppingHeader;


