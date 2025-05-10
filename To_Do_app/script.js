const todoText = document.getElementById("todoText");
const listItems = document.getElementById("list-items");

function addTask() {
  const taskText = todoText.value.trim();
  if (taskText !== '') {
    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'delete';
    deleteBtn.addEventListener('click', deleteTask);

    li.appendChild(deleteBtn);
    listItems.appendChild(li);
    todoText.value = '';

    li.addEventListener('click', completeTask);
  }
}

function completeTask(event) {
  if (event.target.tagName !== 'BUTTON') {
    const task = event.target;
    task.classList.toggle('completed');
  }
}

function deleteTask(event) {
  const task = event.target.parentElement;
  listItems.removeChild(task);
}