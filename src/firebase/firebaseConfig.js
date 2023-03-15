
// import firebase from "firebase/app";

// const firebaseConfig = {
//     apiKey: "AIzaSyBYyy8Fx87iwI3dHaKY2lnHG9gRJ6EtjDg",
//     authDomain: "react-image-storage-48250.firebaseapp.com",
//     projectId: "react-image-storage-48250",
//     storageBucket: "react-image-storage-48250.appspot.com",
//     messagingSenderId: "1024894166639",
//     appId: "1:1024894166639:web:e68bff42d59909df130f9a"
// };

// //Khởi tạo
// firebase.initializeApp(firebaseConfig);


// const storage = firebase.storage();

// export {
//     storage, firebase as default
// }


// Khởi tạo firebase app
import { initializeApp } from "firebase/app";
//Sử dụng storage
import { getStorage } from "firebase/storage";

//Cấu hình của firebase app
const firebaseConfig = {
    apiKey: "AIzaSyBYnbuZp6qJjWAEDT9pal22-Wzu-ZmFW7c",
    authDomain: "laptopshop-62485.firebaseapp.com",
    projectId: "laptopshop-62485",
    storageBucket: "laptopshop-62485.appspot.com",
    messagingSenderId: "752390540608",
    appId: "1:752390540608:web:28d4191e7a4e0d907efea5",
    measurementId: "G-RHZS59N6F3"
};

//Khởi tạo firebase app
const app = initializeApp(firebaseConfig);
//Tham chiếu đến storage của firebase app
export const storage = getStorage(app);
