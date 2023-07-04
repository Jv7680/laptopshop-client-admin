import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { connect } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import BeautyStars from 'beauty-stars';
import './style.css'
import Swal from "sweetalert2";
import { getProductFirstImageURL } from '../../../firebase/CRUDImage';
import Switch from "react-switch";
toast.configure()
let token, id;
id = parseInt(localStorage.getItem("_id"));

class ProductItem extends Component {
    componentDidMount = async () => {
        let { productId } = this.props.product;
        // console.log('vào componentDidMount pItem:', productId);
        let imageURL = await getProductFirstImageURL(productId);
        // console.log(`vào componentDidMount imageURL ${productId}:`, imageURL);

        if (imageURL === '') {
            imageURL = process.env.PUBLIC_URL + '/img/logo/logoPTCustomer.png';
            document.getElementsByClassName(`image-product-${productId}`)[0].setAttribute('src', imageURL);
        }
        else {
            document.getElementsByClassName(`image-product-${productId}`)[0].setAttribute('src', imageURL);
        }
    }

    render() {
        const { product } = this.props;

        // console.log('vào render pItem, p là:', product);

        return (
            <tr>
                <td>{product.productName}</td>
                <td style={{ textAlign: "center" }}>
                    <div className="fix-cart">
                        <img src={product.image} className={`fix-img image-product-${product.productId}`} alt="not found" />
                    </div>
                </td>
                <td>
                    <p className="text-truncate" style={{ width: 300 }}>
                        {product.description.replace(/<(?:.|\n)*?>/gm, '').slice(0, 70)}...
                    </p>
                </td>
                <td>{product.unitprice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                <td>{product.quantity}</td>
                {/* <td>{product.properties}</td> */}

                <td style={{ textAlign: "center" }}>
                    <div>
                        <span title='Edit' className="fix-action"><Link to={`/products/edit/${product.productId}`}> <i className="fa fa-edit"></i></Link></span>
                    </div>

                </td>
                <td>
                    {
                        product.isdeleted == 1 ?
                            <Switch onChange={() => this.props.handleActive(product.productId)} checked={true} />
                            :
                            <Switch onChange={() => this.props.handleRemove(product.productId)} checked={false} />

                    }

                </td>
            </tr>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // getProduct: state.product
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // getInfoProduct: (id) => {
        //     dispatch(actGetProductRequest(id))
        // },
        // addCart: (idCustomer, product, quantity) => {
        //     dispatch(actAddCartRequest(idCustomer, product, quantity));
        // },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductItem))
