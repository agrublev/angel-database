import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React from "react";
import "./Auth.less";

@inject("store")
@observer
class AuthView extends React.Component {
    @observable email;
    @observable password;
    @observable REGemail;
    @observable REGpassword;

    render() {
        return (
            <div className={"authView"}>
                <form
                    className={"login"}
                    onSubmit={e => {
                        e.preventDefault();
                        this.login();
                    }}
                >
                    <h2>Login</h2>
                    <input
                        defaultValue={this.email}
                        placeholder={"Email"}
                        type={"email"}
                        onChange={e => {
                            this.email = e.target.value;
                        }}
                    />
                    <input
                        defaultValue={this.password}
                        placeholder={"Password"}
                        type={"password"}
                        onChange={e => {
                            this.password = e.target.value;
                        }}
                    />
                    <button type={"submit"}>LOGIN</button>
                </form>
                <form
                    className={"register"}
                    onSubmit={e => {
                        e.preventDefault();
                        this.props.store.authStore
                            .signup(this.REGemail, this.REGpassword)
                            .then(e => {})
                            .catch(e => {
                                alert(e);
                            });
                    }}
                >
                    <h2>Register</h2>
                    <input
                        defaultValue={this.REGemail}
                        autoComplete="new-password"
                        placeholder={"Email"}
                        type={"email"}
                        onChange={e => {
                            this.REGemail = e.target.value;
                        }}
                    />
                    <input
                        defaultValue={this.REGpassword}
                        autoComplete="new-password"
                        placeholder={"Password"}
                        type={"password"}
                        onChange={e => {
                            this.REGpassword = e.target.value;
                        }}
                    />
                    <button type={"submit"}>REG</button>
                </form>
            </div>
        );
    }

    login = () => {
        this.props.store.authStore
            .loginEmailPass(this.email, this.password)
            .then(e => {})
            .catch(e => {});
    };
}
export default AuthView;
