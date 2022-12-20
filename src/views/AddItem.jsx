import { inject, observer } from "mobx-react";
import { Component } from "react";

@inject("store")
@observer
export default class AddItem extends Component {
    render() {
        return (
            <div className={"addItem"}>
                <div className={"addItem"}>
                    <h3>Add Item</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (this.nameRef.value.length > 0) {
                                this.props.store.viewStore
                                    .ajaxAddItem({ name: this.nameRef.value })
                                    .then((r) => {
                                        this.props.store.viewStore.fetchItems();
                                        this.nameRef.value = "";
                                    });
                            } else {
                                alert("Can't be empty");
                            }
                        }}
                    >
                        <input
                            placeholder={"Item name"}
                            type={"text"}
                            ref={(ref) => (this.nameRef = ref)}
                        />
                        <button type={"submit"}>Add</button>
                    </form>
                </div>
            </div>
        );
    }
}
