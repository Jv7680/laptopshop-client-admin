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
import store from '../../..';

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

      cpu_name: 'Celeron',
      cpu_core: '',
      cpu_cache: '2 MB',
      cpu_thread: '',
      cpu_speed: '',

      harddrive_capacity: "128 GB",
      harddrive_type: "SSD",

      ram_capacity: "4 GB",
      ram_type: "DDR3",
      ram_bus: "1600",

      screen_size: "11.6 inch",
      screen_resolution: "1280 x 720",
      screen_frequency: "60 HZ",

      graphic_card: "AMD Radeon R5 520",
      sound_technology: "",

      weight: "",
      shell_material: "",

      battery: "",
      operating_system: "",
      release_year: "",

      redirectToProduct: false,
    };

    //id của sản phẩm
    id = this.props.id
  }

  async componentDidMount() {
    let token = localStorage.getItem('_auth');
    if (id) {
      const res = await callApi(`admin/product/${id}`, 'GET', null, token);
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

          cpu_name: res.data.cpu || "Celeron",
          cpu_core: res.data.cores,
          cpu_cache: res.data.cache || "2 MB",
          cpu_thread: res.data.threads,
          cpu_speed: res.data.cpuspeed,

          harddrive_capacity: res.data.storagecapacity || "128 GB",
          harddrive_type: res.data.storagetype || "SSD",

          ram_capacity: res.data.ram || "4 GB",
          ram_type: res.data.ramtype || "DDR3",
          ram_bus: res.data.rambusspeed || "1600",

          screen_size: res.data.screensize || "11.6 inch",
          screen_resolution: res.data.screenresolution || "1280 x 720",
          screen_frequency: res.data.screenrefreshrate || "60 HZ",

          graphic_card: res.data.graphicscard || "AMD Radeon R5 520",
          sound_technology: res.data.audiotechnology,

          weight: res.data.weight,
          shell_material: res.data.casingmaterial,

          battery: res.data.battery,
          operating_system: res.data.operatingsystem,
          release_year: res.data.releasedate,
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

    console.log("event select", event, event.target.name, event.target.value)
  }

  handleChangeSelecProducer = (event) => {
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      supplierId: value
    })

    // console.log("e sup", event, event.target.name, event.target.value)
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
      productImageSet,

      cpu_name,
      cpu_core,
      cpu_cache,
      cpu_thread,
      cpu_speed,
      harddrive_capacity,
      harddrive_type,
      ram_capacity,
      ram_type,
      ram_bus,
      screen_size,
      screen_resolution,
      screen_frequency,
      graphic_card,
      sound_technology,
      weight,
      shell_material,
      battery,
      operating_system,
      release_year,
    } = this.state;
    console.log("cpu_name", cpu_name);
    const newProductName = productName === '' ? '' : productName;
    const newQuantity = parseInt(quantity);
    const newDiscount = parseInt(discount);
    const newUnitPrice = parseInt(unitPrice);
    const newDescriptionProduct = descriptionProduct === '' ? '' : descriptionProduct;
    const newCategoryId = parseInt(categoryId);
    const newSupplierId = parseInt(supplierId);
    const { image } = this.state;

    //check lỗi
    if (!validateProduct.name(newProductName) || !validateProduct.unitprice(newUnitPrice) || !validateProduct.discount(newDiscount) || !validateProduct.quantity(newQuantity)) {
      return;
    }
    //check lỗi cpu
    if (!validateProduct.cpu(cpu_name) || !validateProduct.cpuCore(cpu_core) || !validateProduct.cpuThread(cpu_thread) || !validateProduct.cpuSpeed(cpu_speed) || !validateProduct.cache(cpu_cache)) {
      return;
    }
    //check lỗi ổ cứng
    if (!validateProduct.harddriveCapacity(harddrive_capacity) || !validateProduct.harddriveType(harddrive_type)) {
      return;
    }
    //check lỗi ram
    if (!validateProduct.ram(ram_capacity) || !validateProduct.ramType(ram_type) || !validateProduct.ramBus(ram_bus)) {
      return;
    }
    //check lỗi kích thước màn
    if (!validateProduct.screenSize(screen_size) || !validateProduct.screenResolution(screen_resolution) || !validateProduct.screenFrequency(screen_frequency)) {
      return;
    }
    //check lỗi khác
    if (!validateProduct.graphicCard(graphic_card) || !validateProduct.audioTechnology(sound_technology) || !validateProduct.weight(weight) || !validateProduct.shellMaterial(shell_material) || !validateProduct.battery(battery) || !validateProduct.operatingSystem(operating_system) || !validateProduct.releaseYear(release_year) || !validateProduct.description(newDescriptionProduct)) {
      return;
    }

    const addNewProduct = {
      "productId": parseInt(localStorage.getItem('_newProductID')),
      "productName": newProductName,
      "quantity": newQuantity,
      "image": image,
      "unitprice": newUnitPrice,
      "discount": newDiscount,
      "description": newDescriptionProduct,
      "supplierId": newSupplierId,

      "cpu": cpu_name,
      "cores": cpu_core,
      "threads": cpu_thread,
      "cpuspeed": cpu_speed,
      "cache": cpu_cache,
      "storagecapacity": harddrive_capacity,
      "storagetype": harddrive_type,
      "ram": ram_capacity,
      "ramtype": ram_type,
      "rambusspeed": ram_bus,
      "screensize": screen_size,
      "screenresolution": screen_resolution,
      "screenrefreshrate": screen_frequency,
      "graphicscard": graphic_card,
      "audiotechnology": sound_technology,
      "weight": weight,
      "casingmaterial": shell_material,
      "battery": battery,
      "operatingsystem": operating_system,
      "releasedate": release_year,
    }

    const newProduct = {
      "productId": parseInt(id),
      "productName": newProductName,
      "quantity": newQuantity,
      "image": image,
      "unitprice": newUnitPrice,
      "discount": newDiscount,
      "description": newDescriptionProduct,
      "supplierId": newSupplierId,

      "cpu": cpu_name,
      "cores": cpu_core,
      "threads": cpu_thread,
      "cpuspeed": cpu_speed,
      "cache": cpu_cache,
      "storagecapacity": harddrive_capacity,
      "storagetype": harddrive_type,
      "ram": ram_capacity,
      "ramtype": ram_type,
      "rambusspeed": ram_bus,
      "screensize": screen_size,
      "screenresolution": screen_resolution,
      "screenrefreshrate": screen_frequency,
      "graphicscard": graphic_card,
      "audiotechnology": sound_technology,
      "weight": weight,
      "casingmaterial": shell_material,
      "battery": battery,
      "operatingsystem": operating_system,
      "releasedate": release_year,
    }

    if (!id) {
      console.log('addNewProduct: ', addNewProduct);
      // let result = await this.props.add_Product(addNewProduct);
      let result = await store.dispatch(actAddProductRequest(addNewProduct));
      if (result) {
        this.setState({
          redirectToProduct: true
        })
      }
    }
    else {
      // let checkImage = this.handleCheckImage(null);
      // if (!checkImage) {
      //   return;
      // }

      console.log('newProduct: ', newProduct);
      // await this.props.edit_Product(id, newProduct);
      let result = await store.dispatch(actEditProductRequest(id, newProduct));
      console.log('editProduct result: ', result);
      if (result) {
        this.setState({
          redirectToProduct: true
        })
      }

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
                          <select className="form-control mb-3" name="cpu_name" value={cpu_name} onChange={this.handleChange}>
                            <option selected value="Celeron" >Celeron</option>
                            <option value="Pentium" >Pentium</option>
                            <option value="Snapdragon" >Snapdragon</option>
                            <option value="Intel Core I3" >Intel Core I3</option>
                            <option value="Intel Core I5" >Intel Core I5</option>
                            <option value="Intel Core I7" >Intel Core I7</option>
                            <option value="Intel Core I9" >Intel Core I9</option>
                            <option value="AMD Ryzen 3" >AMD Ryzen 3</option>
                            <option value="AMD Ryzen 5" >AMD Ryzen 5</option>
                            <option value="AMD Ryzen 7" >AMD Ryzen 7</option>
                            <option value="AMD Ryzen 9" >AMD Ryzen 9</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={cpu_name}
                            name="cpu_name"
                            type="text"
                            className="form-control" /> */}
                        </div>
                        <label className="col-sm-3 form-control-label">Số nhân*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={cpu_core}
                            name="cpu_core"
                            type="text"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label" >Số luồng*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={cpu_thread}
                            name="cpu_thread"
                            type="text"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label" >Tốc độ CPU*</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={cpu_speed}
                            name="cpu_speed"
                            type="text"
                            className="form-control" />
                        </div>
                        <label className="col-sm-3 form-control-label" >Bộ nhớ đệm*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="cpu_cache" value={cpu_cache} onChange={this.handleChange}>
                            <option selected value="2 MB" >2 MB</option>
                            <option value="3 MB" >3 MB</option>
                            <option value="4 MB" >4 MB</option>
                            <option value="5 MB" >5 MB</option>
                            <option value="6 MB" >6 MB</option>
                            <option value="7 MB" >7 MB</option>
                            <option value="8 MB" >8 MB</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={cpu_cache}
                            name="cpu_cache"
                            type="text"
                            className="form-control" /> */}
                        </div>
                      </div>

                      <div className="line" />

                      {/* Ổ cứng */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Dung Lượng ổ cứng*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="harddrive_capacity" value={harddrive_capacity} onChange={this.handleChange}>
                            <option selected value="128 GB" >128 GB</option>
                            <option value="256 GB" >256 GB</option>
                            <option value="512 GB" >512 GB</option>
                            <option value="1 TB" >1 TB</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={harddrive_capacity}
                            name="harddrive_capacity"
                            type="text"
                            className="form-control" /> */}
                        </div>
                        <label className="col-sm-3 form-control-label">Loại ổ cứng*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="harddrive_type" value={harddrive_type} onChange={this.handleChange}>
                            <option selected value="SSD" >SSD</option>
                            <option value="HDD" >HDD</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={harddrive_type}
                            name="harddrive_type"
                            type="text"
                            className="form-control" /> */}
                        </div>
                      </div>

                      <div className="line" />

                      {/* RAM */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Dung Lượng RAM*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="ram_capacity" value={ram_capacity} onChange={this.handleChange}>
                            <option selected value="4 GB" >4 GB</option>
                            <option value="8 GB" >8 GB</option>
                            <option value="16 GB" >16 GB</option>
                            <option value="32 GB" >32 GB</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={ram_capacity}
                            name="ram_capacity"
                            type="text"
                            className="form-control" /> */}
                        </div>
                        <label className="col-sm-3 form-control-label">Loại RAM*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="ram_type" value={ram_type} onChange={this.handleChange}>
                            <option selected value="DDR3" >DDR3</option>
                            <option value="DDR4" >DDR4</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={ram_type}
                            name="ram_type"
                            type="text"
                            className="form-control" /> */}
                        </div>
                        <label className="col-sm-3 form-control-label">Tốc độ BUS RAM*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="ram_bus" value={ram_bus} onChange={this.handleChange}>
                            <option selected value="1600" >1600</option>
                            <option value="2400" >2400</option>
                            <option value="2666" >2666</option>
                            <option value="3200" >3200</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={ram_bus}
                            name="ram_bus"
                            type="text"
                            className="form-control" /> */}
                        </div>
                      </div>

                      <div className="line" />

                      {/* Màn hình */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Kích thước màn hình*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="screen_size" value={screen_size} onChange={this.handleChange}>
                            <option selected value="11.6 inch" >11.6 inch</option>
                            <option value="13 inch" >13 inch</option>
                            <option value="13.3 inch" >13.3 inch</option>
                            <option value="13.4 inch" >13.4 inch</option>
                            <option value="13.5 inch" >13.5 inch</option>
                            <option value="14 inch" >14 inch</option>
                            <option value="14.5 inch" >14.5 inch</option>
                            <option value="15.6 inch" >15.6 inch</option>
                            <option value="16 inch" >16 inch</option>
                            <option value="16.1 inch" >16.1 inch</option>
                            <option value="17 inch" >17 inch</option>
                            <option value="17.3 inch" >17.3 inch</option>
                            <option value="18 inch" >18 inch</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={screen_size}
                            name="screen_size"
                            type="text"
                            className="form-control" /> */}
                        </div>
                        <label className="col-sm-3 form-control-label">Độ phân giải*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="screen_resolution" value={screen_resolution} onChange={this.handleChange}>
                            <option selected value="1280 x 720" >1280 x 720</option>
                            <option value="1920 x 1080" >1920 x 1080</option>
                            <option value="2560 x 1440" >2560 x 1440</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={screen_resolution}
                            name="screen_resolution"
                            type="text"
                            className="form-control" /> */}
                        </div>
                        <label className="col-sm-3 form-control-label">Tần số quét*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="screen_frequency" value={screen_frequency} onChange={this.handleChange}>
                            <option selected value="60 HZ" >60 HZ</option>
                            <option value="90 HZ" >90 HZ</option>
                            <option value="144 HZ" >144 HZ</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={screen_frequency}
                            name="screen_frequency"
                            type="text"
                            className="form-control" /> */}
                        </div>
                      </div>

                      <div className="line" />

                      {/* Card màn hình */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Tên card màn hình*</label>
                        <div className="col-sm-3">
                          <select className="form-control mb-3" name="graphic_card" value={graphic_card} onChange={this.handleChange}>
                            <option selected value="AMD Radeon R5 520" >AMD Radeon R5 520</option>
                            <option value="GTX 1650" >GTX 1650</option>
                            <option value="GTX 1650Ti" >GTX 1650Ti</option>
                            <option value="GeForce MX130" >GeForce MX130</option>
                            <option value="GeForce MX330" >GeForce MX330</option>
                            <option value="RTX 1650" >RTX 1650</option>
                            <option value="RTX 2050" >RTX 2050</option>
                          </select>
                          {/* <input
                            onChange={this.handleChange}
                            value={graphic_card}
                            name="graphic_card"
                            type="text"
                            className="form-control" /> */}
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
                            type="text"
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
    add_Product: async (newProduct) => {
      await dispatch(actAddProductRequest(newProduct))
    },
    edit_Product: async (id, data) => {
      await dispatch(actEditProductRequest(id, data))
    }
  }
}

export default connect(null, mapDispatchToProps)(ActionProduct)