import { Component } from "react";
import { inject, observer } from "mobx-react";
import { observable } from "mobx";

@inject("store")
@observer
class Item extends Component {
    @observable showEdit = false;

    render() {
        const { item } = this.props;
        return (
            <div className={"item"}>
                <h3>{item.name}</h3>
                {this.showEdit ? (
                    <form
                        className={"updateItem"}
                        onSubmit={(e) => {
                            e.preventDefault();
                            this.props.store.viewStore
                                .ajaxUpdateItem({ ...item, name: this.nameRef.value })
                                .then(() => {
                                    this.toggleEdit();
                                });
                        }}
                    >
                        <input
                            placeholder={"Update name"}
                            type={"text"}
                            autoFocus={true}
                            defaultValue={item.name}
                            ref={(ref) => (this.nameRef = ref)}
                        />
                        <button type={"submit"}>Update</button>
                        <button
                            type={"button"}
                            onClick={(e) => {
                                this.toggleEdit();
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <div>
                        <button
                            onClick={() => {
                                this.toggleEdit();
                            }}
                        >
                            Edit
                        </button>
                    </div>
                )}
                <button
                    onClick={(e) => {
                        item.delete();
                    }}
                >
                    X
                </button>
            </div>
        );
    }
    toggleEdit = (boo = null) => {
        this.showEdit = boo !== null ? boo : !this.showEdit;
        // TODO FIGURE OUT WHY IT NEEDS THIS!!
        this.forceUpdate();
    };
}

export default Item;
