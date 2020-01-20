import {type as deviceType} from '../../../utilities/device';

const types = {
    SET_VIEWPORT: 'mindpool/ui/browser/SET_VIEWPORT',
    SET_DEVICE_TYPE: 'mindpool/ui/browser/SET_DEVICE_TYPE'
};

export const initialState = {
    viewport: {
        width: null,
        height: null
    },
    deviceType: 'mobile'
};

export function setViewport(dimensions) {
    return {
        type: types.SET_VIEWPORT,
        dimensions: dimensions
    };
}

export function setDeviceType(dimensions) {
    return {
        type: types.SET_DEVICE_TYPE,
        dimensions: dimensions
    };
}

export const actions = {
    setViewport,
    setDeviceType
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.SET_VIEWPORT:
            return {
                ...state,
                viewport: action.dimensions
            };
        case types.SET_DEVICE_TYPE:
            return {
                ...state,
                deviceType: deviceType(action.dimensions)
            };
        default:
            return state;
    }
}
