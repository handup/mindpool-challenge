const types = {
    SET_SETTING: 'mindpool/ui/settings/SET_SETTING'
};

export const initialState = {
};

export function setSetting(settings={}) {
    return {
        ...settings,
        type: types.SET_SETTING
    };
}

export const actions = {
    setSetting
};

export default function reducer(state = initialState, action = {}) {
    let actionCopy = {...action};
    delete actionCopy.type;

    switch (action.type) {
        case types.SET_SETTING:
            return {
                ...state,
                ...actionCopy
            };
        default:
            return state;
    }
}