import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import AddIcon from "@mui/icons-material/Add";
import "./style.css";
import Input from "@mui/material/Input";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PublicIcon from "@mui/icons-material/Public";
import { v4 as uuidv4 } from "uuid";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";

function Dashboard() {
  const [addListState, setAddListState] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [listItems, setListItems] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [addCardState, setAddCardState] = useState([]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  /**
   * Format of all the listItems
   {
    listName: "",
    cards: [""], // all the card messages
    listId: ejmene2nd
   }
   */

  const addNewList = () => {
    if (newListName === "") {
      setAlertType("error");
      setOpen(true);
      setAlertMessage("Please enter the list name!");
      return;
    }
    var t = listItems;
    setListItems([...t, { id: uuidv4(), cards: [], listName: newListName }]);
    setNewListName("");
    setAddListState(false);
    setAlertType("success");
    setOpen(true);
    setAlertMessage("List added successfully!");
    localStorage.setItem("ALL_LIST", JSON.stringify(listItems));
  };

  const removeList = (listId) => {
    var t = listItems.filter((item) => item.id !== listId);
    setListItems([...t]);
    localStorage.setItem("ALL_LIST", JSON.stringify(t));
  };

  const handleAddCard = (listId) => {
    var t = addCardState;
    setAddCardState([...t, listId]);
  };

  const removeAddCardState = (id) => {
    var t = [];

    for (let i = 0; i < addCardState.length; i++) {
      if (addCardState[i] != id) {
        t.push(addCardState[i]);
      }
    }

    setAddCardState([...t]);
  };

  const addCardInList = (id, mssg) => {
    var t = listItems;
    for (let i = 0; i < t.length; i++) {
      if (t[i].id == id) {
        t[i].cards.push({ id: uuidv4(), mssg: mssg });
        break;
      }
    }
    setListItems([...t]);
    removeAddCardState(id);
    localStorage.setItem("ALL_LIST", JSON.stringify(t));
  };

  useEffect(() => {
    var t = localStorage.getItem("ALL_LIST");
    var p = JSON.parse(t);
    if (p != undefined) setListItems([...p]);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    console.log(result);
    const { source, destination } = result;

    if (
      (source.droppableId === destination.droppableId) &
      (source.index === destination.index)
    ) {
      return;
    }

    var c1;
    var c2;

    var temp = listItems;

    for (let i = 0; i < listItems.length; i++) {
      if (source.droppableId == listItems[i].id) {
        c1 = listItems[i].cards;
        break;
      }
    }

    for (let i = 0; i < listItems.length; i++) {
      if (destination.droppableId == listItems[i].id) {
        c2 = listItems[i].cards;
        break;
      }
    }

    var t = c1[source.index];
    c1.splice(source.index, 1);
    c2.splice(destination.index, 0, t);

    for (let i = 0; i < temp.length; i++) {
      if (source.droppableId == temp[i].id) {
        temp[i].cards = c1;
        break;
      }
    }

    for (let i = 0; i < temp.length; i++) {
      if (destination.droppableId == temp[i].id) {
        temp[i].cards = c2;
        break;
      }
    }

    setListItems([...temp]);
    localStorage.setItem("ALL_LIST", JSON.stringify(temp));
  };

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <div className="dashboard_root_container">
        <NavBar />
        <Alert
          onClose={() => {}}
          elevation={0}
          style={{
            borderRadius: 0,
            backgroundColor: "#ffffff",
            fontWeight: "bold",
            color: "black",
          }}
          severity="info"
          icon={<PublicIcon style={{ color: "#61bd4f" }} />}
        >
          This board is set to public. Board admins can change its visibility
          setting at any time.{" "}
          <span style={{ textDecoration: "underline" }}>Learn more here</span>
        </Alert>

        {!addListState ? (
          <div className="addAnotherList" onClick={() => setAddListState(true)}>
            <span>
              <AddIcon />
            </span>
            <span>
              &nbsp;{" "}
              {listItems.length === 0 ? "Add new list" : "Add another list"}
            </span>
          </div>
        ) : (
          <div className="listNameInputBox">
            <Input
              autoFocus
              placeholder="Enter list title..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <button id="addlistbtn" onClick={() => addNewList()}>
                Add list
              </button>
              <CloseIcon onClick={() => setAddListState(false)} id="closebtn" />
            </div>
          </div>
        )}

        <div className="all_list_items">
          {listItems.map((item, index) => {
            return (
              <div className="list_container" key={item.id}>
                <Droppable droppableId={item.id} key={item.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <div className="list_title_wrapper">
                        <h3 className="list_title">{item.listName}</h3>
                        <span>
                          <DeleteIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => removeList(item.id)}
                          />
                        </span>
                      </div>
                      <div>
                        {item.cards.map((card, index2) => {
                          return (
                            <Draggable
                              draggableId={card.id}
                              index={index2}
                              key={card.id}
                            >
                              {(provided) => (
                                <div
                                  className="card_task"
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <h3 className="task_message">{card.mssg}</h3>
                                  {provided.placeholder}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>

                      {addCardState.find((ids) =>
                        item.id == ids ? true : false
                      ) ? (
                        <div>
                          <input
                            id={item.id}
                            autoFocus
                            placeholder="Enter a title for this card..."
                            style={{
                              border: "none",
                              paddingTop: "0.5rem",
                              paddingBottom: "0.5rem",
                              paddingLeft: "1rem",
                              fontSize: "0.9rem",
                              width: "90%",
                            }}
                          />
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <button
                              id="addlistbtn"
                              onClick={() =>
                                addCardInList(
                                  item.id,
                                  document.getElementById(item.id).value
                                )
                              }
                            >
                              Add card
                            </button>
                            <CloseIcon
                              id="closebtn"
                              onClick={() => removeAddCardState(item.id)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="add_Card"
                          onClick={() => handleAddCard(item.id)}
                        >
                          <AddIcon /> Add a card
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}

          <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={alertType}
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Dashboard;
