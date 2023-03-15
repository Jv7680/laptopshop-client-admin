import React, { Component } from 'react'
import './style.css'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Moment from 'react-moment';
import { actFetchOrdersRequest, actApproveOrdersRequest, actDeleteOrderRequest } from '../../../redux/actions/order';
import { actFetchDashboardRequest } from '../../../redux/actions/dashboard'
import { formatNumber } from '../../../config/TYPE'
import Modal from "react-modal";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Paginator from 'react-js-paginator';
import { css } from '@emotion/core';
import callApi from '../../../utils/apiCaller';
const MySwal = withReactContent(Swal)
let status;
const override = css`
    display: block;
    margin: 0 auto;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "1000px"
  }
};
class OrderStatus5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      total: 0,
      currentPage: 1,
      statusPage: 'Chưa duyệt',
      redirectToProduct: false,
      modalIsOpen: false,
      listProductOrdered: [],
    }

  }
  componentDidMount() {
    const { statusPage } = this.state

    //status = 5 là đã hủy
    this.fetch_reload_data(5);

  }

  fetch_reload_data(statusPage) {
    this.props.fetch_orders(statusPage).then(res => {
      this.setState({
        total: res.totalPage
      });
    }).catch(err => {
      console.log(err);
    })
  }

  pageChange(content) {
    const page = content;
    const { statusPage } = this.state
    this.props.fetch_orders(statusPage, page);
    if (content <= 0) {

      this.setState({
        currentPage: 1
      })
    }
    else {
      this.setState({
        currentPage: content
      })

    }

    window.scrollTo(0, 0);
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleBrowse = async (id) => {
    // const id = event.target.value;
    // const { statusPage, currentPage } = this.state
    // await this.props.approveOrder(id, statusPage, currentPage);
    // await this.props.fetch_dashboard();

    //gọi api
    let token = localStorage.getItem('_auth');
    //gửi body với status 3 để đơn hàng có trạng thái đang giao
    let body = {
      orderStatus: 3,
    }
    await callApi(`admin/orders/update/${id}`, "PUT", body, token);

    Swal.fire(
      'Giao hàng!',
      `Đơn hàng ${id} đang được giao.!`,
      'success'
    )

    setTimeout(() => {
      //gọi lại fetch để set lại state orders của redux, sẽ khiến component này tự render lại
      console.log('set lại state');
      this.fetch_reload_data(1);
    }, 250);

  }
  handleRemove = (id) => {
    MySwal.fire({
      title: 'Xóa đơn hàng?',
      text: `Bạn chắc chắn xóa đơn hàng ${id}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        await this.props.delete_order(id);
        Swal.fire(
          'Xóa!',
          'Đơn hàng của bạn đã được xóa.!',
          'success'
        )

        setTimeout(() => {
          //gọi lại fetch để set lại state orders của redux, sẽ khiến component này tự render lại
          console.log('set lại state');
          this.fetch_reload_data(1);
        }, 250);
      }
    })
  }
  handleSubmit = (event) => {
    event.preventDefault();
  }

  openModalOrderDetail = (e, item) => {
    e.preventDefault();


    //lấy danh saasch sản phẩm của mỗi đơn hàng item
    let listProductOrdered = item.lstOrdersDetail;
    console.log('itemsss:', item);
    console.log('listProductOrdered:', listProductOrdered);
    localStorage.setItem('_orderId', item.orderId);
    this.setState({
      modalIsOpen: true,
      listProductOrdered: item.lstOrdersDetail,
    })
  }

  showItem(items) {
    let result = null;
    console.log('items: ', items)
    if (items.length > 0) {
      result = items.map((item, index) => {
        return (
          <tr>
            <td className="li-product-thumbnail d-flex justify-content-center">
              <Link to={`/products/edit/${item.productId}`} >
                <div className="fix-cart"> <img className="fix-img" src={item.imgLink} alt="Li's Product" /></div>
              </Link>
            </td>
            <td className="li-product-name">
              <Link className="text-dark" to={`/products/edit/${item.productId}`}>{item.productName}</Link>
            </td>
            <td className="li-product-name">
              {formatNumber(item.price)}
            </td>
            <td className="li-product-name">
              {item.quantity}
            </td>
          </tr>
        );
      });
    }
    return result;
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { orders } = this.props;
    const { listProductOrdered } = this.state
    const { searchText, total, statusPage } = this.state;
    console.log('orders state của redux', orders)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Đơn hàng</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Đơn hàng</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Đơn hàng đã hủy</h3>
                    {/* <button onClick={()=>this.downloadExcel()} style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                        style={{fontSize: 18, color: '#1d7044'}}> Excel</i></button> */}
                  </div>

                  <div className="card-body">
                    <Modal
                      isOpen={this.state.modalIsOpen}
                      onAfterOpen={this.afterOpenModal}
                      onRequestClose={this.closeModal}
                      style={customStyles}
                      ariaHideApp={false}
                      contentLabel="Example Modal"
                    >
                      <div className="table-content table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="li-product-thumbnail">Ảnh</th>
                              <th className="cart-product-name">Tên sản phẩm</th>
                              <th className="li-product-price">Giá</th>
                              <th className="li-product-quantity">Số lượng</th>
                              {/* <th className="li-product-subtotal">Tổng</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.showItem(listProductOrdered)
                            }
                          </tbody>
                        </table>
                      </div>
                      <div className="feedback-input">
                        <div className="feedback-btn pb-15">

                          <button
                            onClick={this.closeModal}
                            className="btn mr-1"
                            style={{ background: "#fed700", color: "white" }}
                          >
                            Thoát
                          </button>
                        </div>
                      </div>

                    </Modal>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>id đơn hàng</th>
                            <th>Tổng sản phẩm</th>
                            <th>Tổng tiền</th>
                            <th>Khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Ghi chú</th>
                            <th>Ngày tạo HĐ</th>
                            <th>Ngày hủy HĐ</th>
                            {/* <th>Xóa</th>
                            <th>Giao hàng

                            </th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {orders && orders.length ? orders.map((item, index) => {
                            return (
                              <tr key={index} onDoubleClick={(e) => { this.openModalOrderDetail(e, item) }}>
                                <th scope="row">{item.orderId}</th>
                                <td>
                                  {/* {
                                    item.lstOrdersDetail && item.lstOrdersDetail.length ?
                                      item.lstOrdersDetail.map((product, index) => {
                                        return (
                                          <>
                                            <li className='d-flex' key={index}>
                                              <div className="fix-order">
                                                <img src={product.imgLink} className="fix-img-order" alt="not found" />
                                              </div>
                                              <div>
                                                <h6 className='pl-3 pt-10'>{product.productName}</h6>


                                                <strong
                                                  className="pl-3 product-quantity"
                                                  style={{
                                                    paddingLeft: 10,
                                                    color: "coral",
                                                    fontStyle: "italic",
                                                  }}
                                                >
                                                  SL: {product.quantity}
                                                </strong>
                                              </div>


                                            </li>
                                          </>

                                        )
                                      }) : null
                                  } */}
                                  {
                                    item.totalQuantity
                                  }
                                </td>
                                <td>{formatNumber(item.totalAmount)}</td>
                                <td>{item.receiptName}</td>
                                <td>{item.phoneNumber}</td>
                                <td>{item.address}</td>
                                <td>{item.customerNote}</td>
                                <td>
                                  <Moment format="YYYY/MM/DD">
                                    {item.createDate}
                                  </Moment>
                                </td>
                                <td>
                                  <Moment format="YYYY/MM/DD">
                                    {item.createDate}
                                  </Moment>
                                </td>
                                {/* Tạm bỏ chức năng xem chi tiết đơn hàng do chưa có api */}
                                {/* <td style={{ textAlign: "left" }}>
                                  <div >
                                    <span title='Edit' className="fix-action"><Link to={`/orders/edit/${item.orderId}`}> <i className="fa fa-edit"></i></Link></span>
                                    <span title='Delete' onClick={() => this.handleRemove(item.orderId)} className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
                                  </div>
                                </td>
                                <td>
                                  <button className="btn btn-primary" value={item.orderId} onClick={() => this.handleBrowse(item.orderId)} > Giao</button>
                                </td> */}
                              </tr>
                            )
                          }) : null}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <nav aria-label="Page navigation example" style={{ float: "right" }}>
                  <ul className="pagination">
                    <Paginator
                      pageSize={1}
                      totalElements={total}
                      onPageChangeCallback={(e) => { this.pageChange(e) }}
                    />
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>
        {/* Page Footer*/}

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.orders
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_dashboard: () => {
      dispatch(actFetchDashboardRequest())
    },
    fetch_orders: (status, offset) => {
      return dispatch(actFetchOrdersRequest(status, offset))
    },
    approveOrder: (id, status, page) => {
      return dispatch(actApproveOrdersRequest(id, status, page))
    },
    delete_order: (id) => {
      dispatch(actDeleteOrderRequest(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatus5)
