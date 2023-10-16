import React from "react";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import { routerMiddleware } from "react-router-redux";
import { BrowserRouter } from "react-router-dom";

import rootReducer from "./Reducer";

const Root = ({ children, initialState = {} }) => {
  const history = createBrowserHistory();
  const middleware = [thunk, routerMiddleware(history)];

  const store = configureStore(
    rootReducer(history),
    initialState,
    applyMiddleware(...middleware)
  );

  return (
    <Provider store={store}>
      <BrowserRouter history={history}>{children}</BrowserRouter>
    </Provider>
  );
}

export default Root;