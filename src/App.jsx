import Footer from "./Footer";
import {
  selectIsConnectedToRoom,
  selectLocalPeerID,
  useHMSActions,
  HMSNotificationTypes,
  useHMSStore,
  useHMSNotifications,
} from "@100mslive/react-sdk";
import React, { useEffect, useState } from "react";
import JoinForm from "./JoinForm";
import Conference from "./Conference";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PollForm from "./Components/Poll/PollForm";
import { Button } from "@100mslive/roomkit-react";
import "./App.css";
import ViewPoll from "./Components/Poll/ViewPoll";
export default function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const localPeerID = useHMSStore(selectLocalPeerID);
  const notification = useHMSNotifications();
  // const { pollInView: pollID, widgetView, setWidgetState } = useWidgetState();

  const [pollFormIsShown, setPollFormIsShownn] = useState(false);

  const [pollModalIsShown, setPollModalIsShown] = useState(false);
  const [pollNotificationData, setPollNotificationData] = useState();

  const showPollFormHandler = () => {
    setPollFormIsShownn(true);
  };

  const hidePollFormHandler = () => {
    setPollFormIsShownn(false);
  };

  const showPollModalHandler = () => {
    setPollModalIsShown(true);
  };

  const hidePollModalHandler = () => {
    setPollModalIsShown(false);
  };

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  useEffect(() => {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case HMSNotificationTypes.POLL_STARTED:
        if (notification.data.startedBy !== localPeerID) {
          console.log("NOTIFICATION RECEIVED");
          console.log(notification.data);
          setPollNotificationData(notification.data);
          toast(`A new Poll is available: ${notification.data.title}!`);
        }
        break;
      default:
        break;
    }
  }, [notification]);

  return (
    <div className="App">
      {isConnected ? (
        <>
          <ToastContainer />
          {pollFormIsShown && <PollForm onClose={hidePollFormHandler} />}
          {pollModalIsShown && (
            <ViewPoll
              pollNotificationData={pollNotificationData}
              onClose={hidePollModalHandler}
            />
          )}
          <Conference />
          <Footer />
          <div className="poll-div">
            <Button onClick={showPollFormHandler}>Create Poll</Button>
            <Button onClick={showPollModalHandler}>View Poll</Button>
          </div>
          {/* <Voting toggleVoting={toggleWidget} id={pollID} /> */}
        </>
      ) : (
        <JoinForm />
      )}
    </div>
  );
}
