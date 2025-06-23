const API_BASE_URL = 'http://localhost:5000/api/tasks'; // Your backend API endpoint

async function fetchTasks() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

async function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const tasks = await fetchTasks(); // Fetch tasks from the backend

    tasks.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleComplete(task._id, task.completed); // Pass task ID and current status

        const span = document.createElement("span");
        span.className = "task-text" + (task.completed ? " completed" : "");
        span.innerText = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.onclick = () => editTask(task._id, task.text); // Pass task ID and current text

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.className = "delete";
        deleteBtn.onclick = () => deleteTask(task._id); // Pass task ID

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
}

async function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    if (taskText !== "") {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: taskText })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            input.value = "";
            renderTasks(); // Re-render tasks after adding
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        renderTasks(); // Re-render tasks after deleting
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function editTask(id, currentText) {
    const newTaskText = prompt("Edit task:", currentText);
    if (newTaskText !== null && newTaskText.trim() !== "") {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newTaskText.trim() })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            renderTasks(); // Re-render tasks after editing
        } catch (error) {
            console.error('Error editing task:', error);
        }
    }
}

async function toggleComplete(id, currentCompletedStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !currentCompletedStatus }) // Toggle the status
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        renderTasks(); // Re-render tasks after toggling
    } catch (error) {
        console.error('Error toggling complete status:', error);
    }
}

// Initial render when the page loads
renderTasks();