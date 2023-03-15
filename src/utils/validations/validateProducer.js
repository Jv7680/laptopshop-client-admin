import { toast } from 'react-toastify';

const validateProducer = {
    name: (name) => {
        if (name.length === 0) {
            toast.error('Bạn chưa nhập tên nhà cung cấp!');
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
}

export default validateProducer;