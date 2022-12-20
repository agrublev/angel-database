import { onSnapshot, types as t } from "mobx-state-tree";
import ViewStore from "./ViewStore";
const storeKey = "store";
const RootModel = t
    .model({
        user: t.string, //!!localStorage.getItem("name") ? localStorage.getItem("name") : "",
        users: t.frozen([
            { name: "A", uid: "1" },
            { name: "b", uid: "2" },
        ]),
        viewStore: t.optional(ViewStore, {}),
    })
    .views((self) => ({}))
    .actions((self) => ({
        afterCreate() {},
        setName(name) {
            if (name !== "") {
                self.user = name;
                // localStorage.setItem("name", name);
            } else {
                self.user = "";
                // localStorage.removeItem("name");
            }
        },
    }));

let initialState = RootModel.create({
    user: "",
    users: [
        { name: "A", uid: "1" },
        { name: "b", uid: "2" },
    ],
});

// const data = localStorage.getItem(storeKey);
// if (data) {
//     const json = JSON.parse(data);
//     if (RootModel.is(json)) {
//         initialState = RootModel.create(json);
//     }
// }

export const rootStore = initialState;

// onSnapshot(rootStore, (snapshot) => {
//     localStorage.setItem(storeKey, JSON.stringify(snapshot));
// });
