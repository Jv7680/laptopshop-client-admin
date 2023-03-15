import { toast } from 'react-toastify';

const validateProduct = {
    name: (name) => {
        if (name.length === 0) {
            toast.error('Bạn chưa nhập tên sản phẩm!');
            return false;
        }
        else {
            return true;
        }
    },

    quantity: (quantity) => {
        if (quantity < 1) {
            toast.error('Số lượng không hợp lệ! Yêu cầu tối thiểu 1.');
            return false;
        }
        else {
            return true;
        }
    },

    image: (image) => {
        if (image.length === 0) {
            toast.error('Link ảnh trống!');
            return false;
        }
        else if (image.length > 500) {
            toast.error('Link quá dài! Yêu cầu nhỏ hơn 500 ký tự.');
            return false;
        }
        else {
            return true;
        }
    },

    unitprice: (unitprice) => {
        if (unitprice < 1000000) {
            toast.error('Đơn giá không hợp lệ! Yêu cầu tối thiểu 1.000.000');
            return false;
        }
        else {
            return true;
        }
    },

    discount: (discount) => {
        if (discount < 1) {
            toast.error('Giảm giá không hợp lệ! Yêu cầu tối thiểu 1.');
            return false;
        }
        else {
            return true;
        }
    },

    description: (description) => {
        if (description.length === 0) {
            toast.error('Bạn chưa nhập mô tả sản phẩm!');
            return false;
        }
        else {
            return true;
        }
    },
}

export default validateProduct;