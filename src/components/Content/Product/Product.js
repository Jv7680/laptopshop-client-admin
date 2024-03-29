import React, { Component } from 'react';
import Paginator from 'react-js-paginator';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actFetchCategoriesRequest } from '../../../redux/actions/category';
import { actActiveProductRequest, actDeleteProductRequest, actFetchProductsRequest, actGetProductOfCatagoryRequest, actGetProductOfKeyRequest } from '../../../redux/actions/product';
import callApi from '../../../utils/apiCaller';
import MyFooter from '../../MyFooter/MyFooter';
import ProductItem from './ProductItem';
import './style.css';

class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      currentPage: 1,
      searchText: '',
      category: "All",
      dataCategory: []
    }
  }
  async componentDidMount() {
    let token = localStorage.getItem('_auth');
    const { currentPage } = this.state;

    const res = await actFetchProductsRequest(currentPage)();
    if (res && res.status === 200) {
      this.setState({
        total: res.data.totalPage,
        currentPage: res.data.currentPage
      })

      // Tạo biến lưu id product tiếp theo trong local storage
      // Dùng trong trường hợp thêm mới product để up ảnh firebase
      const resNew = await callApi(`admin/product/all?page=1&size=10`, 'GET', null, token);
      if (resNew && resNew.status === 200) {
        console.log("resNew là", resNew);
        // let dataFinalPage = resNew.data.listProducts;
        // newProductID sẽ bằng id mới nhất + 1 
        // let newProductID = dataFinalPage[dataFinalPage.length - 1].productId + 1;
        let newProductID = resNew.data.listProducts[0].productId + 1;
        localStorage.setItem('_newProductID', newProductID);
      }
    }


  }
  async pageChange(content) {
    this.props.fetch_products(content);
    this.setState({
      currentPage: content
    })
    window.scrollTo(0, 0);

  }
  handleRemove = (id) => {
    let { currentPage } = this.state;
    console.log('handleRemove currentPage', currentPage);
    console.log('handleRemove productId', id);

    this.props.delete_product(id, currentPage);

  }
  handleActive = (id) => {
    let { currentPage } = this.state;
    console.log('handleActive currentPage', currentPage);
    console.log('handleActive productId', id);

    this.props.active_product(id, currentPage);
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleSearchCategory = async event => {
    const { catagory, currentPage, total } = this.state
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      category: value
    });

    if (value == "All") {

      const resdata = await this.props.fetch_products("1");
      if (resdata && resdata.status === 200) {
        this.setState({
          total: resdata.data.totalPage,
          currentPage: resdata.data.currentPage
        })
      }
    }
    else {
      const res = await this.props.find_products_by_catagory(value)
      if (res && res.status == 200) {

        this.setState(
          {
            currentPage: res.data.currentPage,
            total: res.data.totalPage
          }
        )
      }
    }

  }

  handleSearch = async (event) => {
    event.preventDefault();
    const { searchText } = this.state;
    const res = await this.props.find_products(searchText)
    if (res && res.status == 200) {
      this.setState({
        currentPage: res.data.currentPage,
        total: res.data.totalPage,
      })
    }
  }



  render() {
    let { products } = this.props;
    const { searchText, total, dataCategory, category, currentPage } = this.state;
    console.log(products)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Products</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Sản Phẩm</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  {/* <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Xuất data sản phẩm</h3>
                    <button style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                      style={{ fontSize: 18, color: '#1d7044' }}> Excel</i></button>
                  </div> */}


                  <div className='d-flex' style={{ margin: "0 15px 15px auto" }}>
                    <div>
                      <Link to='/products/add' className="btn btn-primary" >Thêm mới</Link>
                    </div>
                  </div>


                  <form
                    className="form-inline md-form form-sm mt-0 justify-content-between"
                    style={{ justifyContent: 'flex-end', marginLeft: "auto" }}
                    onSubmit={(event) => this.handleSearch(event)}
                  >
                    {/* <div className="col-sm-">

                      {
                        dataCategory && dataCategory.length > 0 ?

                          <select className="form-control" name="category" value={category} onChange={this.handleSearchCategory}>
                            <option value="All" >All</option>
                            {

                              dataCategory.map(item => {
                                return (
                                  <option key={item.categoryId} value={item.categoryName} >{item.categoryName}</option>
                                )
                              })
                            }

                          </select>
                          :
                          <select className="form-control" name="supplierId" />


                      }
                    </div> */}
                    <div className='d-flex'>
                      <div>
                        <input
                          name="searchText"
                          onChange={this.handleChange}
                          className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                          aria-label="Tìm kiếm" />
                        <button style={{ border: 0, background: 'white' }}> <i className="fa fa-search" aria-hidden="true"></i></button>
                      </div>
                    </div>
                  </form>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>

                            <th>Tên sản phẩm</th>
                            <th style={{ textAlign: "center" }}>Ảnh</th>
                            <th>Mô tả</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            {/* <th>Properties</th> */}

                            <th style={{ textAlign: "center" }}>Sửa</th>
                            <th>Ngừng kinh doanh</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products && products.length ? products.map((item, index) => {
                            return (
                              // <tr key={index}>

                              //   <td>{item.productName}</td>
                              //   <td style={{ textAlign: "center" }}>
                              //     <div className="fix-cart">
                              //       <img src={item.image} className="fix-img" alt="not found" />
                              //     </div>
                              //   </td>
                              //   <td>
                              //     <p className="text-truncate" style={{ width: 300 }}>
                              //       {item.description.replace(/<(?:.|\n)*?>/gm, '').slice(0, 70)}...
                              //     </p>
                              //   </td>
                              //   <td>{item.unitprice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                              //   <td>{item.quantity}</td>
                              //   {/* <td>{item.properties}</td> */}

                              //   <td style={{ textAlign: "center" }}>
                              //     <div>
                              //       <span title='Edit' className="fix-action"><Link to={`/products/edit/${item.productId}`}> <i className="fa fa-edit"></i></Link></span>
                              //       {/* <span
                              //         onClick={() => this.handleRemove(item.productId, item.productName)}
                              //         title='Delete'
                              //         className="fix-action"
                              //       >
                              //         <Link to="#">
                              //           <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i>
                              //         </Link>
                              //       </span> */}
                              //     </div>

                              //   </td>
                              //   <td>
                              //     {
                              //       item.isdeleted == 1 ?
                              //         <Switch onChange={() => this.handleActive(item.productId)} checked={true} />
                              //         :
                              //         <Switch onChange={() => this.handleRemove(item.productId)} checked={false} />

                              //     }

                              //   </td>
                              // </tr>
                              <ProductItem
                                key={item.productId}
                                product={item}
                                handleActive={this.handleActive}
                                handleRemove={this.handleRemove}
                              >
                              </ProductItem>
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
        </section >
        {/* Page Footer*/}
        <MyFooter MyFooter ></MyFooter>
      </div >
    )
  }
}
const mapStateToProps = (state) => {
  return {
    products: state.products
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_products: async (page) => {
      return await dispatch(await actFetchProductsRequest(page))
    },
    fetch_catagory: () => {
      return dispatch(actFetchCategoriesRequest())
    },
    find_products_by_catagory: (catagory, page) => {
      return dispatch(actGetProductOfCatagoryRequest(catagory, page))
    },
    find_products: (searchText, page) => {
      return dispatch(actGetProductOfKeyRequest(searchText, page))
    },
    delete_product: (id, currentPage) => {
      dispatch(actDeleteProductRequest(id, currentPage))
    },
    active_product: (id, currentPage) => {
      dispatch(actActiveProductRequest(id, currentPage))
    }

  }
}




export default connect(mapStateToProps, mapDispatchToProps)(Product)