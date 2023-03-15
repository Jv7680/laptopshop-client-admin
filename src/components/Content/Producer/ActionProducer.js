import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { actAddProducerRequest, actEditProducerRequest } from '../../../redux/actions/producer';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import callApi from '../../../utils/apiCaller';
// import { uploadImage } from '../../../utils/upload'
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import validateProducer from '../../../utils/validations/validateProducer'

let id;
const override = css`
    display: block;
    margin: 0 auto;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;
class ActionProducer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierName: '',
      supplierImage: '',
      redirectToProducer: false,
      img: null,
      loading: false,
      image: '',
      renderImageLink: false,
    };
    id = this.props.id
  }
  async componentDidMount() {

    if (id) {
      let token = localStorage.getItem('_auth');
      const res = await callApi(`admin/supplier/${id}`, 'GET', null, token);
      console.log("dữ liệu 1 supplier", res.data)
      this.setState({
        supplierName: res.data.supplierName,
        image: res.data.imageLink,
      })

      //đưa ảnh hiện tại vào imgLinkCheckOld
      setTimeout(() => {
        let { image } = this.state;
        document.getElementById('imgLinkCheckOld').attributes.src.nodeValue = image;
      }, 100);
    }
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleCheckImage = (event) => {
    let { image, renderImageLink } = this.state;
    console.log('imageLink là:', image);

    //Check lỗi độ dài
    if (!validateProducer.image(image)) {
      console.log('xxxx');
      return false;
    }

    this.setState({
      renderImageLink: true,
    });

    setTimeout(() => {
      document.getElementById('imgLinkCheck').attributes.src.nodeValue = image;
    }, 100);

  }

  handleChangeImage = (event) => {
    if (event.target.files[0]) {
      const img = event.target.files[0];
      this.setState(() => ({ img }));
    }
    const output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
  }
  handleSubmit = async (event) => {
    event.preventDefault();

    const { supplierName, image } = this.state;

    //check lỗi
    if (!validateProducer.name(supplierName) || !validateProducer.image(image)) {
      return;
    }

    const newProducer = {
      "supplierName": supplierName,
      "imageLink": image,
    }

    if (!id) {
      console.log('newProducer: ', newProducer);
      await this.props.add_Producer(newProducer);
      this.setState({
        loading: false,
        redirectToProducer: true
      })

    }
    else {
      console.log('newProducer: ', newProducer);
      await this.props.edit_Producer(id, newProducer);
      this.setState({
        loading: false,
        redirectToProducer: true
      })

    }
  }

  render() {
    const { supplierName, supplierImage, loading, redirectToProducer, image, renderImageLink } = this.state;
    if (redirectToProducer) {
      return <Redirect to='/producers'></Redirect>
    }
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <div className='sweet-loading'>
          <ClipLoader
            css={override}
            sizeUnit={"px"}
            size={30}
            color={'#796aeebd'}
            loading={loading}
          />
        </div>
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Trang Nhà cung cấp</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Nhà cung cấp</li>
          </ul>
        </div>
        {/* Forms Section*/}
        <section className="forms">
          <div className="container-fluid">
            <div className="row">
              {/* Form Elements */}
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Thông tin nhà cung cấp</h3>
                  </div>
                  <div className="card-body">
                    <form className="form-horizontal" onSubmit={(event) => this.handleSubmit(event)} >
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Tên Nhà Cung Cấp</label>
                        <div className="col-sm-9">
                          <input
                            name="supplierName"
                            onChange={this.handleChange} value={supplierName}
                            type="text"
                            className="form-control"
                            placeholder="Nhập tên nhà cung cấp"
                          />
                        </div>
                      </div>

                      <div className="line" />
                      {/* image */}
                      <div className="form-group row">
                        <label htmlFor="fileInput" className="col-sm-3 form-control-label">Hình Ảnh</label>
                        <div className="col-9 col-sm-9" >
                          {/* <Dropzone onDrop={this.onDrop}>
                            {({ getRootProps, getInputProps }) => (
                              <section style={{ border: '1px dotted' }}>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                  <input {...getInputProps()} />
                                  <h2 className='ml-3'>Chọn ảnh tại đây!!!</h2>
                                </div>
                                <aside>

                                  <div>
                                    {
                                      productImageSet && productImageSet.length > 0 ?
                                        productImageSet.map((itemImage, index) => {
                                          return (
                                            < span key={index}>
                                              <div className='model m-3'>
                                                <div className="modal-content">
                                                  <div className="modal-header">
                                                    <button type="button"
                                                      onClick={() => this.removeImage(index, true)}
                                                      className="close_button" >
                                                      <span aria-hidden="true">&times;</span>
                                                    </button>
                                                  </div>
                                                  <img src={itemImage} style={{ height: 100, width: 100 }} alt="notfound" />
                                                </div>
                                              </div>
                                            </span>
                                          )
                                        })
                                        : null
                                    }
                                  </div>
                                </aside>
                              </section>
                            )}
                          </Dropzone> */}

                          {/* Xử lý image */}
                          <input
                            type="text"
                            onChange={this.handleChange}
                            value={image}
                            name="image"
                            className="form-control"
                            style={{ width: "89%", display: "inline" }}
                          />
                          <button
                            className="btn btn-primary"
                            type='button'
                            onClick={(event) => { this.handleCheckImage(event) }}
                            style={{ margin: "0 5px", display: "inline" }}
                          >
                            Check
                          </button>
                          {/* Dành cho edit sản phẩm */}
                          {
                            this.props.id ?
                              (
                                <p>
                                  <img
                                    id='imgLinkCheckOld'
                                    src="" alt="not found"
                                    style={{
                                      width: "200px",
                                      marginRight: "50px"
                                    }}
                                  />
                                  <span style={{ fontSize: "20px", color: "#5f68df" }}>(Ảnh Hiện Tại)</span>
                                </p>
                              )
                              :
                              (
                                null
                              )
                          }
                          {
                            !renderImageLink ?
                              (
                                null
                              )
                              :
                              (
                                <p>
                                  <img
                                    id='imgLinkCheck'
                                    src="" alt="not found"
                                    style={{
                                      width: "200px",
                                      marginRight: "50px"
                                    }}
                                  />
                                  <span style={{ fontSize: "20px", color: "#5f68df" }}>(Ảnh Mới)</span>
                                </p>
                              )
                          }
                        </div>
                      </div>

                      {/* <div className="form-group row">
                        <label htmlFor="fileInput" className="col-sm-3 form-control-label">Hình Ảnh</label>
                        <div className="col-sm-9">
                          <input type="file" onChange={this.handleChangeImage} className="form-control-file" />
                          <div className="fix-cart">
                            <img src={supplierImage || 'http://via.placeholder.com/400x300'} id="output" className="fix-img" alt="avatar" />
                          </div>
                        </div>
                      </div> */}


                      <div className="form-group row">
                        <div className="col-sm-4 offset-sm-3">
                          <Link to='/producers' type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Thoát</Link>
                          <button type="submit" className="btn btn-primary">Lưu</button>
                        </div>
                      </div>


                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Page Footer*/}

      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    add_Producer: (newProducer) => {
      return dispatch(actAddProducerRequest(newProducer))
    },
    edit_Producer: (id, data) => {
      dispatch(actEditProducerRequest(id, data))
    }

  }
}

export default connect(null, mapDispatchToProps)(ActionProducer)