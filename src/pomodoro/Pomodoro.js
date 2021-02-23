import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import ChangeDuration from "./ChangeDuration";
import { minutesToDuration } from "../utils/duration";
import PlayPauseStop from "./PlayPauseStop";
import DurationBar from "./DurationBar";

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer starts out paused
  const [isStopped, setIsStopped] = useState(true); //true if stopped and false if play or pause
  const [timeLeft, setTimeLeft] = useState(0); //value of milliseconds remaining
  const [timeSinceStart, setTimeSinceStart] = useState(1); //time since initial play is clicked, or enter new session
  const [initial, setInitial] = useState(true); //value only gets changed once when play first clicked, and reset to true if stopped
  const [widthPercentage, setWidthPercentage] = useState(0); //width percentage from 0 to 100

  //durationMinutes function changes string to number to add minutes when changing durations
  function durationMinutes(durationString) {
    let minutes = durationString.slice(0, 2); //get first two characters
    minutes = parseInt(minutes); //convert string to an integer
    return minutes; //get minutes as an integer
  }

  //Set up focusDuration value to 25 minutes and set up function when buttons are clicked for changing focus duration
  const [focusDuration, setFocusDuration] = useState(minutesToDuration(25));
  //object with session name and duration
  const [session, setSession] = useState({
    name: "Focusing", //either Focusing or On Break
    duration: focusDuration, //either focusDuration or breakDuration
  });

  const focusDurationChange = ({ target }) => {
    //switch setup for duration changes and limits on times
    switch (true) {
      //case if duration limit bottom is met
      case focusDuration === "05:00" && target.id === "Minus":
        console.log("Cannot set focus time to zero");
        break;
      //case if top duration limit is met
      case focusDuration === "60:00" && target.id === "Plus":
        console.log("Cannot set focus time greater than 60");
        break;
      //case for adding by increment
      case target.id === "Plus":
        setFocusDuration((focusDuration) =>
          minutesToDuration(durationMinutes(focusDuration) + 5)
        );
        break;
      //case for subtracting by increment
      case target.id === "Minus":
        setFocusDuration((focusDuration) =>
          minutesToDuration(durationMinutes(focusDuration) - 5)
        );
        break;
      default:
        setFocusDuration(minutesToDuration(25));
    }
  };

  //Set up brakDuration value to 5 minutes and set up function when buttons are clicked for changing break duration
  const [breakDuration, setBreakDuration] = useState(minutesToDuration(5));
  const breakDurationChange = ({ target }) => {
    switch (true) {
      //case if duration limit bottom is met
      case breakDuration === "01:00" && target.id === "Minus":
        console.log("Cannot set break time to zero");
        break;
      //case if top duration limit is met
      case breakDuration === "15:00" && target.id === "Plus":
        console.log("Cannot set break time greater than 15");
        break;
      //case for adding by increment
      case target.id === "Plus":
        setBreakDuration((breakDuration) =>
          minutesToDuration(durationMinutes(breakDuration) + 1)
        );
        break;
      //case for subtracting by increment
      case target.id === "Minus":
        setBreakDuration((breakDuration) =>
          minutesToDuration(durationMinutes(breakDuration) - 1)
        );
        break;
      default:
        setBreakDuration(minutesToDuration(5));
    }
  };

  //function to initiate timer to focus duration time
  function initiate(initial) {
    if (initial) {
      //only call if true, should only be for a new session
      //new Audio(`${process.env.PUBLIC_URL}/alarm/foghorn.mp3`).play();
      setTimeLeft(() => durationMinutes(focusDuration) * 60);
      setInitial(() => false);
      setSession({
        name: "Focusing",
        duration: focusDuration,
      });
    }
  }
  //function for calculating percentage
  function widthPercentageCalc(timeSinceStart, focusDuration) {
    return (timeSinceStart * 10) / (durationMinutes(focusDuration) * 6);
  }
  useInterval(
    () => {
      if (session.name === "Focusing") {
        //set width percentage
        setWidthPercentage(() =>
          widthPercentageCalc(timeSinceStart, focusDuration)
        );
        //time since start of session
        setTimeSinceStart((timeSinceStart) => timeSinceStart + 1);
        //time left, subtract a second, started at duration value in seconds
        setTimeLeft((timeLeft) => timeLeft - 1);
        //end of focus session
        if (timeLeft <= 0) {
          new Audio(`${process.env.PUBLIC_URL}/alarm/foghorn.mp3`).play(); //play audio
          setTimeSinceStart(1); //start at one second
          setTimeLeft(() => durationMinutes(breakDuration) * 60); //new time left value to break duration
          setSession({ name: "On Break", duration: breakDuration });
        }
      }
      if (session.name === "On Break") {
        //set width percentage
        setWidthPercentage(() =>
          widthPercentageCalc(timeSinceStart, breakDuration)
        );
        //time since start of session
        setTimeSinceStart((timeSinceStart) => timeSinceStart + 1);
        //time left, subtract a second, started at duration value in seconds
        setTimeLeft((timeLeft) => timeLeft - 1);
        //end of break session
        if (timeLeft <= 0) {
          new Audio(`${process.env.PUBLIC_URL}/alarm/foghorn.mp3`).play(); //play audio
          setTimeSinceStart(1); //start at one second
          setTimeLeft(() => durationMinutes(focusDuration) * 60); //new time left value to focus duration
          setSession({ name: "Focusing", duration: focusDuration });
        }
      }
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    initiate(initial); //initiate function is called once when first played for each new session
    setIsTimerRunning((prevState) => !prevState); //toggle between play and pause
    setIsStopped(false); //set stop to false and unhide duration, bar, session, and enable stop button
  }

  function stopped() {
    setFocusDuration(focusDuration); //default to 25 minute focus
    setBreakDuration(breakDuration); //default to 5 minute break
    setIsTimerRunning(false); //timer is stopped
    setIsStopped(true); //true
    setInitial(true); //true
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {focusDuration}
            </span>
            <ChangeDuration
              handleDurationChange={focusDurationChange}
              isStopped={isStopped}
              timerRunning={isTimerRunning}
              dataTestId="focus"
            />
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {breakDuration}
              </span>
              <ChangeDuration
                handleDurationChange={breakDurationChange}
                isStopped={isStopped}
                timerRunning={isTimerRunning}
                dataTestId="break"
              />
            </div>
          </div>
        </div>
      </div>
      <PlayPauseStop
        isTimerRunning={isTimerRunning}
        isStopped={isStopped}
        handlePlayPause={playPause}
        handleStop={stopped}
      />
      <DurationBar
        isStopped={isStopped}
        session={session}
        timeLeft={timeLeft}
        widthPercentage={widthPercentage}
        isPaused={isTimerRunning}
      />
    </div>
  );
}

export default Pomodoro;
