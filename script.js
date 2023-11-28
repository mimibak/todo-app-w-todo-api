let todosArr = [];
let count = 0;
let filter = "all";
const newToDoInput = document.querySelector("#inputField");

readTodos(todosArr).then((jsonData) => {
  todosArr = jsonData;
  renderToDos();
});

function addToDo(event) {
  event.preventDefault();
  const newToDoText = newToDoInput.value;

  if (checkDuplis()) {
    const newToDo = {
      description: newToDoText,
      done: false,
    };
    newToDoInput.value = "";
    createToDo(newToDo).then((newToDoFromApi) => {
      todosArr.push(newToDoFromApi);
      renderToDos();
    });
  }
}

function renderToDos() {
  const toDoList = document.querySelector("#toDoList");
  toDoList.innerHTML = "";
  todosArr.forEach((ObjOfArr) => {
    const ListElement = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = ObjOfArr.done;
    checkbox.Obj = ObjOfArr;

    if (ObjOfArr.done) {
      ListElement.style = "text-decoration: line-through;";
    }

    checkbox.addEventListener("change", doneTask);

    const description = document.createTextNode(ObjOfArr.description);
    ListElement.appendChild(checkbox);
    ListElement.appendChild(description);

    toDoList.appendChild(ListElement);
    console.log(filter);
    if (filter === "all") {
      ListElement.hidden = false;
    } else if (filter === "open") {
      ListElement.hidden = ObjOfArr.done;
    } else if (filter === "done") {
      ListElement.hidden = !ObjOfArr.done;
    }
    console.log(ListElement.hidden);
  });
}

function doneTask(event) {
  const changedTodo = event.target.Obj;

  if (event.target.checked === true) {
    changedTodo.done = true;
    event.target.Obj.done = true;

    event.target.parentElement.style = "text-decoration: line-through;";
  } else {
    event.target.parentElement.style = "text-decoration: none;";
    changedTodo.done = false;
    event.target.Obj.done = false;
  }
  updateToDo(event.target.Obj.id, changedTodo); //event.target.Obj.id = Argument welches den Parameter (api.js) wiedergibt.
}

function createID(text) {
  return text.replaceAll(" ", "").toLowerCase() + Date.now();
}

const addBtn = document.querySelector("#addTodo");
addBtn.addEventListener("click", addToDo);

function checkDuplis() {
  for (let duplis of todosArr) {
    console.log(duplis.description.toLowerCase());
    if (newToDoInput.value.toLowerCase() === duplis.description.toLowerCase()) {
      alert("Wenn schon da, dann nix dazu!");
      return false;
    }
  }
  return true;
}

const radioBtn = document.querySelector("#radioBtn");
radioBtn.addEventListener("change", useFilter);

const open = document.querySelector("#openFilter");
const done = document.querySelector("#doneFilter");
const all = document.querySelector("#allFilter");

function useFilter(event) {
  if (event.target === open) {
    filter = "open";
    console.log(filter);
  } else if (event.target === done) {
    filter = "done";
    console.log(filter);
  } else if (event.target === all) {
    filter = "all";
    console.log(filter);
  }
  renderToDos();
}

const removeBtn = document.querySelector("#removeBtn");
removeBtn.addEventListener("click", deleteTodo);

function deleteTodo() {
  for (let deletedObj of todosArr) {
    if (deletedObj.done === true) {
      fetch("http://localhost:4730/todos/" + deletedObj.id, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Network response not ok!");
          }
        })
        .then(readTodos())
        .catch((error) => {
          alert(error.message);
        });
    }
  }
  renderToDos();
}

function removeToDoItem() {
  let fetches = [];
  for (const deletedToDo of state) {
    if (deletedToDo.done) {
      const todoID = deletedToDo.id;
      fetches.push(removeFromAPI(todoID));
    }
  }
  Promise.all(fetches).then((values) => {
    if (values.indexOf(undefined) != -1) {
      console.log(values);
      state = openTodos;
      renderToDos();
    }
  });
}
