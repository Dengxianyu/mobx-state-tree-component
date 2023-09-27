import React, { useEffect } from "react";
import { render } from "react-dom";
import { types, getSnapshot, Instance } from "mobx-state-tree";
import { observer } from "mobx-react-lite";

const randomId = () => Math.floor(Math.random() * 1000).toString(36);

const Todo = types
  .model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
  })
  .volatile((self) => ({
    onChange: (newName: string) => {

    }
  }))
  .actions(self => {
    function setName(newName: string) {
      self.name = newName;
    }

    function toggle() {
      self.done = !self.done;
    }

    function setOnChange(fn: (newName: string) => void) {
      self.onChange = fn
    }

    return { setName, toggle, setOnChange };
  });

const User = types.model({
  name: types.optional(types.string, "")
});

const RootStore = types
  .model({
    users: types.map(User),
    todos: types.map(Todo)
  })
  .actions(self => {
    function addTodo(id: string, name: string) {
      self.todos.set(id, Todo.create({ name }));
    }

    return { addTodo };
  });

const todo = Todo.create({
  name: "Eat a cake",
  done: true
})
todo.setOnChange((newName) => {
  console.log('1111', newName)
})

const store = RootStore.create({
  users: {},
  todos: {
    "1": todo
  }
});

const TodoView = observer((props: { todo: Instance<typeof Todo>}) => {
  console.log('TodoView render');
  return (<div>
    <input
      type="checkbox"
      checked={props.todo.done}
      onChange={e => props.todo.toggle()}
    />
    <input
      type="text"
      value={props.todo.name}
      onChange={e => {
        props.todo.setName(e.target.value)
        props.todo.onChange(e.target.value)
      }}
    />
  </div>
)});

const AppView = observer((props: { store: Instance<typeof RootStore>}) => {

  useEffect(() => {
    setTimeout(() => {
      // props.store.todos.get('1')?.setOnChange((newName) => {
      //   console.log('2222', newName)
      // })
      props.store.todos.get('1')?.setName('9009')
    }, 10 * 1000)
  }, [props.store.todos])
  return (
  <div>
    <button onClick={e => props.store.addTodo(randomId(), "New Task")}>
      Add Task
    </button>
    {[...props.store.todos.values()].map(todo => {
      // todo.setOnChange((newName) => {
      //   console.log('1111', newName)
      // })
      // setTimeout(() => {
      //   todo.setOnChange((newName) => {
      //     console.log('2222', newName)
      //   })
      // }, 10 * 1000)
      return (
      <TodoView todo={todo} />
    )})}
  </div>
)});

const Demo5 = observer(() => ( <AppView store={store} />))

export default Demo5
