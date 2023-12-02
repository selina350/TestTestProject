import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStep, editStep, getAllSteps } from "../../redux/model/stepSlice";
import { useNavigate } from "react-router-dom";
import { displayAlert } from "../../redux/controller/alertSlice";

const StepForm = ({ appId, stepId }) => {
  const step = useSelector((state) => state.model.steps[stepId]);

  const [name, setName] = useState(step?.name || "");
  const [nameError, setNameError] = useState(null);
  const [url, setUrl] = useState(step?.url || "");
  const [selector, setSelector] = useState(step?.selector || "");
  const [selectorError, setSelectorError] = useState(null);
  const [innerHTML, setInnerHTML] = useState(step?.innerHTML || "");
  const [innerHTMLError, setInnerHTMLError] = useState(null);
  const [type, setType] = useState(step?.type || "input");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const history = useHistory();
  const typeList = ["input", "buttonClick"];

  useEffect(() => {
    if (step !== undefined) {
      setName(step.name);
      // setUrl(step.url);
      setSelector(step.selector);
      setType(step.type);
    }
  }, [step]);

  useEffect(() => {
    setIsSubmitDisabled(nameError || selectorError);
  }, [name, selector, nameError, selectorError]);

  useEffect(() => {
    if (step === undefined) {
      setIsSubmitDisabled(true);
    }
  }, []);

  const nameInputValidation = (checkName) => {
    if (checkName === undefined || checkName.length === 0) {
      console.log("test", nameError);
      setNameError("Name is required.");
    } else if (checkName.length > 255) {
      setNameError("Name is too long.");
    } else {
      setNameError(null);
    }
  };

  const selectorInputValidation = (checkSelector) => {
    if (checkSelector === undefined || checkSelector.length === 0) {
      setSelectorError("Selector is required.");
    } else {
      setSelectorError(null);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    nameInputValidation(name);
    selectorInputValidation(selector);

    if (nameError || selectorError) {
      return;
    }
    let errors;
    if (stepId !== undefined) {
      //editing
      errors = await dispatch(
        editStep({
          id: stepId,
          applicaitonId: appId,
          name,
          selector,
          type,
        })
      );
    } else {
      //creation
      errors = await dispatch(
        createStep(appId, name, selector, type, innerHTML)
      );
    }

    if (!errors) {
      dispatch(
        displayAlert(stepId !== undefined ? "Step Edited" : "Step Created")
      );
      navigate(`/application/${appId}/steps`);
      //    history.push(`/${restaurantId}/manage/items`);
    } else {
      // Handle errors - API call encountered validation errors or other issues
      console.error("Error creating step:", errors);
      // You can display error messages to the user or handle them as needed.
    }
  };

  const cancelHandler = (e) => {
    setName("");
    setSelector("");
    // setUrl("");
    navigate(`/application/${appId}/steps`);
  };
  return (
    <div className="page-container">
      <div className="login-form-container">
        <div className=" form-wrapper">
          {stepId === undefined && <h1>Create New Step</h1>}
          {stepId !== undefined && <h1>Edit Step</h1>}
          <table>
            <tr>
              <td>
                <label>Name</label>
              </td>
              <td>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    console.log(nameError);
                    setName(e.target.value);
                    nameInputValidation(e.target.value);
                  }}
                />
                {nameError !== null && <div className="error">{nameError}</div>}
              </td>
            </tr>
            {/* <tr>
              <td>
                <label>Url</label>
              </td>
              <td>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                />
              </td>
            </tr> */}
            <tr>
              <td>
                <label>Type</label>
              </td>
              <td>
                <select
                  className="select"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                >
                  {typeList.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Selector</label>
              </td>
              <td>
                <input
                  type="text"
                  value={selector}
                  onChange={(e) => {
                    setSelector(e.target.value);
                    selectorInputValidation(e.target.value);
                  }}
                />
                {selectorError !== null && (
                  <div className="error">{selectorError}</div>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <label>innerHTML</label>
              </td>
              <td>
                <input
                  type="text"
                  value={innerHTML}
                  onChange={(e) => {
                    setInnerHTML(e.target.value);
                  }}
                />
              </td>
            </tr>
          </table>
          <div className="submit">
            <button
              className="cart-button auto-width"
              disabled={isSubmitDisabled}
              onClick={submitHandler}
            >
              Submit
            </button>
          </div>
          <div className="cancel-button">
            <button className="login-button auto-width" onClick={cancelHandler}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StepForm;
