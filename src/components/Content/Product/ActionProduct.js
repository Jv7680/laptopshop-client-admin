import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { actAddProductRequest, actEditProductRequest } from '../../../redux/actions/product';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import callApi from '../../../utils/apiCaller';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import validateProduct from '../../../utils/validations/validateProduct';
import Image from './Image';
import Image360 from './Image360';

let token;
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
class ActionProduct extends Component {

  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      quantity: 0,
      productImageSet: [],
      filesImage: [],

      listImageDropzoneFile: [],

      listImageURL: [],
      listImageRef: [],

      listImage360URL: [],
      listImage360Ref: [],

      discount: 0,
      unitPrice: 0,
      descriptionProduct: '',
      dataCategories: [],
      dataSupplieres: [],
      categoryId: 1,
      supplierId: 1,
      image: '',

      cpu_name: '',
      cpu_core: '',
      cpu_cache: '',
      cpu_thread: '',
      cpu_speed: '',

      harddrive_capacity: null,
      harddrive_type: null,

      ram_capacity: null,
      ram_type: null,
      ram_bus: null,

      screen_size: null,
      screen_resolution: null,
      screen_frequency: null,

      graphic_card: null,
      sound_technology: null,

      weight: null,
      shell_material: null,

      battery: null,
      operating_system: null,
      release_year: null,

      redirectToProduct: false,
    };

    //id của sản phẩm
    id = this.props.id
  }

  async componentDidMount() {
    let token = localStorage.getItem('_auth');
    if (id) {
      const res = await callApi(`product/${id}`, 'GET', null, token);
      if (res && res.status === 200) {
        console.log("dữ liệu trả về", res.data)
        this.setState({
          productName: res.data.productName,
          quantity: res.data.quantity,
          productImageSet: [res.data.image],
          discount: res.data.discount,
          unitPrice: res.data.unitprice,
          descriptionProduct: res.data.description,
          image: res.data.image,
          //categoryId: res.data.categoryFKDto.categoryId,
          //supplierId: res.data.supplierFKDto.supplierId,

        })
      }
    }

    const resSupplieres = await callApi('admin/supplier/all', 'GET', null, token);
    console.log("dữ liệu trả về suplier", resSupplieres.data)
    if (resSupplieres && resSupplieres.status === 200) {
      this.setState({
        dataSupplieres: resSupplieres.data
      })
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

  handleChangeSelecProducer = (event) => {
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      supplierId: value
    })
  }

  handleChangeEditor = (value) => {
    this.setState({ descriptionProduct: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      productName,
      quantity,
      discount,
      unitPrice,
      descriptionProduct,
      categoryId,
      supplierId,
      filesImage,
      productImageSet
    } = this.state;

    const newProductName = productName === '' ? '' : productName;
    const newQuantity = parseInt(quantity);
    const newDiscount = parseInt(discount);
    const newUnitPrice = parseInt(unitPrice);
    const newDescriptionProduct = descriptionProduct === '' ? '' : descriptionProduct;
    const newCategoryId = parseInt(categoryId);
    const newSupplierId = parseInt(supplierId);
    const { image } = this.state;

    //check lỗi
    if (!validateProduct.name(newProductName) || !validateProduct.unitprice(newUnitPrice) || !validateProduct.discount(newDiscount) || !validateProduct.quantity(newQuantity) || !validateProduct.description(newDescriptionProduct) || !validateProduct.image(image)) {
      return;
    }

    const addNewProduct = {
      "productName": newProductName,
      "quantity": newQuantity,
      "image": image,
      "unitprice": newUnitPrice,
      "discount": newDiscount,
      "description": newDescriptionProduct,
      "supplierId": newSupplierId
    }

    const newProduct = {
      "productId": parseInt(id),
      "productName": newProductName,
      "quantity": newQuantity,
      "image": image,
      "unitprice": newUnitPrice,
      "discount": newDiscount,
      "description": newDescriptionProduct,
      "supplierId": newSupplierId
    }

    if (!id) {
      console.log('addNewProduct: ', addNewProduct);
      await this.props.add_Product(addNewProduct);
      this.setState({
        redirectToProduct: true
      })

    }
    else {
      // let checkImage = this.handleCheckImage(null);
      // if (!checkImage) {
      //   return;
      // }

      console.log('newProduct: ', newProduct);
      await this.props.edit_Product(id, newProduct);
      this.setState({
        redirectToProduct: true
      })

    }
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
    const { productName, quantity, productImageSet, filesImage, discount, unitPrice, descriptionProduct, dataSupplieres, categoryId, dataCategories, supplierId, image, redirectToProduct } = this.state;
    const { cpu_name, cpu_core, cpu_cache, cpu_thread, cpu_speed } = this.state;
    const { harddrive_capacity, harddrive_type } = this.state;
    const { ram_capacity, ram_type, ram_bus } = this.state;
    const { screen_size, screen_resolution, screen_frequency } = this.state;
    const { graphic_card, sound_technology } = this.state;
    const { weight, shell_material } = this.state;
    const { battery, operating_system, release_year } = this.state;

    // console.log('listImageURL:', listImageURL)
    // console.log(productName);
    if (redirectToProduct) {
      return <Redirect to='/products'></Redirect>
    }
    // console.log(productImageSet)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Trang sản phẩm</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/products">Sản phẩm</Link></li>
            {
              !id ?
                <li className="breadcrumb-item active">thêm sản phẩm</li>
                : <li className="breadcrumb-item active"> Sửa sản phẩm</li>
            }

          </ul>
        </div>
        {/* Forms Section*/}
        <section className="forms">
          <div className="container">
            <div className="row">
              {/* Form Elements */}
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Thông tin sản phẩm</h3>
                  </div>
                  <div className="card-body">
                    <form className="form-horizontal" onSubmit={(event) => this.handleSubmit(event)} >
                      {/* tên sản phẩm */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Tên sản phẩm*</label>
                        <div className="col-sm-9">
                          <input
                            onChange={this.handleChange}
                            value={productName}
                            name="productName"
                            type="text"
                            className="form-control" />
                        </div>
                      </div>
                      <div className="line" />
                      {/* giá, số lượng */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Giá*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={unitPrice}
                            name="unitPrice"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label" style={{ textAlign: 'center' }}>Số lượng*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={quantity}
                            name="quantity"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label" >Giảm giá*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={discount}
                            name="discount"
                            type="number"
                            className="form-control" />
                        </div>
                      </div>

                      <div className="line" />

                      {/* nhà cung cấp */}
                      <div className="form-group row">
                        <label
                          className="col-sm-3 form-control-label">
                          Nhà cung cấp*
                        </label>
                        <div className="col-sm-9">
                          <select className="form-control mb-3" name="supplierId" value={supplierId} onChange={this.handleChangeSelecProducer}>
                            {
                              dataSupplieres && dataSupplieres.length ? dataSupplieres.map((item, index) => {
                                return (
                                  <option key={item.supplierId} value={item.supplierId} >{item.supplierName}</option>
                                )
                              }) : null
                            }
                          </select>
                        </div>
                      </div>

                      <div className="line" />

                      {/* CPU */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Tên CPU*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={cpu_name}
                            name="cpu_name"
                            type="text"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Số nhân*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={cpu_core}
                            name="cpu_core"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label" >Số luồng*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={cpu_thread}
                            name="cpu_thread"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label" >Tốc độ CPU*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={cpu_speed}
                            name="cpu_speed"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label" >Bộ nhớ đệm*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={cpu_cache}
                            name="cpu_cache"
                            type="number"
                            className="form-control" />
                        </div>
                      </div>

                      <div className="line" />

                      {/* Ổ cứng */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Dung Lượng ổ cứng*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={harddrive_capacity}
                            name="harddrive_capacity"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Loại ổ cứng*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={harddrive_type}
                            name="harddrive_type"
                            type="number"
                            className="form-control" />
                        </div>
                      </div>

                      <div className="line" />

                      {/* RAM */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Dung Lượng RAM*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={ram_capacity}
                            name="ram_capacity"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Loại RAM*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={ram_type}
                            name="ram_type"
                            type="text"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Tốc độ BUS RAM*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={ram_bus}
                            name="ram_bus"
                            type="number"
                            className="form-control" />
                        </div>
                      </div>

                      <div className="line" />

                      {/* Màn hình */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Kích thước màn hình*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={screen_size}
                            name="screen_size"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Độ phân giải*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={screen_resolution}
                            name="screen_resolution"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Tần số quét*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={screen_frequency}
                            name="screen_frequency"
                            type="number"
                            className="form-control" />
                        </div>
                      </div>

                      <div className="line" />

                      {/* Card màn hình */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Tên card màn hình*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={graphic_card}
                            name="graphic_card"
                            type="text"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Công nghệ âm thanh*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={sound_technology}
                            name="sound_technology"
                            type="text"
                            className="form-control" />
                        </div>
                      </div>

                      <div className="line" />

                      {/* khối lượng và chất liệu */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Khối lượng*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={weight}
                            name="weight"
                            type="number"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Chất liệu vỏ*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={shell_material}
                            name="shell_material"
                            type="text"
                            className="form-control" />
                        </div>
                      </div>

                      <div className="line" />

                      {/* Thông tin khác */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Pin*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={battery}
                            name="battery"
                            type="text"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Hệ điều hành*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={operating_system}
                            name="operating_system"
                            type="text"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label">Thời điểm ra mắt*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={release_year}
                            name="release_year"
                            type="text"
                            className="form-control" />
                        </div>
                      </div>

                      <div className="line" />

                      {/* mô tả */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Mô tả*</label>
                        <div className="col-sm-9">
                          <ReactQuill
                            modules={this.modules}
                            formats={this.formats}
                            value={descriptionProduct}
                            onChange={this.handleChangeEditor}
                          />
                        </div>
                      </div>

                      <div className="line" />

                      {/* image */}
                      <div className="form-group row">
                        <label htmlFor="fileInput" className="col-sm-3 form-control-label">Ảnh*</label>
                        <div className="col-9 col-sm-9" >
                          <Image productID={id}></Image>
                        </div>
                      </div>

                      <div className="line" />

                      {/* image360 */}
                      <div className="form-group row">
                        <label htmlFor="fileInput" className="col-sm-12 form-control-label">Ảnh 360 độ</label>
                        <Image360 productID={id}></Image360>
                      </div>

                      <div className="line" />

                      {/* chức năng thoát/lưu */}
                      <div className="form-group row">
                        <div className="col-sm-4 offset-sm-3">
                          <Link to='/products' type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Thoát</Link>
                          <button type="submit" className="btn btn-primary">Lưu</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div >
        </section >
        {/* Page Footer*/}

      </div >
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    add_Product: (newProduct) => {
      dispatch(actAddProductRequest(newProduct))
    },
    edit_Product: (id, data) => {
      dispatch(actEditProductRequest(id, data))
    }
  }
}

export default connect(null, mapDispatchToProps)(ActionProduct)