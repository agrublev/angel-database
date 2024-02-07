import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import style from "react-syntax-highlighter/dist/cjs/styles/prism/duotone-light";

SyntaxHighlighter.registerLanguage("json", json);

@observer
export class HighlightEditor extends React.Component {
    @observable editing = false;
    @observable errorMessage;
    @observable errorLine;
    @observable errorText;

    render() {
        const { item, itemId, currentCollection, adb, itemIdUpdate } = this.props;
        return (
            <>
                {this.errorLine ? (
                    <div className={"errorMessage"}>
                        <span>Line:</span>
                        <code>{this.errorLine}</code>
                    </div>
                ) : (
                    <>
                        <div className={"errorMessage"}>{this.errorMessage}</div>
                        <div className={"errorMessage"}>{this.errorText}</div>
                    </>
                )}
                <div
                    className={"editorWrap"}
                    style={{
                        maxHeight: this.editing ? "70vh" : "220px",
                    }}
                    onFocus={(e) => {
                        this.editing = true;
                    }}
                    onBlur={(e) => {
                        let txt = e.target.innerText.replace(
                            /(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g,
                            '$1"$3":'
                        );
                        try {
                            JSON.parse(txt);
                            this.errorMessage = null;
                            this.errorText = null;
                            this.errorLine = null;
                        } catch (error) {
                            e.preventDefault();
                            this.errorMessage = error.toString();
                            let pos = parseInt(this.errorMessage.split("position ")[1]);
                            this.errorText = e.target.innerText.slice(pos - 5, pos + 5);
                            let errorLine = e.target.innerText.split("\n").filter((line, index) => {
                                return line.trim().includes(this.errorText.trim());
                            });
                            if (errorLine.length) {
                                this.errorLine = errorLine[0];
                            }

                            e.target.focus();
                            this.editRef.focus();
                            return false;
                        }
                        itemIdUpdate(JSON.parse(txt));

                        let newItem = {
                            id: item.id,
                            ...itemId,
                        };
                        adb.updateItem(currentCollection, newItem).then((result) => {
                            const resultItem = JSON.parse(result);
                            let ind = this.collection.items.findIndex(
                                (colItem) => colItem.id === resultItem.id
                            );
                            this.collection.items[ind] = resultItem;
                            this.editing = false;
                        });
                    }}
                    contentEditable={true}
                    suppressContentEditableWarning="true"
                    autoCorrect="false"
                    spellCheck="false"
                    ref={(ref) => (this.editRef = ref)}
                >
                    {this.editing ? (
                        <code className={"editorTemp"}>
                            <pre className={"editorTempPre"}>{JSON.stringify(itemId, null, 4)}</pre>
                        </code>
                    ) : (
                        <SyntaxHighlighter style={style} language={"javascript"}>
                            {JSON.stringify(itemId, null, 4)}
                        </SyntaxHighlighter>
                    )}
                </div>
            </>
        );
    }
}
