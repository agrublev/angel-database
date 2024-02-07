import React from "react";
import AddProperty from "./AddProperty";
import { getType } from "./helpers";
import { RenderEditItem } from "./RenderEditItem";
import RenderObject from "./RenderObject";

class RenderVisualLine extends React.Component {
    render() {
        const { data, item, showVisualEditorUpdate, refresh } = this.props;
        let valueType = getType(data[item]);
        return (
            <div key={item} className={"edit-item"}>
                {valueType === "array" && (
                    <div className={"edit-array"}>
                        {data[item].map((v, i) => {
                            let subValueType = getType(v);
                            if (subValueType === "array") {
                                return (
                                    <div className={"edit-array-inline"}>
                                        {v.map((vv, ii) => (
                                            <div className={"array-inline-item"}>
                                                <RenderEditItem
                                                    name={ii}
                                                    valueType={getType(vv)}
                                                    value={vv}
                                                    onChange={(newValue) => {
                                                        data[item][i][ii] = newValue;
                                                    }}
                                                />
                                                <button
                                                    className={"button edit-delete button-delete"}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        data[item][i].splice(ii, 1);
                                                        refresh();
                                                    }}
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            className={"button edit-add button-add"}
                                            onClick={() => {
                                                let subValueType = getType(v[0]);
                                                let blankValue = this.getBlankValue(
                                                    subValueType,
                                                    i,
                                                    v
                                                );
                                                data[item][i].push(blankValue);
                                            }}
                                        >
                                            +a
                                        </button>
                                    </div>
                                );
                            } else if (subValueType === "object") {
                                return <div>OBJECT</div>;
                            } else {
                                return (
                                    <>
                                        <RenderEditItem
                                            name={i}
                                            valueType={subValueType}
                                            value={v}
                                            onChange={(newValue) => {
                                                data[item][i] = newValue;
                                            }}
                                        />
                                        <button
                                            className={"button edit-delete button-delete"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                data[item].splice(i, 1);
                                                refresh();
                                            }}
                                        >
                                            x
                                        </button>
                                    </>
                                );
                            }
                        })}
                        <AddProperty refresh={refresh} copy={data[item]} isPush={true} />
                        {/*<button*/}
                        {/*    className={"button edit-add"}*/}
                        {/*    onClick={() => {*/}
                        {/*        if (data[item][0] === undefined) {*/}
                        {/*            data[item].push("");*/}
                        {/*            refresh();*/}
                        {/*        } else {*/}
                        {/*            let subValueType = getType(data[item][0]);*/}
                        {/*            let blankValue = this.getBlankValue(subValueType, item, data);*/}
                        {/*            data[item].push(blankValue);*/}
                        {/*            refresh();*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    +b*/}
                        {/*</button>*/}
                    </div>
                )}
                {valueType === "object" && (
                    <RenderObject
                        refresh={refresh}
                        showVisualEditorUpdate={showVisualEditorUpdate}
                        copy={data[item]}
                        margin={15}
                    />
                    // <div className={"edit-array"}>
                    //     {Object.keys(data[item]).map((v, i) => {
                    //         let val = data[item][v];
                    //         let subValueType = getType(val);
                    //         console.log("--- INFO val", val);
                    //         if (subValueType === "array") {
                    //             return (
                    //                 <div className={"edit-array-inline"}>
                    //                     {val.map((vv, ii) => (
                    //                         <div className={"array-inline-item"}>
                    //                             <RenderEditItem
                    //                                 name={ii}
                    //                                 valueType={getType(vv)}
                    //                                 value={vv}
                    //                                 onChange={(newValue) => {
                    //                                     data[item][i][ii] = newValue;
                    //                                 }}
                    //                             />
                    //                             <button
                    //                                 className={"button edit-delete button-delete"}
                    //                                 onClick={(e) => {
                    //                                     e.preventDefault();
                    //                                     data[item][i].splice(ii, 1);
                    //                                     refresh();
                    //                                 }}
                    //                             >
                    //                                 x
                    //                             </button>
                    //                         </div>
                    //                     ))}
                    //                     <button
                    //                         className={"button edit-add button-add"}
                    //                         onClick={() => {
                    //                             let subValueType = getType(v[0]);
                    //                             let blankValue = this.getBlankValue(
                    //                                 subValueType,
                    //                                 i,
                    //                                 v
                    //                             );
                    //                             data[item][i].push(blankValue);
                    //                         }}
                    //                     >
                    //                         +a
                    //                     </button>
                    //                 </div>
                    //             );
                    //         } else {
                    //             return (
                    //                 <RenderEditItem
                    //                     name={i}
                    //                     valueType={subValueType}
                    //                     value={v}
                    //                     onChange={(newValue) => {
                    //                         data[item][i] = newValue;
                    //                     }}
                    //                 />
                    //             );
                    //         }
                    //     })}
                    //     <button
                    //         className={"button edit-add"}
                    //         onClick={() => {
                    //             if (data[item][0] === undefined) {
                    //                 data[item].push("");
                    //                 refresh();
                    //             } else {
                    //                 let subValueType = getType(data[item][0]);
                    //                 let blankValue = this.getBlankValue(subValueType, item, data);
                    //                 data[item].push(blankValue);
                    //                 refresh();
                    //             }
                    //         }}
                    //     >
                    //         +b
                    //     </button>
                    // </div>
                )}
                {valueType !== "array" && (
                    <RenderEditItem
                        name={item}
                        valueType={valueType}
                        value={data[item]}
                        onChange={(newValue) => {
                            data[item] = newValue;
                        }}
                    />
                )}
            </div>
        );
    }

    getBlankValue = (subValueType, t, placeholder) => {
        let blankValue = null;
        if (subValueType === "string") {
            blankValue = "";
        } else if (subValueType === "number") {
            blankValue = 0;
        } else if (subValueType === "boolean") {
            blankValue = false;
        } else if (subValueType === "array") {
            if (placeholder[t][0] === null) {
                blankValue = ["", ""];
            } else {
                let subSubValueType = getType(placeholder[t][0][0]);
                blankValue = [this.getBlankValue(subSubValueType, t, placeholder)];
            }
        }
        return blankValue;
    };
}

export default RenderVisualLine;
