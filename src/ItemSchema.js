import React from "react";
import { observable } from "mobx";
import { getType } from "./helpers";

const iterateObject = (obj, executeOnValue) => {
    Object.keys(obj).forEach((name) => {
        let val = obj[name];
        // if (typeof val === "object") {
        //     return iterateObject(val, executeOnValue);
        // } else
        if (val === undefined) {
            obj[name] = "";
        } else {
            obj[name] = executeOnValue(val);
        }
    });
};

export class ItemSchema extends React.Component {
    @observable showSchemaEditor = "";

    render() {
        let { collection, currentCollection } = this.props;
        return (
            <div className={`schemaObject ${this.showSchemaEditor ? "active" : ""}`}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        this.showSchemaEditor = !this.showSchemaEditor;
                    }}
                >
                    {this.showSchemaEditor ? "Hide " : "View "}Item Schema
                </button>
                <div className={"schemaInner"}>
                    <div
                        className={"schemaCode"}
                        suppressContentEditableWarning="true"
                        ref={(ref) => (this.schemaRef = ref)}
                        contentEditable={true}
                        autoCorrect="false"
                        spellCheck="false"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                // e.preventDefault();
                                // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
                                // document.execCommand(
                                //     "insertHTML",
                                //     false,
                                //     ""
                                // );
                                setTimeout(() => {
                                    let doc = this.schemaRef.ownerDocument.defaultView;
                                    let sel = doc.getSelection();
                                    let range = sel.getRangeAt(0);

                                    let tabNode = document.createTextNode(
                                        "\u00a0\u00a0\u00a0\u00a0"
                                    );
                                    range.insertNode(tabNode);

                                    range.setStartAfter(tabNode);
                                    range.setEndAfter(tabNode);
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                }, 1);
                                // prevent the default behaviour of return key pressed
                                // return false;
                            }
                            if (e.key === "Tab") {
                                e.preventDefault();
                                if (e.shiftKey) {
                                    return;
                                }
                                let doc = this.schemaRef.ownerDocument.defaultView;
                                let sel = doc.getSelection();
                                let range = sel.getRangeAt(0);

                                let tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
                                range.insertNode(tabNode);

                                range.setStartAfter(tabNode);
                                range.setEndAfter(tabNode);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }
                        }}
                        id={"editorFix"}
                    >
                        <code className={"editorTemp"}>
                            <pre>
                                {/*{JSON.stringify(*/}
                                {/*    this.props.store.authStore*/}
                                {/*        .getItemContent,*/}
                                {/*    null,*/}
                                {/*    4*/}
                                {/*)}*/}soon
                            </pre>
                        </code>
                    </div>
                    <button
                        onClick={async () => {
                            let html = this.schemaRef.innerHTML;
                            html = html
                                .replace(/\<pre\>/g, "")
                                .replace(/\<span(.*?)\>/g, "")
                                .replace(/\<br\>/g, "")
                                .replace(/\<\/pre\>/g, "")
                                .replace(/\<\/span\>/g, "")
                                .replace(/\<\/br\>/g, "")
                                .replace(`<code class="editorTemp">`, ``)
                                .replace(`</code>`, ``)
                                .replace(/\&nbsp\;/g, "");
                            html = html.replace(
                                /(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g,
                                '$1"$3":'
                            );
                            html = JSON.stringify(JSON.parse(html), null, 4);
                            this.schemaRef.innerHTML = `<code class="editorTemp"><pre>${html}</pre></code>`;

                            let code = this.schemaRef.innerText;
                            code = code.replace(
                                /(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g,
                                '$1"$3":'
                            );
                            let codeObj = JSON.parse(code);
                            let execOnVal = (e) => {
                                let type = getType(e);
                                if (type === "string") {
                                    return "";
                                }
                                if (type === "boolean") {
                                    return false;
                                }
                                if (type === "number") {
                                    return 0;
                                }
                                if (type === "function") {
                                    return () => {};
                                }
                                if (type === "object") {
                                    iterateObject(e, execOnVal);
                                    return e;
                                }
                                if (type === "array") {
                                    return [];
                                }
                            };
                            iterateObject(codeObj, execOnVal);
                            collection.meta.schema = JSON.parse(JSON.stringify(codeObj, null, 4));
                            adb.updateCollection(currentCollection, collection).then((e) => {
                                collection = JSON.parse(e);
                                // this.updateSchemaCode();
                                this.showSchemaEditor = false;
                            });
                        }}
                        className={"schemaUpdateButton"}
                    >
                        Update Schema
                    </button>
                </div>
            </div>
        );
    }
}
