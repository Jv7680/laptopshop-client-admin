import { toast } from 'react-toastify';

const validateNew = {
    title: (title) => {
        if (title.length === 0) {
            toast.error('Bạn chưa nhập tiêu đề!');
            return false;
        }
        else {
            return true;
        }
    },

    content: (content) => {
        if (content.length === 0) {
            toast.error('Bạn chưa nhập nội dung!');
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

export default validateNew;