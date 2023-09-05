import Modal from "../UI/Modal";
import { useState } from "react";
import { Button } from "@100mslive/roomkit-react";
import { useHMSActions } from "@100mslive/react-sdk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPoll = (props) => {
  const actions = useHMSActions();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState();

  function handleChange(event) {
    setSelectedOptionIndex(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    await actions.interactivityCenter.addResponsesToPoll(
      props.pollNotificationData.id,
      [
        {
          questionIndex: props.pollNotificationData.questions[0].index,
          option: Number(selectedOptionIndex),
        },
      ]
    );

    toast(`Vote done!`);
    props.onClose();
  };

  return (
    <Modal onClose={props.onClose}>
      <h1>Poll: {props.pollNotificationData.title}</h1>

      <h3>{props.pollNotificationData.questions[0].text}</h3>

      <form onSubmit={handleSubmit}>
        <div className="radio">
          <label>
            <input
              type="radio"
              value={props.pollNotificationData.questions[0].options[0].index}
              checked={Number(selectedOptionIndex) === 1}
              onChange={handleChange}
            />
            {props.pollNotificationData.questions[0].options[0].text}
          </label>
        </div>

        <div className="radio">
          <label>
            <input
              type="radio"
              value={props.pollNotificationData.questions[0].options[1].index}
              checked={Number(selectedOptionIndex) === 2}
              onChange={handleChange}
            />
            {props.pollNotificationData.questions[0].options[1].text}
          </label>
        </div>

        <br />
        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
};
export default ViewPoll;
