import { getRoot, onSnapshot, types as t, flow } from "mobx-state-tree";

const ItemModel = t
    .model("ItemModel", {
        uid: t.optional(t.identifier, ""),
        createdTimestamp: t.optional(t.number, Date.now()),
        name: t.maybe(t.string),
    })
    .views((self) => ({}))
    .actions((self) => ({
        extendItem({ name }) {
            self = Object.assign(self, { name });
            return self;
        },
        delete() {
            getRoot(self).viewStore.ajaxDeleteItem(self.uid);
        },
    }));

export default ItemModel;
