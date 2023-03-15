import * as Types from '../../constants/ActionType';
let initialState = [];

const news = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCH_NEWS:
            state = action.products;
            return [...state];
        case Types.SEARCH_NEWS:
            state = action.products;
            return [...state];
        default: return [...state];
    }
};

export default news;