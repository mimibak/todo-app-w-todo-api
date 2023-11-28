function readTodos() {
  return fetch("http://localhost:4730/todos").then((response) =>
    response.json()
  );
}

function createToDo(newToDo) {
  return fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newToDo),
  }).then((res) => res.json());
}

function updateToDo(id, changedTodo) {
  //id = Parameter - egal wie er genannt wird
  return fetch("http://localhost:4730/todos/" + id, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(changedTodo),
  });
}
