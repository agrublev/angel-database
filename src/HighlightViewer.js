import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import style from "react-syntax-highlighter/dist/cjs/styles/prism/duotone-light";

SyntaxHighlighter.registerLanguage("json", json);

@observer
export class HighlightViewer extends React.Component {
    @observable fullScreen = false;

    render() {
        const { item, itemId } = this.props;
        return (
            <div className={`editor-wrap ${this.fullScreen ? "fullscreen" : ""}`}>
                <div
                    className={`editor-viewer`}
                    style={{
                        maxHeight: this.editing ? "70vh" : "220px",
                    }}
                    suppressContentEditableWarning="true"
                    contentEditable={false}
                    autoCorrect="false"
                    spellCheck="false"
                    ref={(ref) => (this.editRef = ref)}
                >
                    <SyntaxHighlighter style={style} language={"javascript"}>
                        {JSON.stringify(itemId, null, 4)}
                    </SyntaxHighlighter>
                </div>
                <button
                    className={"viewerFullScreen"}
                    onClick={() => {
                        this.fullScreen = !this.fullScreen;
                    }}
                >
                    {this.fullScreen ? (
                        <svg
                            height="32"
                            width="32"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g
                                fill="#0c7db9"
                                stroke="#0c7db9"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                                transform="translate(0.5 0.5)"
                            >
                                <line
                                    fill="none"
                                    strokeLinecap="butt"
                                    x1="6"
                                    x2="15"
                                    y1="24"
                                    y2="15"
                                />
                                <line fill="none" stroke="#0c7db9" x1="1" x2="31" y1="8" y2="8" />
                                <rect
                                    height="26"
                                    width="30"
                                    fill="none"
                                    stroke="#0c7db9"
                                    x="1"
                                    y="3"
                                />
                                <polyline fill="none" points=" 14,24 6,24 6,16 " />
                            </g>
                        </svg>
                    ) : (
                        <svg
                            height="32"
                            width="32"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g
                                fill="#0c7db9"
                                stroke="#0c7db9"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                                transform="translate(0.5 0.5)"
                            >
                                <rect
                                    height="26"
                                    width="30"
                                    fill="none"
                                    stroke="#0c7db9"
                                    x="1"
                                    y="3"
                                />
                                <polyline fill="none" points="5 19 5 25 11 25" />
                                <polyline fill="none" points="21 7 27 7 27 13" />
                            </g>
                        </svg>
                    )}
                </button>
            </div>
        );
    }
}
