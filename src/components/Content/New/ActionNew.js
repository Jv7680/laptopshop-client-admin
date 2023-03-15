import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { actAddProducerRequest, actEditProducerRequest } from '../../../redux/actions/producer';
import { actAddNewRequest, actEditNewRequest } from '../../../redux/actions/new';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import callApi from '../../../utils/apiCaller';
// import { uploadImage } from '../../../utils/upload'
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import validateNew from '../../../utils/validations/validateNew'
import ReactQuill from 'react-quill';


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


class ActionNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newtitle: '',
      contentNew: '',
      newImage: '',
      redirectToNew: false,
      img: null,
      loading: false,
      image: '',
      renderImageLink: false,
    };
    id = null
  }
  componentDidMount = async () => {
    if (this.props.match.params.id) {
      id = this.props.match.params.id
    }

    console.log('id', id);
    if (id) {
      let token = localStorage.getItem('_auth');
      const res = await callApi(`admin/news/${id}`, 'GET', null, token);
      console.log("dữ liệu 1 new", res.data)
      this.setState({
        newtitle: res.data.title,
        image: res.data.imageLink,
        contentNew: res.data.content,
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
    if (!validateNew.image(image)) {
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

    const { newtitle, contentNew, image } = this.state;

    //check lỗi
    if (!validateNew.title(newtitle) || !validateNew.content(contentNew) || !validateNew.image(image)) {
      return;
    }

    const newNew = {
      "title": newtitle,
      "content": contentNew,
      "imageLink": image,
      "accountId": 1,
      "newsId": id,
    }

    const newNewAdd = {
      "title": newtitle,
      "content": contentNew,
      "imageLink": image,
      "accountId": 1,
    }

    if (!id) {
      console.log('newNewAdd: ', newNewAdd);
      await this.props.add_New(newNewAdd);
      this.setState({
        loading: false,
        redirectToNew: true
      })

    }
    else {
      console.log('newNew: ', newNew);
      await this.props.edit_New(id, newNew);
      this.setState({
        loading: false,
        redirectToNew: true
      })

    }
  }

  handleChangeEditor = (value) => {
    this.setState({ contentNew: value })
  }

  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  render() {
    const { newtitle, newImage, loading, redirectToNew, image, renderImageLink, contentNew } = this.state;
    if (redirectToNew) {
      return <Redirect to='/news'></Redirect>
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
            <h2 className="no-margin-bottom">Trang tin tức</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Tin tức</li>
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
                    <h3 className="h4">Thông tin tin tức</h3>
                  </div>
                  <div className="card-body">
                    <form className="form-horizontal" onSubmit={(event) => this.handleSubmit(event)} >
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Tiêu đề</label>
                        <div className="col-sm-9">
                          <input
                            name="newtitle"
                            onChange={this.handleChange} value={newtitle}
                            type="text"
                            className="form-control"
                            placeholder="Nhập tiêu đề tin tức"
                          />
                        </div>
                      </div>

                      <div className="line" />

                      {/* mô tả */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Mô tả</label>
                        <div className="col-sm-9">
                          <ReactQuill
                            modules={this.modules}
                            formats={this.formats}
                            value={contentNew}
                            onChange={this.handleChangeEditor}
                          />
                        </div>
                      </div>

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
                            id ?
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
                          <Link to='/news' type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Thoát</Link>
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
    add_New: (newProducer) => {
      return dispatch(actAddNewRequest(newProducer))
    },
    edit_New: (id, data) => {
      dispatch(actEditNewRequest(id, data))
    }

  }
}

export default connect(null, mapDispatchToProps)(ActionNew)