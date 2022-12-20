import { getRoot, types as t, flow, addDisposer } from "mobx-state-tree";
import ItemModel from "./ItemModel.js";
import db from "../database/init";
import { toJS } from "mobx";

const UUIDGeneratorBrowser = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );

const ViewStore = t
    .model("ViewStore", {
        items: t.optional(t.array(ItemModel), []),
        isLoading: true,
        currentItem: t.optional(t.union(t.safeReference(ItemModel), t.literal(null)), null),
    })
    .views((self) => ({
        get itemList() {
            return self.items
                .slice()
                .sort((a, b) => (a.createdTimestamp < b.createdTimestamp ? 1 : -1));
        },
    }))
    .actions((self) => ({
        afterCreate() {
            self.fetchItems();
        },
        subscribeToItems: flow(function* subscribeToItems() {
            return db.getItem();
        }),
        fetchItems() {
            self.subscribeToItems().then(({ items }) => {
                items.map((item) => {
                    self.updateItem(item);
                });
                // self.setCurrentItem(self.items[0].uid);
            });
        },
        ajaxAddItem(data) {
            let extend = {
                uid: UUIDGeneratorBrowser(),
                createdTimestamp: Date.now(),
            };
            let addData = { ...data, ...extend };
            Object.keys(addData).map((e) => {
                if (addData[e] === undefined) {
                    delete addData[e];
                }
            });

            return new Promise((r) => {
                db.updateItem({ items: [addData] }).then(() => {
                    // self.addItem(addData);
                    r();
                });
            });
        },
        ajaxDeleteItem(uid) {
            let ind = self.items.findIndex((e) => e.uid === uid);
            if (ind !== -1) {
                self.deleteItem(uid);
            }
            db.setItem({ items: toJS(self.items) }).then(() => {
                self.fetchItems();
            });
        },
        addItem(data) {
            const extend = {
                createdTimestamp: Date.now(),
            };
            const addData = { ...data, ...extend };
            Object.keys(addData).map((e) => {
                if (addData[e] === undefined) {
                    delete addData[e];
                }
            });
            return self.items.push(addData);
        },
        updateItem(data) {
            let ind = self.items.findIndex((e) => e.uid === data.uid);
            if (ind !== -1) {
                self.items[ind].updateItem(data);
            } else {
                self.addItem(data);
            }
        },
        deleteItem(uid) {
            const inx = self.items.findIndex((e) => e.uid === uid);
            if (inx !== -1) {
                self.items.splice(inx, 1);
            }
        },
        getItemById(uid) {
            const itemIndex = self.items.findIndex((e) => e.uid === uid);
            return itemIndex === -1 ? null : self.items[itemIndex];
        },

        setCurrentItem(uid) {
            if (self.currentItem !== null && uid === self.currentItem.uid) return -1;
            if (self.currentItem !== null && uid === null) self.currentItem.setLoaded(false);
            self.currentItem = uid === null ? null : self.getItemById(uid);
            if (self.currentItem !== null) {
                return self.currentItem;
            } else {
                self.currentItem = null;
                return -1;
            }
        },
    }));

export default ViewStore;
