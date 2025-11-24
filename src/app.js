const storageKey = "kanbanTasks";
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const taskTemplate = document.getElementById("task-template");
const columns = document.querySelectorAll(".task-list");

function loadTasks() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to parse tasks", error);
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function createTask(task) {
  const clone = taskTemplate.content.firstElementChild.cloneNode(true);
  clone.dataset.id = task.id;
  clone.querySelector(".task-title").textContent = task.title;
  clone.querySelector(".task-description").textContent = task.description || "No description";

  clone.addEventListener("dragstart", handleDragStart);
  clone.addEventListener("dragend", handleDragEnd);

  clone.querySelector(".edit").addEventListener("click", () => editTask(task.id));
  clone.querySelector(".delete").addEventListener("click", () => deleteTask(task.id));

  return clone;
}

function renderColumn(status, tasks) {
  const container = document.querySelector(`.task-list[data-status="${status}"]`);
  container.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "No tasks yet";
    container.appendChild(empty);
    return;
  }

  tasks.forEach((task) => container.appendChild(createTask(task)));
}

function renderBoard(tasks) {
  renderColumn("todo", tasks.filter((task) => task.status === "todo"));
  renderColumn("in-progress", tasks.filter((task) => task.status === "in-progress"));
  renderColumn("done", tasks.filter((task) => task.status === "done"));
}

function addTask(event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  if (!title) return;

  const tasks = loadTasks();
  const newTask = {
    id: crypto.randomUUID(),
    title,
    description,
    status: "todo",
  };

  tasks.push(newTask);
  saveTasks(tasks);
  renderBoard(tasks);
  taskForm.reset();
  titleInput.focus();
}

function editTask(id) {
  const tasks = loadTasks();
  const task = tasks.find((entry) => entry.id === id);
  if (!task) return;

  const newTitle = prompt("Update task title", task.title)?.trim();
  if (!newTitle) return;
  const newDescription = prompt("Update description", task.description)?.trim() ?? "";

  task.title = newTitle;
  task.description = newDescription;
  saveTasks(tasks);
  renderBoard(tasks);
}

function deleteTask(id) {
  const tasks = loadTasks();
  const nextTasks = tasks.filter((task) => task.id !== id);
  saveTasks(nextTasks);
  renderBoard(nextTasks);
}

let draggedTaskId = null;

function handleDragStart(event) {
  draggedTaskId = event.currentTarget.dataset.id;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedTaskId);
}

function handleDragEnd() {
  draggedTaskId = null;
  columns.forEach((col) => col.parentElement.classList.remove("drag-over"));
}

function handleDrop(event) {
  event.preventDefault();
  const targetStatus = event.currentTarget.dataset.status;
  if (!draggedTaskId || !targetStatus) return;

  const tasks = loadTasks();
  const task = tasks.find((entry) => entry.id === draggedTaskId);
  if (!task) return;

  task.status = targetStatus;
  saveTasks(tasks);
  renderBoard(tasks);
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  event.currentTarget.parentElement.classList.add("drag-over");
}

function handleDragLeave(event) {
  event.currentTarget.parentElement.classList.remove("drag-over");
}

function attachColumnEvents() {
  columns.forEach((col) => {
    col.addEventListener("dragover", handleDragOver);
    col.addEventListener("dragleave", handleDragLeave);
    col.addEventListener("drop", handleDrop);
  });
}

function init() {
  attachColumnEvents();
  taskForm.addEventListener("submit", addTask);
  renderBoard(loadTasks());
}

init();
