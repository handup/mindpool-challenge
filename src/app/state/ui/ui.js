import { combineReducers } from 'redux';
// Reducers
import browser from './browser';
import settings from './settings';

export default combineReducers({
    browser,
    settings
});
