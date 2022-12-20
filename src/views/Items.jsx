import { inject, observer } from "mobx-react";
import { Component } from "react";

@inject("store")
@observer
export default class Items extends Component {
    render() {
        return (
            <div className={"items"}>
                <h3>Items</h3>
                <div>
                    {this.props.store.viewStore.items.map((item) => (
                        <div key={item.uid} className={"item"}>
                            {item.name}
                            <button
                                onClick={(e) => {
                                    item.delete();
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
