import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { actShowLoading, actHiddenLoading } from './loading'

export const actFetchProducersRequest = () => {

  return dispatch => {
    dispatch(actShowLoading());
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem('_auth');
      callApi('admin/supplier/all', 'GET', null, token)
        .then(res => {
          if (res && res.status === 200) {
            dispatch(actFetchProducers(res.data));
            resolve(res.data);
            setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
          setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
        });
    });
  };
};

export const actFetchProducers = (producers) => {
  return {
    type: Types.FETCH_PRODUCERS,
    producers
  }
}

export const actAddProducerRequest = (data) => {
  return async dispatch => {
    let token = localStorage.getItem('_auth');
    const res = await callApi('admin/supplier', 'POST', data, token);
    if (res && res.status === 200) {
      toast.success('Thêm nhà cung cấp thành công')
      //dispatch(actAddProducer(res.data));
    }
    return res
  }
}

export const actAddProducer = (data) => {
  return {
    type: Types.ADD_PRODUCER,
    data
  }
}

export const actDeleteProducerRequest = (id) => {
  return async dispatch => {
    let token = localStorage.getItem('_auth');
    await callApi(`admin/supplier/delete/${id}`, 'PUT', null, token);
    dispatch(actFetchProducersRequest());
  }
}

export const actDeleteProducer = (id) => {
  return {
    type: Types.REMOVE_PRODUCER,
    id
  }
}

export const actEditProducerRequest = (id, data) => {
  return async dispatch => {
    let token = localStorage.getItem('_auth');
    const res = await callApi(`admin/supplier/update/${id}`, 'PUT', data, token);
    if (res && res.status === 200) {
      toast.success('Sửa nhà cung cấp thành công')
      //dispatch(actEditProducer(res.data));
    }
  }
}

export const actEditProducer = (data) => {
  return {
    type: Types.EDIT_PRODUCER,
    data
  }
}
