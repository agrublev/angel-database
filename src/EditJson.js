import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import AddProperty from "./AddProperty";
import { getType, iterateObject, iterateObjectUpdateVal } from "./helpers";
import RenderObject from "./RenderObject";

let editorHeight = 320;

@observer
export default class EditJson extends React.Component {
    @observable editingJson = null;
    @observable editingId = null;
    @observable showVisualEditor = false;
    @observable showCodeEditor = false;
    @observable editorHeight = editorHeight;
    copy = null;
    original = null;

    componentDidMount() {
        this.updateCopies();
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     this.updateCopies();
    // }

    render() {
        const {
            item,
            deleteItem,
            currentCollection,
            collection,
            fetchItems,
            updateItem,
            adb,
        } = this.props;

        return (
            <div className={"edit-json"}>
                {this.editingId === this.props.item.id ? (
                    <div>
                        {this.showVisualEditor && (
                            <div>
                                <RenderObject
                                    refresh={this.refresh}
                                    showVisualEditorUpdate={(boo) => (this.showVisualEditor = boo)}
                                    copy={this.copy}
                                />
                                <AddProperty refresh={this.refresh} copy={this.copy} />
                                <div className={"edit-visual-buttons"}>
                                    <button
                                        className="button"
                                        onClick={() => {
                                            let newItem = {
                                                id: item.id,
                                                ...this.copy,
                                                dateUpdated: Date.now(),
                                                dateCreated: item.dateCreated,
                                            };
                                            adb.updateItem(currentCollection, newItem).then(
                                                (result) => {
                                                    const resultItem = JSON.parse(result);
                                                    let ind = collection.items.findIndex(
                                                        (colItem) => colItem.id === resultItem.id
                                                    );
                                                    collection.items[ind] = resultItem;
                                                    updateItem(resultItem);

                                                    let copy = structuredClone(resultItem);
                                                    delete copy["id"];
                                                    delete copy["dateUpdated"];
                                                    this.original = structuredClone(copy);
                                                    this.copy = structuredClone(copy);

                                                    this.editingJson = null;
                                                    this.editingId = null;
                                                    this.showVisualEditor = false;
                                                    this.showCodeEditor = false;
                                                }
                                            );
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="button"
                                        onClick={() => {
                                            this.copy = structuredClone(this.original);
                                            this.editingJson = null;
                                            this.editingId = null;
                                            this.showVisualEditor = false;
                                            this.showCodeEditor = false;
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        {this.showCodeEditor && (
                            <div>
                                <JSONInput
                                    id={`json-${this.props.item.id}`}
                                    placeholder={this.copy}
                                    locale={locale}
                                    ref={(ref) => {
                                        this.editingRef = ref;
                                    }}
                                    height={`${this.editorHeight}px`}
                                    colors={{
                                        default: "#989898",
                                        background: "#1B2C34",
                                        background_warning: "#1B2C34",
                                        string: "#c27340",
                                        number: "#C594C5",
                                        colon: "#49B8F7",
                                        keys: "#98C794",
                                        keys_whiteSpace: "#AF74A5",
                                        primitive: "#C594C5",
                                    }}
                                    // onKeyPressUpdate={false}
                                    // waitAfterKeyPress={3000}
                                    // onBlur={() => {
                                    //     console.log("--- INFO ", this.edRef);
                                    //}}
                                    onChange={(all) => {
                                        this.editingJson = all;
                                        this.copy = all.jsObject;
                                    }}
                                />
                                <button
                                    className="button enlarge-editor"
                                    onClick={() => {
                                        this.editorHeight = this.editorHeight + 100;
                                        this.showCodeEditor = false;
                                        setTimeout(() => {
                                            this.showCodeEditor = true;
                                        }, 1);
                                    }}
                                >
                                    Enlarge Editor
                                </button>
                                <div className={"edit-visual-buttons"}>
                                    <button
                                        className="button"
                                        onClick={() => {
                                            this.editingRef.update();
                                            let newItem = {
                                                id: item.id,
                                                ...this.copy,
                                                dateUpdated: Date.now(),
                                                dateCreated: this.original.dateCreated,
                                            };
                                            adb.updateItem(currentCollection, newItem).then(
                                                (result) => {
                                                    const resultItem = JSON.parse(result);
                                                    let ind = collection.items.findIndex(
                                                        (colItem) => colItem.id === resultItem.id
                                                    );
                                                    collection.items[ind] = resultItem;
                                                    updateItem(resultItem);
                                                    let copy = structuredClone(resultItem);
                                                    delete copy["id"];
                                                    delete copy["dateUpdated"];
                                                    this.original = structuredClone(copy);
                                                    this.copy = structuredClone(copy);
                                                    this.editingJson = null;
                                                    this.editingId = null;
                                                    this.showVisualEditor = false;
                                                    this.showCodeEditor = false;
                                                }
                                            );
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="button"
                                        onClick={() => {
                                            this.copy = structuredClone(this.original);
                                            this.editingJson = null;
                                            this.editingId = null;
                                            this.showVisualEditor = false;
                                            this.showCodeEditor = false;
                                            this.editorHeight = editorHeight;
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="edit-json-buttons">
                        <button
                            className="button"
                            onClick={async () => {
                                await adb.addItem(currentCollection, this.props.placeholder);
                                await fetchItems();
                            }}
                        >
                            Clone
                        </button>
                        <button
                            className="button"
                            onClick={async () => {
                                let newObj = this.resetObject({ ...this.props.placeholder, ...{} });
                                await adb.addItem(currentCollection, newObj);
                                await fetchItems();
                            }}
                        >
                            Clone Empty
                        </button>
                        <button
                            className="button"
                            onClick={() => {
                                this.editingId = item.id;
                                this.copy = structuredClone(this.original);
                                this.showVisualEditor = true;
                            }}
                        >
                            Edit Visual
                        </button>
                        <button
                            className="button"
                            onClick={() => {
                                this.editingJson = {
                                    jsObject: this.copy,
                                };
                                this.editingId = item.id;
                                this.showCodeEditor = true;
                            }}
                        >
                            Edit Code Editor
                        </button>
                        <button className={"button deleteItem"} onClick={deleteItem}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    }

    refresh = () => {
        this.showVisualEditor = false;
        setTimeout(() => {
            this.showVisualEditor = true;
        }, 1);
    };

    resetObject = (obj) => {
        return iterateObjectUpdateVal(obj, (val) => {
            let valType = getType(val);
            if (valType === "string") {
                return "";
            } else if (valType === "number") {
                return 0;
            } else if (valType === "boolean") {
                return true;
            } else if (valType === "array") {
                return [];
            } else if (valType === "object") {
                return this.resetObject(val);
            }
        });
    };

    updateCopies = () => {
        let copy = structuredClone(iterateObject(this.props.placeholder));

        this.copy = copy;
        this.original = copy;
        delete this.copy["id"];
        delete this.original["id"];
    };
}
