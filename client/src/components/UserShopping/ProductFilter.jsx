import { filterOptions } from "@/config";
import React, { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const handleRemoveCheck = () => {};

function ProductFilter({
  filters,
  handleFilter,
  handleApplyFilters,
  setFilters,
  setSearchParams,
  handleRemoveFilters,
}) {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid grid-cols-2 mt-2 gap-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id} // Added unique key for each option
                    className="flex items-center gap-2 font-medium"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
        <div className="flex flex-col gap-2 p-4 justify-center items-center">
          <Button
            variant="outline"
            className="border-b-4"
            onClick={() => {
              handleApplyFilters();
            }}
          >
            Apply filter
          </Button>
          <Button
            variant="outline"
            className="border-b-4"
            onClick={() => {
              handleRemoveFilters();
              handleRemoveCheck();
            }}
          >
            Remove filter
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
