import React from "react";
import { getType } from "./helpers";

export class RenderEditItem extends React.Component {
    render() {
        const { valueType, name, value, onChange, onRemove } = this.props;
        return (
            <label className={"edit-label"}>
                {valueType === "string" && (
                    <input
                        type="text"
                        defaultValue={value}
                        className={"edit-text"}
                        onChange={(e) => {
                            onChange(e.currentTarget.value);
                        }}
                    />
                )}
                {valueType === "number" && (
                    <input
                        type="number"
                        defaultValue={value}
                        className={"edit-number"}
                        onChange={(e) => {
                            onChange(parseInt(e.currentTarget.value));
                        }}
                    />
                )}
                {valueType === "boolean" && (
                    <input
                        type="checkbox"
                        className={"edit-checkbox"}
                        defaultChecked={value}
                        onClick={(e) => {
                            onChange(e.currentTarget.checked);
                        }}
                    />
                )}
            </label>
        );
    }
}
