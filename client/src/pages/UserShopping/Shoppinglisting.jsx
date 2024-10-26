import { ProductFilter, ShoppingProductTile } from "@/components";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useSearchParams } from "react-router-dom";

const createSearchParamsHelper = (filterParams) => {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
};

function Shoppinglisting() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const [filters, setFilters] = useState("");
  const [applyFilters, setApplyFilters] = useState("");
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (getSelectionId, getCurrentOption) => {
    let AllSelectedFilters = { ...filters };
    const indexofCurrentSelection =
      Object.keys(AllSelectedFilters).indexOf(getSelectionId); //first check if brand, category or any other are present

    if (indexofCurrentSelection === -1) {
      AllSelectedFilters = {
        ...AllSelectedFilters,
        [getSelectionId]: [getCurrentOption], //if not present add along with the option
      };
    } else {
      const indexofCurrentOption =
        AllSelectedFilters[getSelectionId].indexOf(getCurrentOption); //check if the selected option is present

      //toggling the current option
      if (indexofCurrentOption === -1)
        AllSelectedFilters[getSelectionId].push(getCurrentOption);
      else AllSelectedFilters[getSelectionId].splice(indexofCurrentOption, 1);
    }
    setFilters(AllSelectedFilters);
    sessionStorage.setItem("filters", JSON.stringify(AllSelectedFilters));
  };

  const handleApplyFilters = () => {
    // Generate the query string and update URL
    const queryString = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(queryString));
    sessionStorage.setItem("filters", JSON.stringify(filters));
    setApplyFilters(filters);
    // Store filters and trigger fetch
    // dispatch(
    //   fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
    // );
    // setApplyFilters(true);
  };

  const handleRemoveFilters = () => {
    setFilters({}); // Reset filters to an empty object
    setApplyFilters({});
    sessionStorage.removeItem("filters");
    setSearchParams(new URLSearchParams()); // Clear URL parameters
    // dispatch(
    //   fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
    // );
    // setApplyFilters(false);
  };

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
    );
  }, [applyFilters, sort, dispatch]);

  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters") || "{}");
    const initialSort = "price-lowtohigh";
    setFilters(savedFilters);
    setSort(initialSort);

    // Dispatch based on whether filters are saved
    if (Object.keys(savedFilters).length > 0) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: savedFilters,
          sortParams: initialSort,
        })
      );
    } else {
      dispatch(
        fetchAllFilteredProducts({ filterParams: {}, sortParams: initialSort })
      );
    }
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        handleApplyFilters={handleApplyFilters}
        setFilters={setFilters}
        setSearchParams={setSearchParams}
        handleRemoveFilters={handleRemoveFilters}
      />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="cursor-pointer"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length
            ? productList.map((product, index) => (
                <ShoppingProductTile
                  key={product.id || index}
                  product={product}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default Shoppinglisting;
