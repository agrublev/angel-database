import DatabaseModel from "./DatabaseModel";
import { addDisposer, getRoot, types as t } from "mobx-state-tree";
import {
    addDoc,
    collection,
    onSnapshot,
    deleteDoc,
    doc,
    getFirestore,
    query,
    where
} from "firebase/firestore";

const toKebabCase = str =>
    str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join("-");

const Model = {
    databases: t.array(DatabaseModel),
    currentDatabase: t.optional(t.union(t.safeReference(DatabaseModel), t.literal(null)), null)
};

const Views = self => ({
    get collectionList() {
        return self.databases.slice();
    }
});

const Actions = self => ({
    checkSaved() {
        let currentDb = localStorage.getItem("currentDatabase");
        if (currentDb) {
            self.setDatabase(currentDb);
        }
    },
    loadDatabases() {
        const disposer = onSnapshot(
            query(
                collection(Firebase.firestore, "databases"),
                where("createdById", "==", getRoot(self).authStore.currentUser)
            ),
            snapshot => {
                snapshot.docChanges().forEach(change => {
                    switch (change.type) {
                        case "added":
                            self.crudAdd({ uid: change.doc.id, ...change.doc.data() });
                            break;
                        case "modified":
                            self.crudAdd({ uid: change.doc.id, ...change.doc.data() });
                            break;
                        case "removed":
                            self.crudDelete(change.doc.id);
                            break;
                    }
                });
                self.checkSaved();
            }
        );
        addDisposer(self, disposer);
    },

    addDatabase: data => {
        return new Promise((resolve, reject) => {
            data.slug = toKebabCase(data.name);
            addDoc(collection(Firebase.firestore, "databases"), data)
                .then(e => {
                    resolve();
                    // self.addItem(e.id, data);
                })
                .catch(e => {
                    reject(e);
                });
        });
    },
    setDatabase: uid => {
        self.currentDatabase = uid;
        if (uid !== null) {
            localStorage.setItem("currentDatabase", uid);
        } else {
            localStorage.removeItem("currentDatabase");
        }
    },
    deleteDatabase: uid => {
        deleteDoc(doc(Firebase.firestore, "databases", uid))
            .then(e => {
                console.info("Console --- Suuc", e);
            })
            .catch(e => {
                console.info("Console --- ERR", e);
            });
    },
    addItem(uid, data) {
        self.databases.push({ uid, ...data });
    },
    crudAdd: data => {
        let convIndex = self.databases.findIndex(e => e.uid === data.uid);
        if (convIndex !== -1) {
            self.databases[convIndex].updateItemData(data);
        } else {
            self.databases.push(data);
        }
    },
    crudDelete(uid) {
        const index = self["databases"].findIndex(e => e["uid"] === uid);
        if (index !== -1) {
            self["databases"].splice(index, 1);
        }
    }
});

const DatabaseStore = t
    .model("DatabaseStore", Model)
    .views(Views)
    .actions(Actions);

export default DatabaseStore;
