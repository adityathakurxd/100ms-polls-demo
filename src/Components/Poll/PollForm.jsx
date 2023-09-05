import Modal from ".././UI/Modal";
import { Button } from "@100mslive/roomkit-react";
import { useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import "../../styles.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PollForm = (props) => {
  const hmsActions = useHMSActions();
  const [inputs, setInputs] = useState({});

  const handleCreate = async (id) => {
    console.log("POLL CREATED with ${id}");
    await hmsActions.interactivityCenter.addQuestionsToPoll(id, [
      {
        text: inputs.text,
        type: "single-choice",
        options: [
          {
            text: inputs.first,
            isCorrectAnswer: false,
          },
          {
            text: inputs.second,
            isCorrectAnswer: false,
          },
        ],
        skippable: true,
      },
    ]);
    await hmsActions.interactivityCenter.startPoll(id);
    toast(`Poll has started!`);
    props.onClose();
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const id = Date.now().toString();
    await hmsActions.interactivityCenter
      .createPoll({
        id,
        title: inputs.name,
        type: "poll",
        rolesThatCanViewResponses: ["host"],
      })
      .then(() => handleCreate(id))
      .catch((err) => console.log(err.message));
  };
  return (
    <Modal onClose={props.onClose}>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a Name for the Poll:
          <div className="input-container">
            <input
              type="text"
              name="name"
              value={inputs.name || ""}
              onChange={handleChange}
            />
          </div>
        </label>
        <label>
          Enter a Title for the Poll:
          <div className="input-container">
            <input
              type="text"
              name="text"
              value={inputs.text || ""}
              onChange={handleChange}
            />
          </div>
        </label>
        <label>
          Enter the First Value:
          <div className="input-container">
            <input
              type="text"
              name="first"
              value={inputs.first || ""}
              onChange={handleChange}
            />
          </div>
        </label>
        <label>
          Enter the Second Value:
          <div className="input-container">
            <input
              type="text"
              name="second"
              value={inputs.second || ""}
              onChange={handleChange}
            />
          </div>
        </label>
        <input type="submit" />
      </form>
    </Modal>
  );
};
export default PollForm;
