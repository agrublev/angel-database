/* eslint-disable complexity */
/* eslint-disable max-statements */
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { hot } from "react-hot-loader";
import AD from "./ADB.js";
import AddCollection from "./AddCollection";
import AddCollectionItem from "./AddCollectionItem";
import AddDatabase from "./AddDatabase";
import "./App.less";
import CollectionsManageView from "./CollectionsManageView";
import { DatabaseManageView } from "./DatabasePicker";
import { iterateObject } from "./helpers";
import { ListItem } from "./ListItemView";
import { SortBy } from "./SortBy";

const adb = new AD();

@observer
class ManageView extends React.Component {
    @observable currentDatabase = localStorage.getItem("currentDatabase");
    @observable sortBy =
        localStorage.getItem("sortBy") === null ? "dateUpdated" : localStorage.getItem("sortBy");
    @observable sortByDirection =
        localStorage.getItem("sortByDirection") === null
            ? false
            : localStorage.getItem("sortByDirection") === "true";
    @observable collection;
    @observable collections = [];
    @observable databases = [];
    @observable validate = false;
    @observable currentCollection =
        localStorage.getItem("currentCollection") === null
            ? ""
            : localStorage.getItem("currentCollection");
    @observable showAdd = false;
    @observable showAddCollection = false;
    @observable showAddDatabase = false;

    async componentDidMount() {
        const DBS = await adb.getDatabases("FREEDCAMP");
        this.databases = DBS.map(e => e.split("-data")[0]);
        console.log("!!!!", this.currentDatabase, this.databases);
        if (this.currentDatabase === null && this.databases.length === 0) {
            this.showAddDatabase = true;
        } else {
            if (this.currentDatabase === null && this.databases.length > 0) {
                this.currentDatabase = this.databases[0];
            }
            await adb.init(this.currentDatabase);
            await this.showCollections(this.currentDatabase);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.collections.length === 0 &&
            this.databases.length !== 0 &&
            this.currentDatabase !== null
        ) {
            this.showAddCollection = true;
        } else {
            this.showAddCollection = false;
        }
    }

    render() {
        return (
            <div className="App">
                <div className="app-header">
                    {this.currentDatabase && (
                        <DatabaseManageView
                            value={this.currentDatabase}
                            onChange={async e => {
                                this.currentDatabase = null;
                                let newDatabase = e.target.value;
                                await this.setCurrentDatabase(newDatabase);
                            }}
                            databases={this.databases}
                            onClick={() => (this.showAddDatabase = !this.showAddDatabase)}
                            onDeleteClick={async () => {
                                await adb.deleteDatabase(this.currentDatabase);
                                let inx = this.databases.findIndex(e => e === this.currentDatabase);
                                this.databases.splice(inx, 1);
                                await this.setCurrentDatabase(null);
                            }}
                        />
                    )}
                    {this.currentDatabase && (
                        <CollectionsManageView
                            adb={adb}
                            collections={this.collections}
                            currentCollection={this.currentCollection}
                            updateCollections={async (collections, collection) => {
                                this.collections = collections;
                                await this.setCurrentCollection(collection);
                            }}
                            deleteCollection={async collection => {
                                adb.deleteCollection(collection).then(async () => {
                                    let inx = this.collections.findIndex(c => c === collection);
                                    this.collections.splice(inx, 1);
                                    await this.setCurrentCollection(null);
                                });
                            }}
                            updateCurrentCollection={async collection => {
                                await this.setCurrentCollection(collection);
                            }}
                        />
                    )}
                    <div className="secondary-bar">
                        {this.collections.length !== 0 && (
                            <button
                                className="button add-item-b"
                                onClick={() => (this.showAdd = !this.showAdd)}
                            >
                                ADD ITEM
                            </button>
                        )}
                        {/*<ItemSchema collection={this.collection} currentCollection={this.currentCollection} showSchemaEditor={this.showSchemaEditor} />*/}
                        <SortBy
                            sortBy={this.sortBy}
                            sortByDirection={this.sortByDirection}
                            sortedItems={({ sortBy, sortByDirection }) => {
                                this.sortBy = sortBy;
                                this.sortByDirection = sortByDirection;
                                localStorage.setItem("sortBy", sortBy);
                                localStorage.setItem("sortByDirection", sortByDirection);
                            }}
                        />
                    </div>
                </div>
                {this.showAdd && (
                    <AddCollectionItem
                        adb={adb}
                        fetchItems={this.fetchItems}
                        currentCollection={this.currentCollection}
                        toggleAddItem={(boo = null) => {
                            this.showAdd = boo !== null ? boo : !this.showAdd;
                        }}
                    />
                )}
                <div className={"app-main"}>
                    {this.collection && this.collection.items && (
                        <div className={"items-and-schema"}>
                            {this.collection.items
                                .slice()
                                // .reverse()
                                .sort((a, b) => {
                                    if (this.sortByDirection) {
                                        return a[this.sortBy] - b[this.sortBy];
                                    } else {
                                        return b[this.sortBy] - a[this.sortBy];
                                    }
                                })
                                .map((item, i) => {
                                    let itemId = structuredClone(iterateObject(item));
                                    delete itemId["id"];
                                    delete itemId["dateCreated"];
                                    delete itemId["dateUpdated"];

                                    return (
                                        <ListItem
                                            key={item.id}
                                            varList={{
                                                adb,
                                                item,
                                                itemId,
                                                fetchItems: this.fetchItems,
                                                currentCollection: this.currentCollection,
                                                collection: this.collection
                                            }}
                                            updateItem={newData => {
                                                item = newData;
                                            }}
                                            deleteItem={async () => {
                                                await adb.deleteItem(
                                                    this.currentCollection,
                                                    item.id
                                                );
                                                await this.fetchItems();
                                            }}
                                        />
                                    );
                                })}
                        </div>
                    )}
                </div>
                <div>
                    {this.showAddDatabase && (
                        <AddDatabase
                            close={() => {
                                this.showAddDatabase = false;
                            }}
                            submitHandle={inRef => {
                                if (inRef.value.length > 0) {
                                    adb.addDatabase(inRef.value).then(async () => {
                                        let val = inRef.value;
                                        inRef.value = "";
                                        if (this.databases.findIndex(d => d === val) === -1) {
                                            this.databases.push(val);
                                            await this.setCurrentDatabase(val);
                                            this.collection = { items: [] };
                                        }
                                        this.showAddDatabase = false;
                                    });
                                }
                            }}
                        />
                    )}
                    {this.showAddCollection && (
                        <AddCollection
                            close={() => {
                                this.showAddCollection = false;
                            }}
                            submitHandle={inRef => {
                                if (inRef.value.length > 0) {
                                    adb.addCollection(inRef.value).then(async collection => {
                                        this.showAddCollection = false;
                                        await this.setCurrentCollection(inRef.value);
                                        inRef.value = "";
                                    });
                                }
                            }}
                        />
                    )}
                </div>
                {/*{this.showSchema ? <Schema /> : null}*/}
            </div>
        );
    }

    fetchItems = async () => {
        // this.collection = {};
        await adb
            .getItems(this.currentCollection)
            .then(col => {
                if (!col) {
                    this.collection = { items: [] };
                    return;
                }
                this.collection = col;
            })
            .catch(e => {
                console.log("--- INFO ---", e);
            });
    };
    async showCollections(key) {
        if (this.databases.length === 0) {
            this.currentDatabase = null;
            localStorage.removeItem("currentDatabase");
            this.showAddDatabase = true;
            return;
        }

        this.collections = await adb.getCollections(key);
        if (this.collections.length > 0 && this.currentCollection === "") {
            this.currentCollection = this.collections[0];
            localStorage.setItem("currentCollection", this.currentCollection);
        }
        if (this.currentCollection === "") {
            this.currentCollection = this.collections[0];
        }
        if (this.collections.findIndex(c => c === this.currentCollection) === -1) {
            this.currentCollection = this.collections[0];
            localStorage.setItem("currentCollection", this.currentCollection);
        }

        await this.fetchItems();
    }

    setCurrentDatabase = async database => {
        let db;
        if (database === null) {
            this.collection = { items: [] };
            if (this.databases[0]) {
                db = this.databases[0];
            } else {
                db = null;
            }
        } else {
            db = database;
        }
        this.currentDatabase = db;
        if (db === null) {
            localStorage.removeItem("currentDatabase");
        } else {
            localStorage.setItem("currentDatabase", this.currentDatabase);
        }

        await this.showCollections(this.currentDatabase);
    };
    setCurrentCollection = async collection => {
        let col;
        if (collection === null) {
            this.collection = { items: [] };
            if (this.collections[0]) {
                col = this.collections[0];
            } else {
                col = null;
            }
        } else {
            col = collection;
        }
        this.currentCollection = col;
        if (col === null) {
            localStorage.removeItem("currentCollection");
        } else {
            localStorage.setItem("currentCollection", this.currentCollection);
        }

        await this.showCollections(this.currentDatabase);
    };
}

export default hot(module)(ManageView);
