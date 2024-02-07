import "setimmediate";
import { addDisposer, flow, getRoot, types as t } from "mobx-state-tree";
import Firebase from "../Firebase";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword
} from "firebase/auth";

const AuthStore = t
    .model("AuthStore", {
        currentUser: t.optional(t.union(t.string, t.literal(null)), null),
        currentUserData: t.frozen({}),
        addItemContent: `{ "key": "val" }`
    })
    .views(self => ({
        get isAuthenticated() {
            return self.currentUser !== null;
        },
        get getItemContent() {
            return JSON.parse(self.addItemContent);
        }
    }))
    .actions(self => ({
        afterCreate() {
            onAuthStateChanged(Firebase.auth, user => {
                if (user) {
                    const uid = user.uid;
                    self.setCurrentUser(uid, user);
                } else {
                    self.setCurrentUser(null);
                }
            });
        },
        /**
         * Logout baby
         * @return {Object} Promise
         */
        loginEmailPass: flow(function* loginEmailPass(email, password) {
            return new Promise((resolve, reject) => {
                signInWithEmailAndPassword(Firebase.auth, email, password)
                    .then(userCredential => {
                        resolve(userCredential.user);
                    })
                    .catch(error => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        reject(error);
                    });
            });
        }),
        logout: flow(function* logout() {
            yield signOut(Firebase.auth);
        }),
        /**
         * Sets the currentUser value
         * @param email
         * @param password
         */
        signup: flow(function* signup(email, password) {
            return new Promise((resolve, reject) => {
                createUserWithEmailAndPassword(Firebase.auth, email, password)
                    .then(userCredential => {
                        // Signed in
                        const user = userCredential.user;
                        resolve(user.uid);
                    })
                    .catch(error => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        reject(errorMessage);
                    });
            });
        }),
        setCurrentUser(uid, user) {
            self.currentUser = uid;
            self.currentUserData = uid === null ? null : user;
            if (uid !== null) {
                getRoot(self).databaseStore.loadDatabases();
            }
        },
        updateItemContent(newContent) {
            self.addItemContent = JSON.stringify(newContent);
        }
    }));

export default AuthStore;
