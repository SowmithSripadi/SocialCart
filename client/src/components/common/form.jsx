import React from "react";
import { Input } from "../ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

function Commonform({ formControls }) {
  const renderInputsbyComponents = (controlItem) => {
    let element = null;
    switch (controlItem.commonType) {
      case "input":
        element = (
          <Input
            name={controlItem.name}
            palceholder={controlItem.palceholder}
            id={controlItem.name}
            type={controlItem.type}
          />
        );
        break;
      case "select":
        element = (
          <select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options && controlItem.options.length > 0
                ? controlItem.options.map((optionItem) => (
                    <SelectItem
                      key={optionItem.id}
                      value={optionItem.id}
                    ></SelectItem>
                  ))
                : null}
            </SelectContent>
          </select>
        );
        break;
      case "input":
        element = (
          <Input
            name={controlItem.name}
            palceholder={controlItem.palceholder}
            id={controlItem.name}
            type={controlItem.type}
          />
        );
        break;
      default:
        element = (
          <Input
            name={controlItem.name}
            palceholder={controlItem.palceholder}
            id={controlItem.name}
            type={controlItem.type}
          />
        );
        break;
    }
  };

  return (
    <form>
      <div className="flex flex-col gap-3">
        {formControl.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <label className="mb-1">{controlItem.label}</label>
            {renderInputsbyComponents(controlItem)}
          </div>
        ))}
      </div>
    </form>
  );
}

export default Commonform;
