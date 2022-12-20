export default class Database {
    constructor({ orgId, itemId, apiKey = null }) {
        this.orgId = orgId;
        this.itemId = itemId;
        this.apiKey = apiKey;
    }

    /**
     * Get Item
     * @returns {Promise<unknown>}
     */
    getItem = async () => {
        const apiKeyQuery = this.apiKey !== null ? `?apiKey=${this.apiKey}` : "";

        return new Promise((r, e) => {
            fetch(`https://api.jsonstorage.net/v1/json/${this.orgId}/${this.itemId}${apiKeyQuery}`)
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    }

                    throw new Error("Can't get item. Something went wrong.");
                })
                .then((responseData) => {
                    r(JSON.parse(responseData));
                })
                .catch((error) => {
                    e(error);
                });
        });
    };

    /**
     * Set item entirely
     * @param data json
     * @returns {Promise<unknown>}
     */
    setItem = async (data) => {
        const apiKeyQuery = this.apiKey !== null ? `?apiKey=${this.apiKey}` : "";
        return new Promise((r, e) => {
            fetch(
                `https://api.jsonstorage.net/v1/json/${this.orgId}/${this.itemId}${apiKeyQuery}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            )
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    }

                    throw new Error("Can't get item. Something went wrong.");
                })
                .then((responseData) => {
                    r(responseData);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };

    /**
     * Update item (only what you pass)
     * @param data json
     * @returns {Promise<unknown>}
     */
    updateItem = async (data) => {
        const apiKeyQuery = this.apiKey !== null ? `?apiKey=${this.apiKey}` : "";
        return new Promise((r, e) => {
            fetch(
                `https://api.jsonstorage.net/v1/json/${this.orgId}/${this.itemId}${apiKeyQuery}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            )
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    }

                    throw new Error("Can't get item. Something went wrong.");
                })
                .then((responseData) => {
                    r(responseData);
                })
                .catch((error) => {
                    e(error);
                });
        });
    };
}
