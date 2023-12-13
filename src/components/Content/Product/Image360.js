import React from "react";
import { uploadProductImage, getProductListImage360URL, deleteImage, deleteAllImageInImages360 } from '../../../firebase/CRUDImage';
import Dropzone from 'react-dropzone';
import Swal from "sweetalert2";
import { async } from "@firebase/util";

import Slider from "react-slick";
import { React360Viewer } from "react-360-product-viewer";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    dots: false,
    infinite: true,
    speed: 10,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 300,
    fade: true,
    swipe: false,
    arrows: false,
};

class Image360 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productID: this.props.productID,

            listImage360URL: [],
            listImage360Ref: [],
        };
    }

    componentDidMount = async () => {
        let { productID } = this.state;
        console.log('productID:', productID);
        if (!productID) {
            // Lấy _newProductID từ local storage
            let newProductID = localStorage.getItem('_newProductID');
            // Dọn trống thư mục images360 đề phòng thư mục có ảnh
            await deleteAllImageInImages360(newProductID);
        }
        await this.getDataImage();
    }

    getDataImage = async () => {
        let { productID } = this.state;

        // Nếu có id là giao diện chỉnh sửa
        if (productID) {
            let listImage = await getProductListImage360URL(productID);
            this.setState({
                listImage360URL: listImage.images360,
                listImage360Ref: listImage.listImage360Ref,
            });
        }
        // Không có id là giao diện thêm mới
        else {
            // Lấy _newProductID từ local storage
            let newProductID = localStorage.getItem('_newProductID');

            let listImage = await getProductListImage360URL(newProductID);
            this.setState({
                listImage360URL: listImage.images360,
                listImage360Ref: listImage.listImage360Ref,
            });
        }

        setTimeout(() => {
            const { listImage360URL } = this.state;
            // Thay thế lần luotj theo thứ tự src hiện tại của component bằng link ảnh
            if (listImage360URL.length > 0) {
                for (let i = 0; i < listImage360URL.length; i++) {
                    document.querySelectorAll('div.image-360-area img.sc-beySbM')[i].setAttribute('src', listImage360URL[i])
                }
            }
        }, 800);

    }

    onDrop = async (files) => {
        let { productID, listImage360Ref } = this.state;
        let imageName = "";
        console.log('files:', files);
        // Check số lượng ảnh(tối đa 50)
        if (files.length > (50 - listImage360Ref.length)) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Yêu cầu tối đa 50 ảnh!',
                icon: 'warning'
            });

            return;
        }

        // Nếu có id là giao diện chỉnh sửa
        if (productID) {
            // Upload ảnh
            for (let i = 0; i < files.length; i++) {
                await uploadProductImage(productID, files[i], 'image360', files[i].name);
                imageName = imageName.concat(' ', files[i].name);
            }
        }
        // Không có id là giao diện thêm mới
        else {
            // Lấy _newProductID từ local storage
            let newProductID = localStorage.getItem('_newProductID');
            // Upload ảnh lên newProductID
            for (let i = 0; i < files.length; i++) {
                await uploadProductImage(newProductID, files[i], 'image360', files[i].name);
                imageName = imageName.concat(' ', files[i].name);
            }
        }

        // Up xong thì get lại data
        await this.getDataImage();

        // THông báo thêm ảnh thành công
        Swal.fire({
            title: 'Thêm thành công',
            text: `Ảnh: ${imageName}`,
            icon: 'success'
        });
    }

    removeImage = async (listImage360RefIndex) => {
        let { listImage360Ref } = this.state;
        await deleteImage(listImage360Ref[listImage360RefIndex]);

        // Xóa xong thì get lại data
        await this.getDataImage();

        // Thông báo xóa ảnh thành công
        Swal.fire({
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
            title: `Xóa ảnh ${listImage360Ref[listImage360RefIndex].name} thành công!`
        });
    }

    removeAllImage360 = async () => {
        let { productID } = this.state;
        let newProductID = localStorage.getItem('_newProductID');
        if (productID) {
            // Dọn trống thư mục images360 theo productID
            await deleteAllImageInImages360(productID);
        }
        else {
            // Dọn trống thư mục images360 theo newProductID
            await deleteAllImageInImages360(newProductID);
        }

        // Xóa xong thì get lại data
        await this.getDataImage();

        // Thông báo xóa ảnh thành công
        Swal.fire({
            title: 'Xóa thành công',
            text: 'Đã xóa tất cả ảnh 360 độ',
            icon: 'success'
        });
    }

    render() {
        const { listImage360URL } = this.state;

        return (
            <>
                {/* vùng chọn ảnh */}
                <div className="col-sm-8" >
                    <Dropzone onDrop={(files) => { this.onDrop(files) }}>
                        {({ getRootProps, getInputProps }) => (
                            <section style={{ border: '1px dotted' }}>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} />
                                    <span className='drop-zone fa-plus'> Kéo, thả hoặc nhấn vào vùng này để chọn ảnh!</span>
                                </div>
                                <aside>

                                    <div>
                                        {
                                            listImage360URL && listImage360URL.length > 0 ?
                                                (
                                                    listImage360URL.map((itemImage, index) => {
                                                        return (
                                                            <span key={index}>
                                                                <div className='model m-3'>
                                                                    <div className="modal-content">
                                                                        <button type="button"
                                                                            onClick={() => this.removeImage(index, true)}
                                                                            className="close_button" >
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                        <img src={itemImage} style={{ height: 100, width: 100 }} alt="notfound" />
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        )
                                                    })
                                                )
                                                :
                                                (
                                                    null
                                                )
                                        }
                                    </div>
                                </aside>
                            </section>
                        )}
                    </Dropzone>
                    <div className="btn-delete-all-image">
                        {
                            listImage360URL && listImage360URL.length > 0 ?
                                (
                                    <button type="button" onClick={() => { this.removeAllImage360() }}>Xóa tất cả</button>
                                )
                                :
                                (
                                    null
                                )
                        }
                    </div>
                </div>

                {/* vùng xoay ảnh */}
                <div className="col-sm-4" style={{ border: '1px solid black', height: '244px' }}>
                    <div className="silder-image-product">
                        {/* <Slider  {...settings}>
                            {
                                listImage360URL.length > 0 ?
                                    (
                                        listImage360URL.map((url, index) => {
                                            return (
                                                <div key={index} className="image-in-slider">
                                                    <img src={url} alt="not found" />
                                                </div>
                                            );
                                        })
                                    )
                                    :
                                    (
                                        null
                                    )
                            }
                        </Slider> */}
                        <div className="image-360-area image-in-slider">
                            <React360Viewer
                                imagesBaseUrl={''}
                                imagesCount={listImage360URL.length}
                                imagesFiletype="jpg"
                                mouseDragSpeed={7}
                                autoplay={true}
                                autoplaySpeed={7}
                            // reverse={true}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Image360;