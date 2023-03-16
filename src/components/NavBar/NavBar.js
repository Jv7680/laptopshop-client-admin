import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import callApi from '../../utils/apiCaller';
let token;

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: []
    }
  }
  async componentDidMount() {
    // token = localStorage.getItem('_auth');
    // if (token) {
    //   const res = await callApi('auth/login', 'GET', null, token);
    //   console.log('ressssss: ', res);
    //   if (res && res.status === 200) {
    //     this.setState({
    //       user: res.data
    //     })
    //   }
    // } else {
    //   this.setState({
    //     redirect: true
    //   })
    // }
  }

  HandleLogout = () => {
    localStorage.clear();

    window.location.reload();

  }

  render() {

    const { dashboard } = this.props
    const { user } = this.state;
    const newUser = user && user.length ? user[0] : null;
    console.log('dashboard: ', dashboard)

    return (
      <nav className="side-navbar" style={{ minWidth: "190px" }}>
        {/* Sidebar Header*/}
        <div className="sidebar-header d-flex align-items-center">
          <div className="avatar">
            <img src={newUser && newUser.avatar ? newUser.avatar : 'https://i.ibb.co/NCdx7FF/avatar-Default.png'} alt="notfound"
              className="img-fluid rounded-circle" />
          </div>
          <div className="title">
            <h1 className="h4">{newUser && newUser.fullnameAdmin ? newUser.fullnameAdmin : null}</h1>
            <p><b style={{ fontWeight: 600 }}>{newUser ? "Admin" : null}</b></p>
          </div>
        </div>
        {/* Sidebar Navidation Menus*/}
        {/* <span className="heading">Chức năng</span> */}
        <ul className="list-unstyled">
          <li><Link to="/"> <i className="icon-home" />Trang chủ</Link></li>
          <li><Link to="/orders/status1"> <i className="icon icon-bill" /> Đơn hàng </Link>
            <ul className="list-unstyled">
              <li>
                <Link to="/orders/status1">
                  <i className="fa-solid fa-align-left" />
                  Chờ duyệt
                  {/* <span class="ml-3 badge badge-danger">{dashboard.newOrders}</span> */}
                </Link>
              </li>
              <li>
                <Link to="/orders/status2">
                  <i className="fa-solid fa-list-check" />
                  Đã duyệt
                  {/* <span class="ml-3 badge badge-danger">{dashboard.newOrders}</span> */}
                </Link>
              </li>
              <li>
                <Link to="/orders/status3">
                  <i className="fa-solid fa-cart-flatbed" />
                  Đang giao
                  {/* <span class="ml-3 badge badge-warning">{dashboard.quantityOfApprovedOrder}</span> */}
                </Link>
              </li>

              <li>
                <Link to="/orders/status4">
                  <i className="fa-solid fa-clipboard-check" />
                  Đã giao
                  {/* <span class="ml-3 badge badge-success">{dashboard.quantityOfDeliveredOrder}</span> */}
                </Link>
              </li>
              <li>
                <Link to="/orders/status5">
                  <i className="fa-solid fa-calendar-xmark" />
                  Đã hủy
                  {/* <span class="ml-3 badge badge-danger">{dashboard.newOrders}</span> */}
                </Link>
              </li>
            </ul>
          </li>

          <li><Link to="/products"> <i className="icon icon-website" />Sản phẩm</Link></li>
          <li><Link to="/producers"> <i className="icon icon-list-1" />Nhà cung cấp</Link></li>
          <li><Link to="/news"> <i className="icon icon-page" />Tin tức</Link></li>
          {/* <li><Link to="/customers"> <i className="icon icon-user" />QL người dùng</Link></li> */}
          <li><Link to="#" onClick={() => { this.HandleLogout() }}> <i className="icon icon-close" />Đăng xuất</Link></li>

        </ul>

      </nav>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nameRole: state.nameRole,
    dashboard: state.dashboard,
  }
}

export default connect(mapStateToProps, null)(withRouter(NavBar));