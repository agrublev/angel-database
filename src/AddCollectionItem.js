import React from "react";
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

@observer
class AddCollectionItem extends React.Component {
    @observable data = { key: "val" };

    render() {
        const { adb, fetchItems, toggleAddItem, currentCollection } = this.props;
        return (
            <form
                className={"add-item"}
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <JSONInput
                    placeholder={this.data}
                    locale={locale}
                    height="150px"
                    onChange={(all) => {
                        this.data = all.jsObject;
                        // authStore.updateItemContent(all.jsObject);
                    }}
                    setCursorPosition={6}
                    onKeyPressUpdate={false}
                    ref={(ref) => {
                        if (ref) {
                            this.addingRef = ref;
                        }
                    }}
                    onBlur={() => {
                        this.addingRef.update();
                    }}
                />
                <div className={"add-item-footer"}>
                    <button
                        className="button"
                        onClick={async () => {
                            await adb.addItem(currentCollection, this.data);
                            await fetchItems();
                            toggleAddItem(false);
                        }}
                    >
                        ADD
                    </button>
                    <button
                        className="button"
                        onClick={async () => {
                            toggleAddItem(false);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    }
}

export default AddCollectionItem;
