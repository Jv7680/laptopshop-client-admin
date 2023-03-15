import React from 'react';
import Login from './components/Login/Login';
import UserPage from './pages/UserPage';
import DashboardPage from './pages/DashBoardPage'
import ProductPage from './pages/ProductPage';
import ActionProductPage from './pages/ActionProductPage';
import ProducerPage from './pages/ProducerPage';
import ActionProducerPage from './pages/ActionProducerPage';
import ActionOrderPage from './pages/ActionOrderPage';
import ActionUserPage from './pages/ActionUserPage';
import OrderPage from './pages/OrderPage';
import OrderStatus2Page from './pages/OrderStatus2Page';
import OrderStatus3Page from './pages/OrderStatus3Page';
import OrderStatus4Page from './pages/OrderStatus4Page';
import OrderStatus5Page from './pages/OrderStatus5Page';
import NewPage from './pages/NewPage';
import ActionNew from './components/Content/New/ActionNew';

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <DashboardPage />
    },
    {
        path: '/login',
        exact: false,
        main: () => <Login />
    },
    {
        path: '/customers',
        exact: true,
        main: () => <UserPage />
    },
    {
        path: '/customers/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionUserPage match={match} history={history} />
    },
    {
        path: '/orders/status1',
        exact: true,
        main: () => <OrderPage />
    },
    {
        path: '/orders/status2',
        exact: true,
        main: () => <OrderStatus2Page />
    },
    {
        path: '/orders/status3',
        exact: true,
        main: () => <OrderStatus3Page />
    },
    {
        path: '/orders/status4',
        exact: true,
        main: () => <OrderStatus4Page />
    },
    {
        path: '/orders/status5',
        exact: true,
        main: () => <OrderStatus5Page />
    },
    {
        path: '/orders/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionOrderPage match={match} history={history} />
    },
    {
        path: '/products',
        exact: true,
        main: ({ match }) => <ProductPage match={match} />
    },
    {
        path: '/products/add',
        exact: false,
        main: ({ history }) => <ActionProductPage history={history} />
    },
    {
        path: '/products/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionProductPage match={match} history={history} />
    },
    {
        path: '/producers',
        exact: true,
        main: () => <ProducerPage />
    },
    {
        path: '/producers/add',
        exact: false,
        main: ({ history }) => <ActionProducerPage history={history} />
    },
    {
        path: '/producers/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionProducerPage match={match} history={history} />
    },
    {
        path: '/news',
        exact: true,
        main: () => <NewPage />
    },
    {
        path: '/news/add',
        exact: false,
        main: ({ match, history }) => <ActionNew match={match} history={history} />
    },
    {
        path: '/news/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionNew match={match} history={history} />
    }

]

export default routes;