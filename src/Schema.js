import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { hot } from "react-hot-loader";
import Collection from "./localDatabase";
// import JSONInput from "react-json-editor-ajrm";
// import locale from "react-json-editor-ajrm/locale/en";
const db = new Collection("myssDb", {
    title: "Auth",
    fields: [
        { name: "uid", type: "string" },
        { name: "firstName", type: "string" },
        { name: "age", type: "integer" },
        { name: "married", type: "boolean" },
        {
            name: "customFields",
            type: "array",
            items: [
                { name: "firstCustom", type: "text" },
                {
                    name: "secondCustom",
                    type: "object",
                    properties: { fb_link: { type: "string" }, li_link: { type: "string" } }
                }
            ]
        },
        { name: "color", type: "string", enum: ["red", "blue", "green"] }
    ]
});

@observer
class Schema extends React.Component {
    @observable schema = db.get();

    componentDidUpdate() {
        db.set(this.schema);
    }

    render() {
        return (
            <div className="Schema">
                <div className={"reset"}>
                    <button
                        onClick={e => {
                            db.set({ title: "Schema", fields: [] });
                            // db.remove();
                            window.location.reload();
                        }}
                    >
                        EMPTY
                    </button>
                    <button
                        onClick={e => {
                            db.remove();
                            window.location.reload();
                        }}
                    >
                        CLEAN
                    </button>
                </div>
                <div>
                    <h2>Name: {this.schema.title}</h2>
                    <div className={"fields"}>{this.renderFields(this.schema.fields)}</div>
                </div>
                <pre>{JSON.stringify(this.schema.fields, null, 4)}</pre>
            </div>
        );
    }

    renderFields = fields => {
        return (
            <>
                {fields.map((field, i) => {
                    return (
                        <div key={`${Math.random() * 199}-${field.name}`} className={"properties"}>
                            <div className={"name prop"}>
                                Name:
                                <input
                                    autoFocus={true}
                                    defaultValue={field.name}
                                    onBlur={e => {
                                        field.name = e.target.value;
                                    }}
                                />
                            </div>
                            <div className={"type prop"}>
                                Type:
                                <select
                                    defaultValue={field.type}
                                    onChange={e => {
                                        field.type = e.target.value;
                                    }}
                                >
                                    {[
                                        "string",
                                        "integer",
                                        "boolean",
                                        "textarea",
                                        "array",
                                        "object"
                                    ].map(type => {
                                        return (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            {field.enum && (
                                <div className={"enum prop"}>
                                    {field.enum.map((option, oi) => (
                                        <div key={option}>
                                            <input
                                                defaultValue={option}
                                                onBlur={e => {
                                                    field.enum[oi] = e.target.value;
                                                }}
                                                type={field.type === "string" ? "text" : "number"}
                                            />
                                            <button
                                                className={"delete"}
                                                onClick={e => {
                                                    field.enum.splice(oi, 1);
                                                }}
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={e => {
                                            field.enum.push("");
                                        }}
                                    >
                                        ADD
                                    </button>
                                </div>
                            )}
                            {field.type === "array" && (
                                <div className={"array prop"}>{this.renderFields(field.items)}</div>
                            )}
                            <button
                                className={"delete"}
                                onClick={e => {
                                    fields.splice(i, 1);
                                }}
                            >
                                X
                            </button>
                        </div>
                    );
                })}
                <button
                    onClick={e => {
                        fields.push({ name: "", type: "string" });
                    }}
                >
                    ADD FIELD
                </button>
            </>
        );
    };
    fetchItems = () => {
        this.collection = [];
    };
}

export default hot(module)(Schema);
