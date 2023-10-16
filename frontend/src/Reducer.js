import { combineReducers } from 'redux';
import { BrowserRouter } from 'react-router-dom';

const createRootReducer = history =>
  combineReducers({
    router: BrowserRouter(history)
  });

export default createRootReducer;