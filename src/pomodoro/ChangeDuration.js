//ChangeFocusDuration.js
import React from "react";

function ChangeDuration({ handleDurationChange, isStopped, dataTestId }) {
  return (
    <div className="input-group-append">
      {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
      <button
        type="button"
        className="btn btn-secondary"
        data-testid={"decrease-" + dataTestId}
        id="Minus"
        disabled={!isStopped}
        onClick={handleDurationChange}
      >
        <span className="oi oi-minus" />
      </button>
      {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
      <button
        type="button"
        className="btn btn-secondary"
        data-testid={"increase-" + dataTestId}
        id="Plus"
        disabled={!isStopped}
        onClick={handleDurationChange}
      >
        <span className="oi oi-plus" />
      </button>
    </div>
  );
}

export default ChangeDuration;
