import { configureStore, createSlice, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { sagas } from "./sagas";
import { ACTIONS } from "./actions";

const saga = createSagaMiddleware();
const middleware = [saga];

const orderSlice = createSlice({
  name: "app_slice",
  initialState: {
    status: "IDLE",
    records: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase({ type: ACTIONS.CONNECTION_SUCCESS }, (state, params) => {
        state.status = "CONNECTED";
      })
      .addCase({ type: ACTIONS.CHANGE_PRECISION }, (state) => {
        state.records = [];
        state.status = "IDLE";
      })
      .addCase({ type: ACTIONS.ORDER_BOOK_DATA }, (state, { data }) => {
        if (!Array.isArray(data)) {
          return;
        }
        const [_, points] = data;
        state.records.push(points);
      });
  },
});

const { reducer, actions } = orderSlice;

const rootReducer = combineReducers({ orders: reducer });
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
});

saga.run(sagas);
export { store, actions };
