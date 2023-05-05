import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "./actions";
import { AVAILABLE_PREVISIONS } from "./helpers";

function App() {
  const [precision, setPrecision] = useState(AVAILABLE_PREVISIONS.P0);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.orders.status);
  const orders = useSelector((state) => state.orders.records);

  useEffect(() => {
    dispatch({ type: ACTIONS.CONNECT, data: { precision } });

    return () => {
      dispatch({ type: ACTIONS.DISCONNECT });
    };
  }, []);

  const handlePrecisionChange = (ev) => {
    if (!ev?.target) {
      return;
    }

    setPrecision(ev.target.value);
    dispatch({ type: ACTIONS.CHANGE_PRECISION, data: { precision } });
  };

  const handleCloseSocket = () => {
    dispatch({ type: ACTIONS.DISCONNECT });
  };

  return (
    <div className="App">
      <div className="socket_status_indicator">
        <div>Socket Connection</div>
        <div
          className="indicator"
          style={{ background: status === "CONNECTED" ? "green" : "red" }}
        ></div>
      </div>
      <div className="socket_status_indicator">
        Current Precisions
        <select value={precision} onChange={handlePrecisionChange}>
          {Object.values(AVAILABLE_PREVISIONS).map((pre) => {
            return <option key={pre}>{pre}</option>;
          })}
        </select>
      </div>
      <div className="socket_status_indicator">
        <button onClick={handleCloseSocket}>Disconnect</button>
      </div>
      <ul className="order_table">
        <li className="order_table_item">
          <div>Count</div>
          <div>Price</div>
          <div>Amount</div>
        </li>
        {/* TODO: Replace with react-virtualized */}
        {orders.map((order, index) => {
          const [price, count, amount] = order;
          const total = price + count + amount;
          const percentage = amount / total;

          return (
            <li
              key={index}
              className="order_table_item"
              style={{ background: percentage > 0 ? "#447a44" : "#d65d5d" }}
            >
              <div>{count}</div>
              <div>{price}</div>
              <div>{amount}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
