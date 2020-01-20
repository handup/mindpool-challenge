import { combineReducers } from 'redux';
// Reducers
import { reducer as reduxAsyncConnect } from 'redux-connect';
import ui from './ui/ui';

export default combineReducers({
    reduxAsyncConnect,
    ui
});
