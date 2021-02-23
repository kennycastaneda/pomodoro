//DurationBar.js
import React from "react";
import { secondsToDuration } from "../utils/duration";

function DurationBar({
  isStopped,
  session,
  timeLeft,
  widthPercentage,
  isPaused,
}) {
  return (
    <div hidden={isStopped}>
      {/* TODO: This area should show only when a focus or break session is running or pauses */}
      <div className="row mb-2">
        <div className="col">
          {/* TODO: Update message below to include current session (Focusing or On Break) and total duration */}
          <h2 data-testid="session-title">
            {session.name} for {session.duration} minutes
          </h2>
          {/* TODO: Update message below to include time remaining in the current session */}
          <p className="lead" data-testid="session-sub-title">
            {secondsToDuration(timeLeft)} remaining
          </p>
          <h2 data-testid="session-paused" hidden={isPaused}>
            PAUSED
          </h2>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col">
          <div className="progress" style={{ height: "20px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={widthPercentage} // TODO: Increase aria-valuenow as elapsed time increases
              style={{ width: `${widthPercentage}%` }} // TODO: Increase width % as elapsed time increases
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DurationBar;
