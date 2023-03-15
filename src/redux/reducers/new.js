import * as Types from '../../constants/ActionType';
let initialState = [];

const _new = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCH_NEW:
            state = action.product;
            return { ...state };
        default: return { ...state };
    }
};

export default _new;