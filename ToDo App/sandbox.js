document.addEventListener('DOMContentLoaded', () => {
    const TodoList = document.querySelector('.todos');
    const addForm = document.querySelector('.add');
    const search = document.querySelector('.search').querySelector('input');

    // Load todos from localStorage on page load
    const loadTodos = () => {
        TodoList.innerHTML = '' ;
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach((todo) => generateTemplate(todo));
    };

    // Save todos to localStorage
    const saveTodos = () => {
        const todos = [];
        TodoList.querySelectorAll('li').forEach((li) => {
            todos.push(li.querySelector('span').textContent);
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Generate HTML template for a todo
    const generateTemplate = (todo) => {
        const htmlcode = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${todo}</span>
            <i class="far fa-trash-alt delete"></i>
        </li>
        `;
        TodoList.insertAdjacentHTML('beforeend', htmlcode);
    };

    // ADD A TODO
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const todo = addForm.querySelector('input[name="add"]').value.trim();
        if (todo.length) {
            generateTemplate(todo);
            addForm.reset();
            saveTodos(); // Save todos to localStorage
        }
    });

    // DELETE A TODO
    TodoList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete')) {
            event.target.parentElement.remove();
            saveTodos(); // Save todos to localStorage
        }
    });

    // FILTER TODOS
    const filterTodos = (term) => {
        Array.from(TodoList.children).forEach((todo) => {
            const text = todo.querySelector('span').textContent.toLowerCase();
            const match = text.includes(term);
            todo.style.visibility = match ? 'visible' : 'hidden';
        });
    };

    // SEARCH FUNCTIONALITY
    search.addEventListener('keyup', () => {
        const term = search.value.trim().toLowerCase();
        filterTodos(term);
    });

    // Load todos when the page loads
    loadTodos();
});