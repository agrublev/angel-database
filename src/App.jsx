import { inject, observer } from "mobx-react";
import { Component, lazy, Suspense } from "react";
import Items from "./views/Items";
import "./styles/milligram.css";
import "./styles/App.less";
import DB from "./database/init";
import AddItem from "./views/AddItem";

@inject("store")
@observer
class App extends Component {
    componentDidMount() {
        DB.getItem()
            .then((variant) => {
                console.log("VARIANBT", variant);

                // this.forceUpdate();
            })
            .catch((err) => {
                console.log("err", err);
            });
        // DB.setItem({
        //     items: [
        //         {
        //             uid: "28eb8c6f-0f72-405a-84f9-f15eb18b9bce",
        //             createdTimestamp: 1671561275254,
        //             name: "tata",
        //         },
        //     ],
        // })
        //     .then((variant) => {
        //         console.log("VARIANBT", variant);
        //
        //         // this.forceUpdate();
        //     })
        //     .catch((err) => {
        //         console.log("err", err);
        //     });
    }

    render() {
        return (
            <div>
                <AddItem />
                <Items />
            </div>
        );
    }
}

export default App;
