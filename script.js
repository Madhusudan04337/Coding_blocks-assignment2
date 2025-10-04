document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskForm = document.getElementById('add-task-form');
    const searchInput = document.getElementById('search-input');
    const taskList = document.getElementById('task-list');
    const sortButton = document.getElementById('sort-button');
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const pendingTasksEl = document.getElementById('pending-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task =>
            task.text.toLowerCase().includes(searchTerm)
        );

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li style="text-align:center; color: #777;">No tasks found.</li>';
        } else {
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.dataset.id = task.id;

                const taskText = document.createElement('span');
                taskText.className = 'task-text';
                taskText.textContent = task.text;
                taskText.setAttribute('contenteditable', 'false');

                const taskActions = document.createElement('div');
                taskActions.className = 'task-actions';
                
                const completeBtn = document.createElement('button');
                completeBtn.textContent = '✓';
                completeBtn.className = 'complete-btn';

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.className = 'edit-btn';

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-btn';
                
                taskActions.append(completeBtn, editBtn, deleteBtn);
                li.append(taskText, taskActions);
                taskList.appendChild(li);
            });
        }
        updateCounter();
        saveTasks();
    };

    const updateCounter = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        totalTasksEl.textContent = totalTasks;
        completedTasksEl.textContent = completedTasks;
        pendingTasksEl.textContent = pendingTasks;
    };

    const addTask = (text) => {
        const newTask = { id: Date.now(), text: text, completed: false };
        tasks.push(newTask);
        renderTasks();
    };

    const toggleComplete = (id) => {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        renderTasks();
    };

    const deleteTask = (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        }
    };
    
    const handleEdit = (li, taskTextEl, editBtn) => {
        const isEditing = taskTextEl.getAttribute('contenteditable') === 'true';
        const taskId = Number(li.dataset.id);

        if (isEditing) {
            taskTextEl.setAttribute('contenteditable', 'false');
            editBtn.textContent = 'Edit';
            editBtn.style.backgroundColor = '#ffc107';
            tasks = tasks.map(task => 
                task.id === taskId ? { ...task, text: taskTextEl.textContent.trim() } : task
            );
            renderTasks();
        } else {
            taskTextEl.setAttribute('contenteditable', 'true');
            taskTextEl.focus();
            editBtn.textContent = 'Save';
            editBtn.style.backgroundColor = '#28a745';
        }
    };

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    taskList.addEventListener('click', (e) => {
        const li = e.target.closest('.task-item');
        if (!li) return;

        const taskId = Number(li.dataset.id);
        
        if (e.target.matches('.complete-btn')) {
            toggleComplete(taskId);
        } else if (e.target.matches('.delete-btn')) {
            deleteTask(taskId);
        } else if (e.target.matches('.edit-btn')) {
            const taskTextEl = li.querySelector('.task-text');
            handleEdit(li, taskTextEl, e.target);
        }
    });
    
    searchInput.addEventListener('input', renderTasks);
    
    sortButton.addEventListener('click', () => {
        tasks.sort((a, b) => a.text.localeCompare(b.text));
        renderTasks();
    });

    renderTasks();
});