import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchNewsRequest, actDeleteNewRequest } from '../../../redux/actions/new';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Paginator from 'react-js-paginator';
const MySwal = withReactContent(Swal)



class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      total: 0,
      currentPage: 1,
      contentNew: '',
    }
  }

  componentDidMount() {
    this.fetch_reload_data(); //recive data from return promise dispatch
  }
  fetch_reload_data() {

    this.props.fetch_producers()
      .catch(err => {
        console.log(err);
      })
  }
  handleRemove = (id, name) => {
    MySwal.fire({
      title: `Xóa tin tức ${name} ?`,
      text: "Bạn chắc chắn muốn xóa tin tức này !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        await this.props.delete_producer(id);
        Swal.fire(
          'Đã xóa!',
          `Tin tức ${name} của bạn đã được xóa.`,
          'success'
        )
      }
    })
  }
  render() {
    let { news } = this.props;
    const { searchText, total } = this.state;
    console.log("dữ liệu nhà cung cấp", news)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Tin tức</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Tin tức</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    {/* <button style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                      style={{ fontSize: 18, color: '#1d7044' }}> Excel</i></button> */}
                  </div>
                  <form
                    className="form-inline md-form form-sm mt-0" style={{ justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20 }}>
                    {/* <div>
                      <button style={{ border: 0, background: 'white' }}><i className="fa fa-search" aria-hidden="true"></i></button>
                      <input name="searchText"
                        onChange={this.handleChange}

                        className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                        aria-label="Search" />
                    </div> */}
                    <Link to="/news/add" className="btn btn-primary" > Thêm mới</Link>
                  </form>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tiêu đề</th>
                            <th>Hình ảnh</th>
                            <th>Nội dung</th>
                            <th>Ngày tạo</th>
                            <th style={{ textAlign: "center" }}>Chức năng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {news && news.length ? news.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.title}</td>
                                <td style={{ textAlign: "center" }}>
                                  <div className="fix-cart">
                                    <img src={item.imageLink} className="fix-img" alt="not found" />
                                  </div>
                                </td>
                                <td>
                                  {item.content.replace(/<(?:.|\n)*?>/gm, '').slice(0, 70)}...
                                </td>
                                <td>
                                  {new Date(item.created).getDate()}
                                  {'/'}
                                  {new Date(item.created).getMonth() + 1}
                                  {'/'}
                                  {new Date(item.created).getFullYear()}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <div>
                                    <span title='Edit' className="fix-action"><Link to={`news/edit/${item.newsId}`}> <i className="fa fa-edit"></i></Link></span>
                                    <span
                                      onClick={() => this.handleRemove(item.newsId, item.title)}
                                      title='Delete'
                                      className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
                                  </div>
                                </td>
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
                      pageSize={10}
                      totalElements={total}
                      onPageChangeCallback={(e) => { this.pageChange(e) }}
                    />
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>

      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    news: state.news
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_producers: () => {
      return dispatch(actFetchNewsRequest())
    },
    delete_producer: (id, token) => {
      dispatch(actDeleteNewRequest(id, token))
    }

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(New)