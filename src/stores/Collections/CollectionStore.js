import { addDisposer, getRoot, types as t } from "mobx-state-tree";
import CollectionModel from "./CollectionModel";
import { addDoc, collection, deleteDoc, doc, getFirestore, query, where } from "firebase/firestore";

const Model = {
    collections: t.array(CollectionModel),
    currentCollection: t.optional(t.union(t.safeReference(CollectionModel), t.literal(null)), null)
};

const Views = self => ({
    get collectionList() {
        return self.collections.slice();
    }
});

const Actions = self => ({
    loadCollections() {
        return new Promise(resolve => {
            // const handleAdd = (data, isInitial) => {
            //     self.crudAdd(data);
            //     // addMissingChatUsers(data);
            //     // !isInitial && subscribeToChatUsers(data.collectionUserIds);
            // };
            // const disposer = firebaseListen(
            //     query(
            //         collection(getFirestore(), "collections"),
            //         where(
            //             "collectionUserIds",
            //             "array-contains",
            //             getRoot(self).authStore.currentUser.uid
            //         )
            //     ),
            //     {
            //         onAdd: handleAdd,
            //         onUpdate: handleAdd,
            //         onDelete: id => {
            //             // emitEvent("collection_DELETED", id);
            //             self.crudDelete(id);
            //         },
            //         onDone: () => {
            //             resolve();
            //         }
            //     }
            // );
            // addDisposer(self, disposer);
        });
    },
    crudAdd: data => {
        let convIndex = self.collections.findIndex(e => e.uid === data.uid);
        if (convIndex !== -1) {
            self.collections[convIndex].updateItemData(data);
        } else {
            self.collections.push(data);
        }
    },
    addCollection: data => {
        addDoc(collection(Firebase.firestore, "collections"), data)
            .then(e => {
                // console.info("Console --- Suuc", e);
                // self.addItem(e.id, data);
            })
            .catch(e => {
                console.error("Console --- ERR", e);
            });
    },
    setCollection: uid => {
        self.currentCollection = uid;
    },
    deleteCollection: uid => {
        deleteDoc(doc(Firebase.firestore, "collections", uid))
            .then(e => {
                console.info("Console --- Suuc", e);
                // self.addItem(e.id, data);
            })
            .catch(e => {
                console.info("Console --- ERR", e);
            });
    },
    addItem(uid, data) {
        self.collections.push({ uid, ...data });
    },
    crudDelete(uid) {
        const index = self["collections"].findIndex(e => e["uid"] === uid);
        if (index !== -1) {
            self["collections"].splice(index, 1);
        }
    }
});

const CollectionStore = t
    .model("CollectionStore", Model)
    .views(Views)
    .actions(Actions);

export default CollectionStore;
