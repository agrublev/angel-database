import { getRoot } from "mobx-state-tree";
import React from "react";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import "./CollectionsManage.less";

@inject("store")
@observer
class DatabaseManageView extends React.Component {
    @observable databaseName;

    render() {
        return (
            <div className={"collectionsManage"}>
                <div className={"dbList"}>
                    {this.props.store.databaseStore.databases.map(db => (
                        <div key={db.uid}>
                            <a
                                href={"#"}
                                onClick={e => {
                                    e.preventDefault();
                                    this.props.store.databaseStore.setDatabase(db.uid);
                                }}
                            >
                                <h3>{db.name}</h3>
                            </a>
                            {db.slug}
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    db.delete();
                                }}
                                type={"button"}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
                <form
                    className={"addDatabase"}
                    onSubmit={e => {
                        e.preventDefault();
                        this.addDatabase();
                    }}
                >
                    <h2>Add Database</h2>
                    <input
                        ref={ref => (this.dbNameRef = ref)}
                        defaultValue={this.databaseName}
                        placeholder={"DB Name"}
                        onChange={e => {
                            this.databaseName = e.target.value;
                        }}
                    />
                    <button type={"submit"}>Add</button>
                </form>
            </div>
        );
    }

    addDatabase = () => {
        this.props.store.databaseStore
            .addDatabase({
                name: this.databaseName,
                createdById: this.props.store.authStore.currentUser
            })
            .then(e => {
                this.databaseName = "";
                this.dbNameRef.value = "";
            })
            .catch(e => alert(e));
    };
}
export default DatabaseManageView;
