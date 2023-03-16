import React from "react";
import { uploadProductImage, getProductListImageURL, deleteImage, deleteAllImageInImages } from '../../../firebase/CRUDImage';
import Dropzone from 'react-dropzone';
import Swal from "sweetalert2";
import { async } from "@firebase/util";

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productID: this.props.productID,

            listImageURL: [],
            listImageRef: [],
        };
    }

    componentDidMount = async () => {
        let { productID } = this.state;
        if (!productID) {
            // Lấy _newProductID từ local storage
            let newProductID = localStorage.getItem('_newProductID');
            // Dọn trống thư mục images đề phòng thư mục có ảnh
            await deleteAllImageInImages(newProductID);
        }
        await this.getDataImage();
    }

    getDataImage = async () => {
        let { productID } = this.state;

        // Nếu có id là giao diện chỉnh sửa
        if (productID) {
            let listImage = await getProductListImageURL(productID);
            this.setState({
                listImageURL: listImage.images,
                listImageRef: listImage.listImageRef,
            });
        }
        // Không có id là giao diện thêm mới
        else {
            // Lấy _newProductID từ local storage
            let newProductID = localStorage.getItem('_newProductID');

            let listImage = await getProductListImageURL(newProductID);
            this.setState({
                listImageURL: listImage.images,
                listImageRef: listImage.listImageRef,
            });
        }

    }

    onDrop = async (files) => {
        let { productID, listImageRef } = this.state;
        let imageName = "";

        // Check số lượng ảnh(tối đa 5)
        if (files.length > (5 - listImageRef.length)) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Yêu cầu tối đa 5 ảnh!',
                icon: 'warning'
            });

            return;
        }

        // Nếu có id là giao diện chỉnh sửa
        if (productID) {
            // Upload ảnh
            for (let i = 0; i < files.length; i++) {
                await uploadProductImage(productID, files[i], 'image', files[i].name);
                imageName = imageName.concat(' ', files[i].name);
            }
        }
        // Không có id là giao diện thêm mới
        else {
            // Lấy _newProductID từ local storage
            let newProductID = localStorage.getItem('_newProductID');
            // Upload ảnh lên newProductID
            for (let i = 0; i < files.length; i++) {
                await uploadProductImage(newProductID, files[i], 'image', files[i].name);
                imageName = imageName.concat(' ', files[i].name);
            }
        }

        // Up xong thì get lại data
        await this.getDataImage();

        // Thông báo chọn ảnh thành công
        Swal.fire({
            title: 'Thêm thành công',
            text: `Ảnh: ${imageName}`,
            icon: 'success'
        });
    }

    removeImage = async (listImageRefIndex) => {
        let { listImageRef } = this.state;
        await deleteImage(listImageRef[listImageRefIndex]);

        // Xóa xong thì get lại data
        await this.getDataImage();

        // Thông báo xóa ảnh thành công
        Swal.fire({
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
            title: `Xóa ảnh ${listImageRef[listImageRefIndex].name} thành công!`
        });
    }

    removeAllImage = async () => {
        let { productID } = this.state;
        let newProductID = localStorage.getItem('_newProductID');
        if (productID) {
            // Dọn trống thư mục images theo productID
            await deleteAllImageInImages(productID);
        }
        else {
            // Dọn trống thư mục images theo newProductID
            await deleteAllImageInImages(newProductID);
        }

        // Xóa xong thì get lại data
        await this.getDataImage();

        // Thông báo xóa ảnh thành công
        Swal.fire({
            title: 'Xóa thành công',
            text: 'Đã xóa tất cả ảnh',
            icon: 'success'
        });
    }

    render() {
        const { listImageURL } = this.state;

        return (
            <>
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
                                        listImageURL && listImageURL.length > 0 ?
                                            (
                                                listImageURL.map((itemImage, index) => {
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
                        listImageURL && listImageURL.length > 0 ?
                            (
                                <button type="button" onClick={() => { this.removeAllImage() }}>Xóa tất cả</button>
                            )
                            :
                            (
                                null
                            )
                    }
                </div>
            </>
        );
    }
}

export default Image;