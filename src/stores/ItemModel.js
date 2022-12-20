import { getRoot, onSnapshot, types as t, flow } from "mobx-state-tree";

const ItemModel = t
  .model("ItemModel", {
    uid: t.optional(t.identifier, ""),
    createdTimestamp: t.optional(t.number, Date.now()),
    name: t.maybe(t.string),
  })
  .views((self) => ({}))
  .actions((self) => ({
    updateItem({ name }) {
      self = Object.assign(self, { name });
    },
    delete() {
      getRoot(self).viewStore.ajaxDeleteItem(self.uid);
    },
  }));

export default ItemModel;
