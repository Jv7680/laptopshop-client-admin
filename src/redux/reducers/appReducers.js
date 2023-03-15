import { combineReducers } from 'redux';
import auth from './auth';

import loading from './loading';
import nameRole from './nameRole';
import dashboard from './dashboard'
import users from './users';
import products from './products';
import categories from './categories';
import producers from './producers';
import orders from './orders';
import revenue from './revenue';
import productsbestselling from './productsbestselling'
import news from './news';
import _new from './new';


const appReducers = combineReducers({
    auth,
    loading,
    nameRole,
    dashboard,
    users,
    products,
    categories,
    producers,
    orders,
    revenue,
    productsbestselling,
    news,
    _new,
})

export default appReducers;