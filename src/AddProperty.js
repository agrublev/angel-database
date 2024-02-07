import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";

let properties = ["String", "Number", "Boolean", "Array", "Object"];

@observer
class AddProperty extends React.Component {
    @observable showProperty = false;

    render() {
        const { copy, refresh, isPush = false } = this.props;
        return (
            <div
                className={`button add-property ${this.showProperty ? "add-property-show" : ""}`}
                onClick={() => {
                    this.showProperty = !this.showProperty;
                }}
            >
                <span>Add Property</span>
                <div className="add-property-dropdown">
                    {properties.map((prop, i) => (
                        <div
                            className="add-property-item"
                            key={`add-${i}-${prop}`}
                            onClick={() => {
                                if (!isPush) {
                                    const key = this.getUniqueKey();
                                    copy[key] = this.getEmpty(prop.toLowerCase());
                                    refresh();
                                } else {
                                    console.info("Console --- copy", copy);

                                    copy.push(this.getEmpty(prop.toLowerCase()));
                                    refresh();
                                }
                            }}
                        >
                            {prop}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    getEmpty = (typeVal) => {
        if (typeVal === "string") {
            return "";
        } else if (typeVal === "number") {
            return 0;
        } else if (typeVal === "boolean") {
            return true;
        } else if (typeVal === "array") {
            return [];
        } else if (typeVal === "object") {
            return {};
        }
    };

    getUniqueKey = () => {
        const { copy } = this.props;
        let keyVal;
        while (true) {
            let key = prompt("Enter key name:");
            if (key !== "" && copy[key] === undefined && key !== null) {
                keyVal = key;
                break;
            }
        }
        return keyVal;
    };
}

export default AddProperty;
