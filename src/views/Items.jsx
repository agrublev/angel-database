import { inject, observer } from "mobx-react";
import { Component } from "react";
import Item from "./Item";

@inject("store")
@observer
export default class Items extends Component {
    render() {
        return (
            <div className={"items"}>
                <h2 className={"itemHeader"}>Items</h2>
                <div>
                    {this.props.store.viewStore.items.map((item) => (
                        <Item key={item.uid} item={item} />
                    ))}
                </div>
            </div>
        );
    }
}
