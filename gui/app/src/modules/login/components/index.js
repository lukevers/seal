/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Component } from 'react';
import logo from '../../../base/logo-white.png';
import { themes } from '../../../base/themes';
import { Button } from '../../../components/Button';
import Conn from '../../../lib/conn/';

export default class Login extends Component {
    state = {
        error: null,
        form: 'none',
        login: {
            email: '',
            password: '',
        },
        signup: {
            email: '',
            password: '',
            code: '',
        },
    }

    toggleForm(form) {
        this.setState({ form });
    }

    handleChange(value, form, key) {
        this.setState({
            [form]: {
                ...this.state[form],
                [key]: value,
            },
        });
    }

    async submit(form) {
        const data = await Conn.load(
            'settings',
            JSON.stringify([{key: "url", value: ""}]),
        );

        // TODO: replace localhost with domain
        const url = data.data[0].value || 'http://localhost:3333';

        if (form === 'signup') {
            const resp = await fetch(
                `${url}/api/user/create`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code: this.state[form].code,
                        email: this.state[form].email,
                        password: this.state[form].password,
                    }),
                }
            );

            const response = (await resp.json());
            if (response.error && response.error !== null) {
                this.setState({ error: response.error });
                return;
            }
        } else if (form === 'login') {
            const resp = await fetch(
                `${url}/api/user/authenticate`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.state[form].email,
                        password: this.state[form].password,
                    }),
                }
            );

            const response = (await resp.json());
            if (response.error && response.error !== null) {
                this.setState({ error: response.error });
                return;
            }
        }

        await Conn.sync(
            'settings',
            [
                {key: "password", value: this.state[form].password},
                {key: "email", value: this.state[form].email},
                {key: "url", value: url},
            ]
        );

        this.props.authenticate(true);
    }

    render() {
        if (this.props.loading) {
            return '';
        }

        let content = (
            <div>
                <img src={logo} alt="Seal"/>
                <span>
                    <Button white onClick={(e) => this.toggleForm('login')}>Log In</Button>
                    <Button white onClick={(e) => this.toggleForm('signup')}>Sign Up</Button>
                </span>
            </div>
        );

        if (this.state.form === 'login') {
            content = (
                <div>
                    <img src={logo} alt="Seal"/>
                    {this.state.error === null ? '' : (
                        <span>
                            <p className="error">{this.state.error}</p>
                        </span>
                    )}
                    <span>
                        <input
                            value={this.state.login.email}
                            placeholder="Email"
                            type="email"
                            onChange={(event) => this.handleChange(event.target.value, 'login', 'email')}
                        />

                        <input
                            value={this.state.login.password}
                            placeholder="Password"
                            type="password"
                            onChange={(event) => this.handleChange(event.target.value, 'login', 'password')}
                        />
                    </span>
                    <span>
                        <Button white onClick={(e) => this.submit('login')}>Log In</Button>
                        <Button white onClick={(e) => this.toggleForm('signup')}>I don't have an account</Button>
                    </span>
                </div>
            );
        } else if (this.state.form === 'signup') {
            content = (
                <div>
                    <img src={logo} alt="Seal"/>
                    {this.state.error === null ? '' : (
                        <span>
                            <p className="error">{this.state.error}</p>
                        </span>
                    )}
                    <span>
                        <input
                            value={this.state.signup.email}
                            placeholder="Email"
                            type="email"
                            onChange={(event) => this.handleChange(event.target.value, 'signup', 'email')}
                        />

                        <input
                            value={this.state.signup.password}
                            placeholder="Password"
                            type="password"
                            onChange={(event) => this.handleChange(event.target.value, 'signup', 'password')}
                        />
                    </span>
                    <span>
                        <input
                            value={this.state.signup.code}
                            name="code"
                            placeholder="Sign up code"
                            onChange={(event) => this.handleChange(event.target.value, 'signup', 'code')}
                        />
                    </span>
                    <span>
                        <Button white onClick={(e) => this.submit('signup')}>Create Account</Button>
                        <Button white onClick={(e) => this.toggleForm('login')}>I already have an account</Button>
                    </span>
                </div>
            );

        }

        return (
            <div css={css`
                height: 100%;
                color: ${themes.standard.gray};
                background-color: ${themes.standard.darker.secondary};
                height: 100%;
                text-transform: uppercase;
                letter-spacing: 1px;

                div {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }

                img {
                    max-width: 20em;
                    transition: transform 1s ease-in-out;

                    &:hover {
                        transform: rotate(360deg);
                    }

                    margin-bottom: 2.5em;
                }

                button {
                    display: inline-block;
                    margin: 1em .5em;
                }

                input {
                    padding: 1em;
                    border: 0;
                    width: 200px;
                    margin: .5em;
                    border-bottom: 1px solid ${themes.standard.gray};
                    background: transparent;
                    color: ${themes.standard.white};

                    &::placeholder {
                        color: ${themes.standard.gray};
                    }

                    &:focus {
                        outline: none;
                    }

                    &[name="code"] {
                        width: calc(400px + 1em);
                    }
                }

                .error {
                    background-color: ${themes.standard.primary};
                    color: ${themes.standard.white};
                    padding: 1em;
                    position: absolute;
                    top: 1em;
                    right: 1em;
                }
            `}>
                {content}
            </div>
        );
    }
}