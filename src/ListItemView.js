import moment from "moment/moment";
import React from "react";
import EditJson from "./EditJson";
import { HighlightViewer } from "./HighlightViewer";

export class ListItem extends React.Component {
    render() {
        const {
            varList: { item, adb, currentCollection, itemId, fetchItems, collection },
            updateItem,
            deleteItem,
        } = this.props;
        return (
            <div className="item" key={item.id}>
                <div className="item-left-col">
                    <HighlightViewer itemId={itemId} item={item} />
                </div>
                <div className={"item-right-col"}>
                    <EditJson
                        adb={adb}
                        fetchItems={fetchItems}
                        updateItem={updateItem}
                        deleteItem={deleteItem}
                        item={item}
                        placeholder={itemId}
                        currentCollection={currentCollection}
                        collection={collection}
                    />
                    <div className={"itemHeader"}>
                        <div className={"itemId"}>{item.id}</div>
                        <div className={"itemDate"}>
                            <span>Created:</span>
                            <span>{moment(item.dateCreated).format("MMM DD YYYY hh:mm a")}</span>
                            <span>Updated:</span>
                            <span>{moment(item.dateUpdated).format("MMM DD YYYY hh:mm a")}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
