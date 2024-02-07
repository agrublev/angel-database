import { getRoot, types as t } from "mobx-state-tree";

const Model = {
    uid: t.optional(t.identifier, ""),
    name: t.maybe(t.string),
    slug: t.maybe(t.string),
    createdById: t.maybe(t.string)
};

const Views = self => ({});

const Actions = self => ({
    beforeDestroy() {
        // destroyMessageStores(self);
    },
    delete() {
        getRoot(self).databaseStore.deleteDatabase(self.uid);
    },
    updateItemData(data) {
        Object.entries(data).map(([key, value]) => {
            self[key] = value;
        });
    }
});

const DatabaseModel = t
    .model("DatabaseModel", Model)
    .views(Views)
    .actions(Actions);

export default DatabaseModel;
