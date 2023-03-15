import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { startLoading, doneLoading } from '../../utils/loading'
import { actLoginRequest } from '../../redux/actions/auth'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    handleChange = event => {
        const name = event.target.name; console.log(name);
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }
    handleSubmit = async event => {

        event.preventDefault();
        const { username, password } = this.state;

        if (password.length < 6 || password.length > 32) {
            return toast.error('Mật khẩu yếu! Yêu cầu tối thiểu 6 ký tự!');
        }

        const user = {
            username,
            password
        }
        startLoading();
        await this.props.loginRequest(user);
        doneLoading();
    }
    render() {
        const { username, password } = this.state;
        const { auth } = this.props;
        if (auth !== null) {
            return <Redirect to="/"></Redirect>
        }
        return (
            <div className="page login-page">
                <div className="container d-flex align-items-center">
                    <div className="form-holder has-shadow">
                        <div className="row">
                            {/*Logo & Information Panel*/}
                            <div className="col-lg-6">
                                <div className="info d-flex align-items-center">
                                    <div className="logo" style={{ margin: '0 auto 0' }}>
                                        <img style={{ maxHeight: '205px' }} src={process.env.PUBLIC_URL + '/img/logo/logoPT5.png'} alt='not found' />
                                    </div>
                                </div>
                            </div>
                            {/*Form Panel*/}
                            <div className=" col-lg-6 bg-white">
                                <div className="form d-flex align-items-center">
                                    <div className="content">
                                        <form
                                            onSubmit={(event) => this.handleSubmit(event)}>
                                            <div className="form-group">
                                                <input
                                                    onChange={this.handleChange}
                                                    type="text"
                                                    name="username"
                                                    value={username} className="input-material"
                                                    placeholder="Your Account" />

                                            </div>
                                            <div className="form-group">
                                                <input
                                                    onChange={this.handleChange}
                                                    type="password"
                                                    name="password"
                                                    value={password}
                                                    className="input-material" placeholder="Password" />

                                            </div>
                                            <button className="btn btn-primary">Đăng nhập</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (user) => {
            dispatch(actLoginRequest(user))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)

