import { getRoot } from "mobx-state-tree";
import React from "react";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import "./CollectionsManage.less";
import AddCollection from "./AddCollection";

@observer
class CollectionsManageView extends React.Component {
    @observable showAddCollection;

    render() {
        const {
            adb,
            deleteCollection,
            currentCollection,
            updateCollections,
            updateCurrentCollection,
            collections,
        } = this.props;
        return (
            <>
                {this.showAddCollection && (
                    <AddCollection
                        close={() => {
                            this.showAddCollection = false;
                        }}
                        submitHandle={(inRef) => {
                            if (inRef.value.length > 0) {
                                adb.addCollection(inRef.value).then(async (collection) => {
                                    let newCollections = await adb.getCollections();
                                    updateCollections(newCollections, inRef.value);
                                    this.showAddCollection = false;
                                    inRef.value = "";
                                });
                            }
                        }}
                    />
                )}
                {collections.length !== 0 && (
                    <div className={"collectionsManage"}>
                        <div className={"collectionPicker"}>
                            <label>Collection</label>
                            <select
                                className={"collSelect"}
                                value={currentCollection}
                                onChange={(e) => {
                                    updateCurrentCollection(e.target.value);
                                }}
                            >
                                {collections.map((collection) => (
                                    <option key={collection}>{collection}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="button"
                            onClick={() => {
                                this.showAddCollection = !this.showAddCollection;
                            }}
                        >
                            +
                        </button>
                        <button
                            className="button"
                            onClick={() => {
                                deleteCollection(currentCollection);
                            }}
                        >
                            -
                        </button>
                    </div>
                )}
            </>
        );
    }
}
export default CollectionsManageView;
