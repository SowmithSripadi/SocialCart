import React from "react";
import { Input } from "../ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Button } from "../ui/button";

function Commonform({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) {
  const renderInputsbyComponents = (controlItem) => {
    let element = null;
    const value = formData[controlItem.name] || "";

    switch (controlItem.commonType) {
      case "input":
        element = (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
      case "select":
        element = (
          <select
            onValueChange={() =>
              setFormData({
                ...formData,
                [controlItem.name]: value,
              })
            }
            value={value}
          >
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
      case "textarea":
        element = (
          <Textarea
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
      default:
        element = (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }
    return element;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex justify-center">
        <div>
          <div className="flex flex-col gap-3">
            {formControls.map((controlItem) => (
              <div
                className="grid w-full gap-1.5 flex-none"
                key={controlItem.name}
              >
                <label className="mb-1 font-bold">{controlItem.label}</label>
                {renderInputsbyComponents(controlItem)}
              </div>
            ))}
          </div>
          <Button type="submit" className="block mx-auto mt-8 w-1/2">
            {buttonText || "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default Commonform;
