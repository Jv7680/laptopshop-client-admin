import axios from 'axios';
import * as Config from '../constants/Config';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import store from '..';
import { actFetchOrders } from '../redux/actions/order'
import { startLoading, stopLoading } from '../components/Loading/setLoadingState';

const MySwal = withReactContent(Swal)
toast.configure()

export default async function callApi(endpoint, method = 'GET', body, token) {
  startLoading();
  try {
    let data;
    console.log(token)

    if (token !== undefined && token !== null && token !== '') {
      console.log("Có token")
      data = await axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        headers: { Authorization: `${token}` },
        data: body
      });

      return data;
    } else {
      console.log("Không có token")
      console.log("Giá trị của body và endpoint: ", body, endpoint)
      data = await axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        data: body
      });

      return data;
    }
  }
  catch (err) {

    if (err.response && err.response.data) {
      console.log('callAPI error: ', err.response);
      const error = err.response.data.message || err.response.data[0].defaultMessage;

      //xử lý riêng các error của đơn hàng
      if (error === "Không có đơn hàng nào có trạng thái Đang chờ duyệt") {
        store.dispatch(actFetchOrders([]));
      }
      else if (error === "Không có đơn hàng nào có trạng thái Đã duyệt") {
        store.dispatch(actFetchOrders([]));
      }
      else if (error === "Không có đơn hàng nào có trạng thái Đang giao") {
        store.dispatch(actFetchOrders([]));
      }
      else if (error === "Không có đơn hàng nào có trạng thái Đã giao") {
        store.dispatch(actFetchOrders([]));
      }
      else if (error === "Không có đơn hàng nào có trạng thái Đã hủy") {
        store.dispatch(actFetchOrders([]));
      }
      else {
        MySwal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `${error}`
        })
      }

    } else {
      console.log('callAPI error: ', err);
      MySwal.fire({
        icon: 'error',
        title: 'Lỗi Server',
        text: 'không kết nối được với server!'
      })
    }
  }
  finally {
    stopLoading();
  }
}