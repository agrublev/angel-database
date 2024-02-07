import React from "react";
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import { hot } from "react-hot-loader";
import "./App.less";
import ManageView from "./ManageView";

@observer
class App extends React.Component {

    render() {
        return (
            <div className="App">
                <ManageView dbKey={this.currentDatabase} />
            </div>
        );
    }
}

export default hot(module)(App);
