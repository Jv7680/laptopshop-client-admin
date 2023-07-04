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
        if (discount < 0) {
            toast.error('Giảm giá không hợp lệ! Yêu cầu tối thiểu 0.');
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

    cpu: (cpu) => {
        if (!cpu || cpu.length === 0) {
            toast.error('Bạn chưa nhập tên cpu!');
            return false;
        }
        else {
            return true;
        }
    },

    cpuCore: (cpuCore) => {
        if (!cpuCore || cpuCore.length === 0) {
            toast.error('Bạn chưa nhập số nhân cpu!');
            return false;
        }
        else {
            return true;
        }
    },

    cpuThread: (cpuThread) => {
        if (!cpuThread || cpuThread.length === 0) {
            toast.error('Bạn chưa nhập số luồng cpu!');
            return false;
        }
        else {
            return true;
        }
    },

    cpuSpeed: (cpuSpeed) => {
        if (!cpuSpeed || cpuSpeed.length === 0) {
            toast.error('Bạn chưa nhập tốc độ cpu!');
            return false;
        }
        else {
            return true;
        }
    },

    cache: (cache) => {
        if (!cache || cache.length === 0) {
            toast.error('Bạn chưa nhập cache!');
            return false;
        }
        else {
            return true;
        }
    },

    harddriveCapacity: (harddriveCapacity) => {
        if (!harddriveCapacity || harddriveCapacity.length === 0) {
            toast.error('Bạn chưa nhập dung lượng ổ cứng!');
            return false;
        }
        else {
            return true;
        }
    },

    harddriveType: (harddriveType) => {
        if (!harddriveType || harddriveType.length === 0) {
            toast.error('Bạn chưa nhập loại ổ cứng!');
            return false;
        }
        else {
            return true;
        }
    },

    ram: (ram) => {
        if (!ram || ram.length === 0) {
            toast.error('Bạn chưa nhập dung lượng RAM!');
            return false;
        }
        else {
            return true;
        }
    },

    ramType: (ramType) => {
        if (!ramType || ramType.length === 0) {
            toast.error('Bạn chưa nhập loại RAM!');
            return false;
        }
        else {
            return true;
        }
    },

    ramBus: (ramBus) => {
        if (!ramBus || ramBus.length === 0) {
            toast.error('Bạn chưa nhập BUS RAM!');
            return false;
        }
        else {
            return true;
        }
    },

    screenSize: (screenSize) => {
        if (!screenSize || screenSize.length === 0) {
            toast.error('Bạn chưa nhập kích thước màn hình!');
            return false;
        }
        else {
            return true;
        }
    },

    screenResolution: (screenResolution) => {
        if (!screenResolution || screenResolution.length === 0) {
            toast.error('Bạn chưa nhập độ phân giải màn hình!');
            return false;
        }
        else {
            return true;
        }
    },

    screenFrequency: (screenFrequency) => {
        if (!screenFrequency || screenFrequency.length === 0) {
            toast.error('Bạn chưa nhập tần số quét màn hình!');
            return false;
        }
        else {
            return true;
        }
    },

    graphicCard: (graphicCard) => {
        if (!graphicCard || graphicCard.length === 0) {
            toast.error('Bạn chưa nhập tên card đồ họa!');
            return false;
        }
        else {
            return true;
        }
    },

    audioTechnology: (audioTechnology) => {
        if (!audioTechnology || audioTechnology.length === 0) {
            toast.error('Bạn chưa nhập công nghệ âm thanh!');
            return false;
        }
        else {
            return true;
        }
    },

    weight: (weight) => {
        if (!weight || weight.length === 0) {
            toast.error('Bạn chưa khối lượng!');
            return false;
        }
        else {
            return true;
        }
    },

    shellMaterial: (shellMaterial) => {
        if (!shellMaterial || shellMaterial.length === 0) {
            toast.error('Bạn chưa nhập chất liệu vỏ máy!');
            return false;
        }
        else {
            return true;
        }
    },

    battery: (battery) => {
        if (!battery || battery.length === 0) {
            toast.error('Bạn chưa nhập dung lượng pin!');
            return false;
        }
        else {
            return true;
        }
    },

    operatingSystem: (operatingSystem) => {
        if (!operatingSystem || operatingSystem.length === 0) {
            toast.error('Bạn chưa nhập hệ điều hành!');
            return false;
        }
        else {
            return true;
        }
    },

    releaseYear: (releaseYear) => {
        if (!releaseYear || releaseYear.length === 0) {
            toast.error('Bạn chưa nhập năm sản xuất!');
            return false;
        }
        else {
            return true;
        }
    },
}

export default validateProduct;