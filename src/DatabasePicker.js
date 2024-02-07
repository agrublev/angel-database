import React from "react";

export class DatabaseManageView extends React.Component {
    render() {
        return (
            <div className={"collectionSelector"}>
                <label>Databases</label>
                <select
                    className={"collSelect"}
                    value={this.props.value}
                    onChange={this.props.onChange}
                >
                    {this.props.databases.map((db) => (
                        <option key={db}>{db}</option>
                    ))}
                </select>
                <button className={"addDb button"} onClick={this.props.onClick}>
                    +
                </button>
                <button className={"addDb button"} onClick={this.props.onDeleteClick}>
                    -
                </button>
            </div>
        );
    }
}
