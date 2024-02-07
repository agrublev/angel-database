import React from "react";

export class SortBy extends React.Component {
    render() {
        const { sortByDirection, sortBy, sortedItems } = this.props;
        return (
            <div className="sort-by">
                <div className={"label-srt"}>Sort by:</div>
                <button
                    className={`button button-sort ${sortBy === "dateUpdated" ? "active" : ""}`}
                    onClick={() => {
                        sortedItems({
                            sortBy: "dateUpdated",
                            sortByDirection: sortBy === "dateUpdated" ? !sortByDirection : false,
                        });
                    }}
                >
                    Updated
                    {sortBy === "dateUpdated" && (
                        <span className={"sortDirection"}>{sortByDirection ? "asc" : "desc"}</span>
                    )}
                </button>
                <button
                    className={`button button-sort ${sortBy === "dateCreated" ? "active" : ""}`}
                    onClick={() => {
                        sortedItems({
                            sortBy: "dateCreated",
                            sortByDirection: sortBy === "dateCreated" ? !sortByDirection : false,
                        });
                    }}
                >
                    Created
                    {sortBy === "dateCreated" && (
                        <span className={"sortDirection"}>{sortByDirection ? "asc" : "desc"}</span>
                    )}
                </button>
            </div>
        );
    }
}
