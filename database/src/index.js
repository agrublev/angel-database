export default class ADB {
    constructor(host =
                    "https://taskio.online"
                    // "http://localhost:5000"
    ) {
        this.host = host;
        return this;
    }

    /**
     * Returns the array of collection names
     * @returns {Promise<unknown>}
     */
    init = (key) => {
        this.key = key;
        fetch(`${this.host}/keyFile?key=${this.key}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => response.json())

            .catch((error) => {
                console.warn(error);
            });
    };

    /**
     * Returns the array of collection names
     * @returns {Promise<unknown>}
     */
    getDatabases = (password) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/databases?password=${password}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((databases) => {
                    r(databases);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };

    /**
     * Returns the array of collection names
     * @returns {Promise<unknown>}
     */
    getCollections = (db = null) => {
        return new Promise((r, e) => {
            let database = db !== null ? db : this.key;
            this.key = database;
            fetch(`${this.host}/collections?key=${database}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then(({ collections }) => {
                    r(collections);
                })
                .catch((error) => {
                    console.warn("ERROR", error);
                    e(error);
                });
        });
    };

    addCollection = (collection) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/addCollection/${collection}?key=${this.key}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    r(data);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };

    addDatabase = (database) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/addDatabase/${database}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    r(data);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };
    updateCollection = (collection, data) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/updateCollection/${collection}?key=${this.key}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((data) => {
                    r(data);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };
    deleteCollection = (collection, id) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/deleteCollection/${collection}?key=${this.key}`, {
                method: "GET", // or 'PUT'
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    r(data);
                })
                .catch((error) => {
                    console.error(error);
                    e(error);
                });
        });
    };

    getItems = (collection) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/collection/${collection}?key=${this.key}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                response
                    .json()
                    .then((text) => {
                        r(text);
                    })
                    .catch((error) => {
                        e(error);
                    });
            });
        });
    };

    addItem = (collection, data) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/add/${collection}?key=${this.key}`, {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...data,
                    ...{ dateCreated: Date.now(), dateUpdated: Date.now() }
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    r(data);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };

    updateItem = (collection, data) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/update/${collection}?key=${this.key}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...data,
                    ...{ dateUpdated: Date.now() }
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    r(data);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };

    deleteItem = (collection, id) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/delete/${collection}?key=${this.key}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            })
                .then((response) => response.json())
                .then((data) => {
                    r(data);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };
    deleteDatabase = (database) => {
        return new Promise((r, e) => {
            fetch(`${this.host}/deleteDatabase/${database}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    r(data);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };
}
