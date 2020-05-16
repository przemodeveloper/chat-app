const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();

let userName = '';

socket.on('message', ( { author, content } ) => addMessage(author, content));
socket.on('join', (user) => addMessage('Chat Bot', user + ' has joined chat!'));
socket.on('removeUser', (id) => addMessage('Chat Bot', id + ' has left the chat!'));

function login(e) {
    e.preventDefault();
    if(userNameInput.value.trim() == '') {
        alert('Please enter username.')
    } else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        socket.emit('join', userName);
    }
}

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author == 'Chat Bot') {
        message.style.fontStyle = 'italic';
    }
    if(author == userName) {
        message.classList.add('message--self');
    }
    message.innerHTML = 
        `<h3 class="message__author">${userName === author ? 'You' : author}</h3>
            <div class="message__content">
                ${content}
            </div>`;
    messagesList.appendChild(message);
}

function sendMessage(e) {
    e.preventDefault();
    if(messageContentInput.value.trim() == '') {
        alert('Please enter a message.')
    } else {
        addMessage(userName, messageContentInput.value);
        socket.emit('message', { author: userName, content: messageContentInput.value});
        messageContentInput.value = '';
    }
}

loginForm.addEventListener('submit', function(event) {
    login(event);
});

addMessageForm.addEventListener('submit', function(event) {
    sendMessage(event);
})

