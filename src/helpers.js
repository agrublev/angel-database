import { toJS } from "mobx";

export const getType = (v) =>
    v === undefined ? "undefined" : v === null ? "null" : v.constructor.name.toLowerCase();

export const iterateObject = (obj) => {
    obj = toJS(obj);
    Object.keys(obj).forEach((name) => {
        let val = toJS(obj[name]);
        if (getType(val) === "object") {
            obj[name] = iterateObject(val);
        } else if (getType(val) === "array") {
            obj[name] = val.map((item) => {
                if (getType(item) === "object") {
                    return iterateObject(toJS(item));
                } else {
                    return item;
                }
            });
        } else if (val === undefined) {
            obj[name] = "";
        } else {
            obj[name] = val;
        }
    });
    return obj;
};

export const iterateObjectUpdateVal = (obj, updateVal) => {
    obj = toJS(obj);
    Object.keys(obj).forEach((name) => {
        let val = toJS(obj[name]);
        if (getType(val) === "object") {
            obj[name] = iterateObjectUpdateVal(val, updateVal);
        } else if (val === undefined) {
            obj[name] = "";
        } else {
            obj[name] = updateVal(val);
        }
    });
    return obj;
};
