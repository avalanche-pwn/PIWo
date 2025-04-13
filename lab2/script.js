"use strict";
        
document.addEventListener('DOMContentLoaded', function() {
    const app = {
        lists: [
            { id: 1, name: 'Mało pilne', tasks: [], collapsed: false },
            { id: 2, name: 'Pilne', tasks: [], collapsed: false },
            { id: 3, name: 'Na wczoraj', tasks: [], collapsed: false }
        ],
        trash: null,
        nextId: 4,
        taskNextId: 1,
        currentTaskToDelete: null,
        currentListToDelete: null
    };
    
    const elements = {
        listsContainer: document.getElementById('listsContainer'),
        newListName: document.getElementById('newListName'),
        addListBtn: document.getElementById('addListBtn'),
        searchInput: document.getElementById('searchInput'),
        caseInsensitive: document.getElementById('caseInsensitive'),
        undoDeleteBtn: document.getElementById('undoDeleteBtn'),
        confirmationModal: new bootstrap.Modal(document.getElementById('confirmationModal')),
        taskToDeleteText: document.getElementById('taskToDeleteText'),
        confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
        listConfirmationModal: new bootstrap.Modal(document.getElementById('listConfirmationModal')),
        listToDeleteText: document.getElementById('listToDeleteText'),
        confirmListDeleteBtn: document.getElementById('confirmListDeleteBtn')
    };
    
    function init() {
        renderLists();
        setupEventListeners();
    }
    
    function renderLists() {
        elements.listsContainer.innerHTML = '';
        
        app.lists.forEach(list => {
            const listElement = document.createElement('div');
            listElement.className = 'col-md-4 mb-3';
            
            const listContainer = document.createElement('div');
            listContainer.className = 'list-container';
            listContainer.dataset.listId = list.id;
            
            const listHeader = document.createElement('div');
            listHeader.className = 'list-header';
            listHeader.innerHTML = `
                <h3>${list.name}</h3>
                <span>${list.collapsed ? '+' : '-'}</span>
            `;
            
            const deleteListBtn = document.createElement('button');
            deleteListBtn.className = 'delete-list-btn';
            deleteListBtn.innerHTML = '&times;';
            deleteListBtn.title = 'Usuń listę';
            
            const listContent = document.createElement('div');
            listContent.style.display = list.collapsed ? 'none' : 'block';
            
            const addTaskForm = document.createElement('div');
            addTaskForm.className = 'input-group mb-3';
            addTaskForm.innerHTML = `
                <input type="text" class="form-control new-task-input" placeholder="Nowe zadanie">
                <button class="btn btn-success add-task-btn">Dodaj</button>
            `;
            
            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'tasks-container';
            
            list.tasks.forEach(task => {
                if (shouldDisplayTask(task)) {
                    tasksContainer.appendChild(createTaskElement(task, list.id));
                }
            });
            
            listContent.appendChild(addTaskForm);
            listContent.appendChild(tasksContainer);
            listContainer.appendChild(listHeader);
            listHeader.appendChild(deleteListBtn);
            listContainer.appendChild(listContent);
            listElement.appendChild(listContainer);
            elements.listsContainer.appendChild(listElement);
        });
    }
    
    function createTaskElement(task, listId) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.dataset.taskId = task.id;
        
        const taskText = document.createElement('span');
        taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
        taskText.textContent = task.text;
        
        const taskDetails = document.createElement('div');
        taskDetails.className = 'd-flex align-items-center';
        
        if (task.completed) {
            const completionDate = document.createElement('span');
            completionDate.className = 'completion-date';
            completionDate.textContent = formatDate(task.completionDate);
            taskDetails.appendChild(completionDate);
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.innerHTML = '&times';
        
        taskDetails.appendChild(deleteBtn);
        taskElement.appendChild(taskText);
        taskElement.appendChild(taskDetails);
        
        taskText.addEventListener('click', () => toggleTaskCompletion(listId, task.id));
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteConfirmation(listId, task.id, task.text);
        });
        
        return taskElement;
    }
    
    function shouldDisplayTask(task) {
        const searchText = elements.searchInput.value.trim().toLowerCase();
        if (!searchText) return true;
        
        const taskText = task.text.toLowerCase();
        const caseInsensitive = elements.caseInsensitive.checked;
        
        if (caseInsensitive) {
            return taskText.includes(searchText.toLowerCase());
        } else {
            return task.text.includes(searchText);
        }
    }
    
    function toggleTaskCompletion(listId, taskId) {
        const list = app.lists.find(l => l.id === listId);
        if (!list) return;
        
        const task = list.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        task.completed = !task.completed;
        if (task.completed) {
            task.completionDate = new Date();
        } else {
            task.completionDate = null;
        }
        
        renderLists();
    }
    
    function showDeleteConfirmation(listId, taskId, taskText) {
        app.currentTaskToDelete = { listId, taskId };
        elements.taskToDeleteText.textContent = taskText;
        elements.confirmationModal.show();
    }
    
    function showListDeleteConfirmation(listId, listName) {
        app.currentListToDelete = listId;
        elements.listToDeleteText.textContent = listName;
        elements.listConfirmationModal.show();
    }
    
    function deleteTask(listId, taskId) {
        const list = app.lists.find(l => l.id === listId);
        if (!list) return;
        
        const taskIndex = list.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        const [deletedTask] = list.tasks.splice(taskIndex, 1);
        app.trash = { listId, task: deletedTask };
        elements.undoDeleteBtn.disabled = false;
        
        renderLists();
    }
    
    function deleteList(listId) {
        const listIndex = app.lists.findIndex(l => l.id === listId);
        if (listIndex === -1) return;
        
        app.lists.splice(listIndex, 1);
        renderLists();
    }
    
    function undoDelete() {
        if (!app.trash) return;
        
        const { listId, task } = app.trash;
        const list = app.lists.find(l => l.id === listId);
        if (list) {
            list.tasks.push(task);
            app.trash = null;
            elements.undoDeleteBtn.disabled = true;
            renderLists();
        }
    }
    
    function addNewList() {
        const listName = elements.newListName.value.trim();
        if (!listName) return;
        
        const newList = {
            id: app.nextId++,
            name: listName,
            tasks: [],
            collapsed: false
        };
        
        app.lists.push(newList);
        elements.newListName.value = '';
        renderLists();
    }
    
    function addNewTask(listId) {
        const list = app.lists.find(l => l.id === listId);
        if (!list) return;
        
        const input = document.querySelector(`.list-container[data-list-id="${listId}"] .new-task-input`);
        const taskText = input.value.trim();
        
        if (!taskText) return;
        
        const newTask = {
            id: app.taskNextId++,
            text: taskText,
            completed: false,
            completionDate: null
        };
        
        list.tasks.push(newTask);
        input.value = '';
        renderLists();
    }
    
    function formatDate(date) {
        if (!date) return '';
        return date.toLocaleString();
    }
    
    function handleKeyDown(e) {
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undoDelete();
        }
    }
    
    function setupEventListeners() {
        elements.addListBtn.addEventListener('click', addNewList);
        elements.newListName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addNewList();
        });
        
        elements.undoDeleteBtn.addEventListener('click', undoDelete);
        document.addEventListener('keydown', handleKeyDown);
        
        elements.confirmDeleteBtn.addEventListener('click', () => {
            if (app.currentTaskToDelete) {
                deleteTask(app.currentTaskToDelete.listId, app.currentTaskToDelete.taskId);
                elements.confirmationModal.hide();
            }
        });
        
        elements.confirmListDeleteBtn.addEventListener('click', () => {
            if (app.currentListToDelete) {
                deleteList(app.currentListToDelete);
                elements.listConfirmationModal.hide();
            }
        });
        
        elements.searchInput.addEventListener('input', renderLists);
        elements.caseInsensitive.addEventListener('change', renderLists);
        
        elements.listsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.list-header')) {
                const header = e.target.closest('.list-header');
                const listContainer = header.parentElement;
                const listId = parseInt(listContainer.dataset.listId);
                const list = app.lists.find(l => l.id === listId);
                
                if (list) {
                    list.collapsed = !list.collapsed;
                    renderLists();
                }
            }
            
            if (e.target.classList.contains('add-task-btn')) {
                const input = e.target.previousElementSibling;
                const listContainer = e.target.closest('.list-container');
                const listId = parseInt(listContainer.dataset.listId);
                
                const taskText = input.value.trim();
                if (taskText) {
                    addNewTask(listId);
                }
            }
            
            if (e.target.classList.contains('delete-list-btn')) {
                const listContainer = e.target.closest('.list-container');
                const listId = parseInt(listContainer.dataset.listId);
                const list = app.lists.find(l => l.id === listId);
                
                if (list) {
                    showListDeleteConfirmation(listId, list.name);
                }
            }
        });
    }
    
    init();
});
