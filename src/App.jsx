import Footer from "./Footer";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import React, { useEffect } from "react";
import JoinForm from "./JoinForm";
import Conference from "./Conference";
import { Button } from "@100mslive/roomkit-react";

export default function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  // const { pollInView: pollID, widgetView, setWidgetState } = useWidgetState();

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  const handleCreate = async (id) => {
    console.log("POLL CREATED with ${id}");
    await hmsActions.interactivityCenter.addQuestionsToPoll(id, [
      {
        text: "Vote for your favourite creator",
        type: "single-choice",
        options: [
          {
            text: "Aditya ",
            isCorrectAnswer: false,
          },
          {
            text: "Thakur ",
            isCorrectAnswer: false,
          },
        ],
        skippable: true,
      },
      // {
      //   text: "Who is u?",
      //   type: "single-choice",
      //   options: [
      //     {
      //       text: "u ",
      //       isCorrectAnswer: false,
      //     },
      //     {
      //       text: "me",
      //       isCorrectAnswer: false,
      //     },
      //   ],
      //   skippable: true,
      // },
    ]);
    await hmsActions.interactivityCenter.startPoll(id);
  };

  return (
    <div className="App">
      {isConnected ? (
        <>
          <Conference />
          <Footer />
          <Button
            variant="primary"
            css={{ mt: "$10" }}
            onClick={async () => {
              const id = Date.now().toString();
              await hmsActions.interactivityCenter
                .createPoll({
                  id,
                  title: "Big Boss Inspired Poll",
                  type: "poll",

                  rolesThatCanViewResponses: ["host"],
                })
                .then(() => handleCreate(id))
                .catch((err) => console.log(err.message));
            }}
          >
            Create
          </Button>
          {/* <Voting toggleVoting={toggleWidget} id={pollID} /> */}
        </>
      ) : (
        <JoinForm />
      )}
    </div>
  );
}
