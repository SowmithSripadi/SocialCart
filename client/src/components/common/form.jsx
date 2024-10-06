import React from "react";
import { Input } from "../ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "../ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

function Commonform({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  className = null,
}) {
  const renderInputsbyComponents = (controlItem) => {
    let element = null;
    const value = formData[controlItem.name] || "";
    switch (controlItem.componentType) {
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
          <Select
            onValueChange={() =>
              setFormData({
                ...formData,
                [controlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options && controlItem.options.length > 0
                ? controlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
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
      <div className={`${className}`}>
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

          <Button type="submit" className="block mx-auto mt-8 w-1/2">
            {buttonText || "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default Commonform;
