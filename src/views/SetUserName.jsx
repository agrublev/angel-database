import {inject, observer} from "mobx-react";
import {Component} from "react";

@inject("store")
@observer
export default class SetUserName extends Component {
	render() {
		return (
			<div className={"userName"}>
				<h3>username: {this.props.store.user}</h3>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						this.props.store.setName(this.nameRef.value);
					}}
				>
					<input
						placeholder={"Set username"}
						type={"text"}
						ref={(ref) => (this.nameRef = ref)}
					/>
				</form>
			</div>
		);
	}
}
