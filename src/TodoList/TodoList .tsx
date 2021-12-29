import * as React from "react";

import { useReactiveVar } from "@apollo/client";
import { dispatch, todos } from "./reducer";
import { MdDeleteForever } from "react-icons/md";
import { GrCheckboxSelected, GrCheckbox, GrAddCircle } from "react-icons/gr";
import "./TodoList.css";

export interface Props {}

export function TodoList(props: Props) {
  const todoList = useReactiveVar(todos);

  const addTodo = () => {
    dispatch({ type: "ADD_TODO" });
  };

  const onDelete = (id: number) => {
    dispatch({ type: "DELETE_TODO", payload: { id } });
  };

  const setCompleted = (id: number) => {
    dispatch({ type: "SET_STATUS", payload: { id } });
  };

  return (
    <div className="container">
      <div className="title">Todo list</div>

      <div className="listWrapper">
        <div onClick={addTodo} className="addButton">
          <div>
            <GrAddCircle
              style={{ width: "50px", height: "50px", marginLeft: 10 }}
            />
          </div>

          <div className="addTitle">ADD todo</div>
        </div>

        {todoList.map((el, i) => {
          return (
            <div className="todoItem" key={i}>
              <div className="todoInfo">
                <div className="index">{i}.</div>
                <div
                  className="checkboxContainer"
                  onClick={() => setCompleted(el.id)}
                >
                  {el?.completed ? <GrCheckboxSelected /> : <GrCheckbox />}
                </div>
                <InputText title={el.title} id={el.id} key={el.id} />
              </div>

              <div onClick={() => onDelete(el.id)}>
                <MdDeleteForever style={{ width: "25px", height: "25px" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const InputText = (props: { title: string; id: number }) => {
  const { id, title } = props;

  const [text, setText] = React.useState<string>(title || "");

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    dispatch({
      type: "EDIT_TODO_TITLE",
      payload: { id, title: event.target.value },
    });
  };

  return (
    <input
      className="input"
      value={text}
      onChange={onTextChange}
      placeholder="Add todo..."
    />
  );
};
