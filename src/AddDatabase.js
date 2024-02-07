import React from "react";

export default class AddDatabase extends React.Component {
    render() {
        return (
            <form
                className={"addCollectionForm"}
                onSubmit={(e) => {
                    this.props.submitHandle(this.getRef);
                    e.preventDefault();
                    return false;
                }}
            >
                <button
                    type={"button"}
                    className={"button closeAddColl"}
                    onClick={() => {
                        this.props.close();
                    }}
                >
                    X
                </button>
                <input autoFocus={true} ref={(ref) => (this.getRef = ref)} />
                <button className={"button"} type={"submit"}>
                    ADD DATABASE
                </button>
            </form>
        );
    }
}
