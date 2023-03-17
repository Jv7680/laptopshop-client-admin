// Khởi tạo firebase app
import { initializeApp } from "firebase/app";
//Sử dụng storage
import { getStorage } from "firebase/storage";
//Sử dụng database
import { getDatabase } from "firebase/database";

//Cấu hình của firebase app
const firebaseConfig = {
    apiKey: "AIzaSyBYnbuZp6qJjWAEDT9pal22-Wzu-ZmFW7c",
    authDomain: "laptopshop-62485.firebaseapp.com",
    databaseURL: "https://laptopshop-62485-default-rtdb.firebaseio.com",
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
// Tham chiếu tới realtimeDB
export const realtimeDB = getDatabase(app);
