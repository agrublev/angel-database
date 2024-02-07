import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import AddProperty from "./AddProperty";
import { getType } from "./helpers";
import RenderVisualLine from "./RenderVisualLine";

@observer
class RenderObject extends React.Component {
    @observable collapsedObjects = [];
    render() {
        const { showVisualEditorUpdate, refresh, copy, margin = 0 } = this.props;
        return (
            <div className={"render-object"} style={{ marginLeft: margin }}>
                {Object.keys(copy).map((t) => {
                    let propType = getType(copy[t]);
                    return (
                        <div className={"edit-visual-line"}>
                            <div className={"edit-line-label"}>
                                <div
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.target.blur();
                                            this.editRef.blur();
                                            return false;
                                        }
                                    }}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        let text = e.clipboardData.getData("text/plain");
                                        document.execCommand("insertHTML", false, text);
                                    }}
                                    onBlur={(e) => {
                                        if (copy[e.target.innerText] === undefined) {
                                            copy[e.target.innerText] = structuredClone(
                                                toJS(copy[t])
                                            );
                                            delete copy[t];
                                        } else {
                                            e.target.innerText = t;
                                            console.error("Key already exists");
                                        }
                                    }}
                                    className={`edit-name edit-name-${propType}`}
                                    contentEditable={true}
                                    suppressContentEditableWarning="true"
                                    autoCorrect="false"
                                    spellCheck="false"
                                    ref={(ref) => (this.editRef = ref)}
                                >
                                    {t}
                                </div>
                                <button
                                    className={"button edit-delete button-delete-minimal"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        delete copy[t];
                                        showVisualEditorUpdate(false);
                                        setTimeout(() => {
                                            showVisualEditorUpdate(true);
                                        }, 1);
                                    }}
                                >
                                    x
                                </button>
                                {propType === "object" && (
                                    <>
                                        <button
                                            className={"button"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (!this.collapsedObjects.includes(t)) {
                                                    this.collapsedObjects.push(t);
                                                } else {
                                                    let ind = this.collapsedObjects.findIndex(
                                                        (o) => o === t
                                                    );
                                                    this.collapsedObjects.splice(ind, 1);
                                                }
                                            }}
                                        >
                                            {!this.collapsedObjects.includes(t)
                                                ? "collapse"
                                                : "expand"}
                                        </button>
                                        <AddProperty
                                            refresh={refresh}
                                            copy={copy[t]}
                                            isPush={false}
                                        />
                                    </>
                                )}
                            </div>
                            {!this.collapsedObjects.includes(t) || propType !== "object" ? (
                                <RenderVisualLine
                                    item={t}
                                    data={copy}
                                    refresh={refresh}
                                    showVisualEditorUpdate={showVisualEditorUpdate}
                                />
                            ) : null}
                        </div>
                    );
                })}
            </div>
        );
    }
}
export default RenderObject;
