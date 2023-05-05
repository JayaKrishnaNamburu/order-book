import { takeEvery, takeLatest, put, call, fork } from "redux-saga/effects";
import { ACTIONS } from "./actions";
import { eventChannel } from "redux-saga";

const DEFAULTS_ORDER_BOOK_CONSTANTS = {
  event: "subscribe",
  channel: "book",
  symbol: "tBTCUSD",
  freq: "F1",
  len: "25",
  subId: 123,
};

function* socketOpenHandler(messsage) {
  if (JSON.parse(messsage.data)?.event === "subscribed") {
    yield put({ type: ACTIONS.CONNECTION_SUCCESS });
    return;
  }

  yield put({
    type: ACTIONS.ORDER_BOOK_DATA,
    data: JSON.parse(messsage.data),
  });
}

function* connectToSocket(params) {
  const { precision = "P0" } = params?.data || {};
  const socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

  const channel = eventChannel((emit) => {
    socket.onmessage = (message) => {
      emit(message);
    };

    socket.onopen = (message) => {
      socket.send(
        JSON.stringify({ ...DEFAULTS_ORDER_BOOK_CONSTANTS, prec: precision })
      );
    };

    socket.onerror = (error) => {
      console.error(error);
    };

    return () => {
      socket.close();
    };
  });

  yield takeEvery(channel, socketOpenHandler);
  return socket;
}

function* changePrecision(params) {
  yield call(connectToSocket, params);
}

function* sagas() {
  yield takeLatest(ACTIONS.CONNECT, connectToSocket);
  yield takeLatest(ACTIONS.CHANGE_PRECISION, changePrecision);
}

export { sagas };
