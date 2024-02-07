import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserSessionPersistence, setPersistence } from "firebase/auth";

// require("firebase/messaging");
// require("firebase/auth");

const Firebase = {};
const conf = {
    apiKey: "AIzaSyCRbJfBIjR51lCvb3KN7N_qPrQ4-IAfdS4",
    authDomain: "angel-crud-app.firebaseapp.com",
    projectId: "angel-crud-app",
    storageBucket: "angel-crud-app.appspot.com",
    messagingSenderId: "934745625145",
    appId: "1:934745625145:web:0beb727050657f88a533e8"
};

Firebase.init = () => {
    const app = initializeApp(conf);
    // Initialize Cloud Firestore and get a reference to the service
    Firebase.firestore = getFirestore(app);
    Firebase.firebase = app;
    Firebase.auth = getAuth(app);
    setPersistence(Firebase.auth, browserSessionPersistence);

    // Firebase.firestore.settings({
    //     cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    // });
    // Firebase.firestore.enablePersistence();
    // Firebase.auth = firebase.auth();
    // Firebase.messaging = firebase.messaging();
    // Firebase.messaging.usePublicVapidKey(
    //     "BJAy-C3QvZulKW-Z4RTi5H7I0NvmtlxfexPNb-JTLF8z9tQdAOgyLXT8qICax9gagOK5hHFhCFqEVVx9nYs0wiM"
    // );
    // Firebase.messaging
    //     .getToken({
    //         vapidKey:
    //             "BJAy-C3QvZulKW-Z4RTi5H7I0NvmtlxfexPNb-JTLF8z9tQdAOgyLXT8qICax9gagOK5hHFhCFqEVVx9nYs0wiM"
    //     })
    //     .then(function(currentToken) {
    //         // window.localStorage.setItem("push-token", currentToken);
    //     })
    //     .catch(function(err) {});
    window.Firebase = Firebase;
};

Firebase.setOnline = (uid, boo = true, updateFirestore = false, updateDatabase = true) => {
    if (updateDatabase) {
        Firebase.database.ref(`/users/${uid}`).set({
            isOnline: boo,
            modified: Date.now()
        });
    }
    if (updateFirestore) {
        Firebase.firestore.doc(`/users/${uid}`).update({
            isOnline: boo,
            lastUpdated: Date.now()
        });
    }
};

Firebase.presence = uid => {
    Firebase.database
        .ref(`/users/${uid}`)
        .once("value")
        .then(function(hasDb) {
            if (hasDb.val()) {
                if (!hasDb.val().isOnline) {
                    Firebase.setOnline(uid, true);
                }
            } else {
                Firebase.setOnline(uid, true);
            }
        });

    Firebase.database.ref(".info/connected").on("value", connected => {
        if (connected.val() === false) {
            Firebase.setOnline(uid, false, true, false);
            return;
        }

        Firebase.database
            .ref(`/users/${uid}`)
            .onDisconnect()
            .set({
                isOnline: false,
                modified: Date.now()
            })
            .then(() => {
                Firebase.setOnline(uid, true, true, false);
            });
    });
};

export default Firebase;
