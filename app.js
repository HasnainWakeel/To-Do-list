var listBoxElm = document.getElementById('list-parent'); 
var todoForm = document.getElementById('todo-form');
var inputText = document.getElementById('input-text');

function ListData(itemValue) {
    this.listText = itemValue;
    this.id = Math.floor(Math.random() * 1000 + Number(new Date().getTime().toString().slice(-4)));
    this.completed = false;
}

function saveData(data) {
    localStorage.setItem('to-do-items', JSON.stringify(data));
    renderListItems();
    checkEmptyData();
}

function readPreData() {
    var data = localStorage.getItem('to-do-items');
    return data ? JSON.parse(data) : [];
}

var toDoData = readPreData();

todoForm.onsubmit = function (e) {
    e.preventDefault();
    var inpTxtValue = inputText.value;
    if (inpTxtValue) {
        var obj = new ListData(inpTxtValue);
        toDoData = [...toDoData, obj];
        saveData(toDoData);
        inputText.value = ''; 
    }
};

function renderListItems() {
    listBoxElm.innerHTML = '';
    for (var i = 0; i < toDoData.length; i++) {
        var taskDiv = document.createElement('div');
        taskDiv.setAttribute('class', 'task');

        var inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = toDoData[i].listText;
        inputElement.setAttribute('class', 'hide');

        var paraElement = document.createElement('p');
        paraElement.innerText = toDoData[i].listText;

        if (toDoData[i].completed) {
            paraElement.style.textDecoration = 'line-through rgb(0, 249, 29) 3px';
            paraElement.style.color = 'black';
        }

        var buttonParent = document.createElement('div');
        buttonParent.setAttribute('class', 'btn-parent');

        var editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.onclick = (function (index) {
            return function () {
                editItem(index);
            };
        })(i);

        var deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'del-btn');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = deleteItem.bind(null, toDoData[i].id);

        var doneButton = document.createElement('button');
        doneButton.setAttribute('class', 'don-btn');
        doneButton.innerText = toDoData[i].completed ? 'Undo' : 'Done';
        doneButton.onclick = markDone.bind(null, toDoData[i].id);

        buttonParent.appendChild(editButton);
        buttonParent.appendChild(deleteButton);
        buttonParent.appendChild(doneButton);

        taskDiv.appendChild(inputElement);
        taskDiv.appendChild(paraElement);
        taskDiv.appendChild(buttonParent);

        listBoxElm.appendChild(taskDiv);
    }
}

function editItem(index) {
    var taskDiv = listBoxElm.children[index];
    var paraElement = taskDiv.getElementsByTagName('p')[0];
    var inputElement = taskDiv.getElementsByTagName('input')[0];
    var editButton = taskDiv.getElementsByTagName('button')[0];

    paraElement.style.display = 'none';
    inputElement.style.display = 'block';

    editButton.innerText = 'Save';
    editButton.onclick = function () {
        updatedItem(index);
    };
}

function updatedItem(index) {
    var taskDiv = listBoxElm.children[index];
    var inputElement = taskDiv.getElementsByTagName('input')[0];
    var updatedText = inputElement.value;

    toDoData[index].listText = updatedText;
    saveData(toDoData);
}

function deleteItem(id) {
    var newToDoData = [];
    for (var i = 0; i < toDoData.length; i++) {
        if (toDoData[i].id !== id) {
            newToDoData.push(toDoData[i]);
        }
    }
    toDoData = newToDoData;
    saveData(toDoData);
}

function markDone(id) {
    for (var i = 0; i < toDoData.length; i++) {
        if (toDoData[i].id === id) {
            toDoData[i].completed = !toDoData[i].completed;
            break;
        }
    }
    saveData(toDoData);
}

function checkEmptyData() {
    var imgElm = document.getElementById('empty-image');
    var heading = document.getElementById('empty-heading');

    if (!imgElm) {
        imgElm = document.createElement('img');
        imgElm.setAttribute('src', './img/add1.png');
        imgElm.setAttribute('class', 'add-img');
        imgElm.setAttribute('id', 'empty-image');
    }

    if (!heading) {
        heading = document.createElement('h1');
        heading.setAttribute('class', 'head');
        heading.setAttribute('id', 'empty-heading');
        heading.innerText = 'Type to add tasks!';
    }

    if (toDoData.length === 0) {
        if (!listBoxElm.contains(imgElm)) {
            listBoxElm.appendChild(imgElm);
        }
        if (!listBoxElm.contains(heading)) {
            listBoxElm.appendChild(heading);
        }
        listBoxElm.style.display = 'flex';
        listBoxElm.style.flexDirection = 'column';
        listBoxElm.style.justifyContent = 'center';
        listBoxElm.style.alignItems = 'center';
    } else {
        if (imgElm.parentNode) {
            imgElm.style.display = 'none';
        }
        if (heading.parentNode) {
            heading.style.display = 'none';
        }
        listBoxElm.style.display = 'block';
    }
}


renderListItems();
checkEmptyData();
