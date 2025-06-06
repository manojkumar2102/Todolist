const taskInput = document.getElementById("taskInput");
const reminderInput = document.getElementById("reminderTime");
const taskList = document.getElementById("taskList");

document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskText = taskInput.value.trim();
  const reminder = reminderInput.value;

  if (taskText === "") return;

  const task = {
    text: taskText,
    reminderTime: reminder
  };

  saveTask(task);
  createTaskElement(task);
  if (reminder) scheduleReminder(task);

  taskInput.value = "";
  reminderInput.value = "";
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.textContent = `${task.text}${task.reminderTime ? ' ⏰' : ''}`;
  li.onclick = () => li.classList.toggle("done");
  taskList.appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach(task => {
    createTaskElement(task);
    if (task.reminderTime) scheduleReminder(task);
  });
}

function scheduleReminder(task) {
  const reminderTime = new Date(task.reminderTime).getTime();
  const now = Date.now();
  const delay = reminderTime - now;

  if (delay > 0) {
    setTimeout(() => {
      showNotification(task.text);
    }, delay);
  }
}

function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification("🔔 Reminder", {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/942/942748.png"
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        showNotification(message);
      }
    });
  }
}
