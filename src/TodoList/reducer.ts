import { makeVar } from "@apollo/client";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export const todos = makeVar<Array<Todo>>([]);

const localStorageTodos = JSON.parse(localStorage.getItem("todos") || "");

if (localStorageTodos?.length) {
  todos(localStorageTodos);
}

type Action = {
  type: "ADD_TODO" | "DELETE_TODO" | "EDIT_TODO_TITLE" | "SET_STATUS";
  payload?: { id: number; title?: string };
};

const setLocalStorageTodos = (todos: Array<Todo>) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

export const dispatch = (action: Action) => {
  switch (action.type) {
    case "ADD_TODO": {
      const item = {
        id: Date.now(),
        title: "",
        completed: false,
      };

      const newItems = [item, ...todos()];
      setLocalStorageTodos(newItems);
      return todos(newItems);
    }

    case "DELETE_TODO": {
      const filteredItems = todos().filter(
        (item) => item.id !== action.payload?.id
      );

      setLocalStorageTodos(filteredItems);
      return todos(filteredItems);
    }

    case "EDIT_TODO_TITLE": {
      const modifiedItems = todos().map((item: Todo) => {
        if (item.id === action.payload?.id) {
          item.title = action.payload?.title || "";
          return item;
        }

        return item;
      });

      todos(modifiedItems);
      setLocalStorageTodos(modifiedItems);
      return;
    }

    case "SET_STATUS": {
      const modifiedItems = todos().map((item) => {
        if (item.id === action.payload?.id) {
          item.completed = !item.completed;
          return item;
        }
        return item;
      });
      setLocalStorageTodos(modifiedItems);
      todos(modifiedItems);
      return;
    }

    default: {
      return todos();
    }
  }
};
