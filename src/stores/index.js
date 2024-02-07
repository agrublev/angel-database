import { destroy, types as t } from "mobx-state-tree";
import AuthStore from "./AuthStore";
import CollectionStore from "./Collections/CollectionStore";
import DatabaseStore from "./Collections/DatabaseStore";

const Store = t
    .model("ChatStore", {
        version: "noVerDev",
        collectionStore: t.optional(CollectionStore, {
            collections: []
        }),
        databaseStore: t.optional(DatabaseStore, {
            databases: []
        }),
        authStore: t.optional(AuthStore, { currentUser: "" })
    })
    .views(self => ({}))
    .actions(self => ({
        afterCreate() {}
    }));

export default Store;
