var messages = [];
let trystnick = null;
var nicknames = {};
const setnickname=(id,name)=>{
    nicknames[id]=name;
}
if(localStorage){
    trystnick = localStorage.getItem("trystnickname"); 
    console.log("trystnick",trystnick);
}
if(trystnick==null){
    trystnick = generateName();
    document.getElementById("nickname").value = trystnick;
}  
const getpeerid=id=>{
    if(id in nicknames){
        return nicknames[id];
    }else{
        return id;
    }
}
if (localStorage) {
    const oldmessages = localStorage.getItem("oldmessages");
    if (oldmessages != undefined) {
        messages = JSON.parse(oldmessages);
    }
}
const togglesidebar = (a) => {
    const opensize = "100%";
    let state = document.getElementById("sidebar").style.width == opensize;
    if (a != undefined) {
        state = a;
    }
    if (state) {
        document.getElementById("sidebar").style.width = "0%";
        document.getElementById("chatcontainer").style.width = "100%";
    } else {
        document.getElementById("sidebar").style.width = opensize;
        document.getElementById("chatcontainer").style.width = "50pt";
    }
}
var savemessages = () => {
    localStorage.setItem("oldmessages", JSON.stringify(messages));
}
var dialogcb = () => { }
const dialog = (onsuccess) => {
    document.getElementById("dialogpane").style.display = "flex";
    document.getElementById("dialogpane").style.backdropFilter = "blur(5px)";
    dialogcb = onsuccess;
}
function getColor() {
    return "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%,0.5)'
}
const dialogclose = () => {
    //random transparent background color
    document.getElementById("dialogpane").style.display = "none";

    //document.getElementById("dialogpane").style.background=getColor();
    //document.getElementById("dialogpane").style.background="linear-gradient(" + 0+ "deg,#4ac10090,#795bb090)"
    //document.getElementById("dialogpane").style.opacity="50%";

}
const dialogyes = () => {
    dialogcb();
}
const dialogno = () => {
    dialogclose();
}
const delhist = () => {
    dialog(() => {
        localStorage.setItem("oldmessages", "[]");
        messages = [];
        messagesContainer.innerHTML = "";
    })
};
// JavaScript code to handle sending and receiving messages
var messagesContainer = document.querySelector('.chat-messages');
const addMessage = (message, user, time) => {

    var messagewrap = document.createElement('div');

    var messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add('sendmesg');
    messageElement.innerText = message;
    //messageElement.innerHTML = markdown(message);

    var usernameElement = document.createElement('div');
    usernameElement.classList.add('username');
    messageElement.insertBefore(usernameElement, messageElement.firstChild);
    if (user != undefined) {
        usernameElement.innerText = user;
    }
    var timeElement = document.createElement('div');
    timeElement.classList.add('mesgtimestamp');
    messageElement.appendChild(timeElement);
    if (time != undefined) {
        //<div class="mesgtimestamp">12:30✔✔</div>;
        timeElement.innerText = time;
    }

    messagewrap.classList.add('sendmesgwrap');
    messagewrap.appendChild(messageElement);
    messagesContainer.appendChild(messagewrap);
    return messageElement;
}
const addStatus = (message) => {
    messages.push({
        type: 'stat',
        time: Date.now(),
        data: message
    });
    savemessages();
    var messageElement = document.createElement('div');
    messageElement.classList.add('statmesg');
    messageElement.classList.add('sendmesg');
    messageElement.innerText = message;

    var messagewrap = document.createElement('div');
    messagewrap.classList.add('statwrap');
    messagewrap.appendChild(messageElement);
    messagesContainer.appendChild(messagewrap);
    return messageElement;
}
//addStatus("bla left the group!");
const addRecvMesg = (message, user, time) => {


    var messagewrap = document.createElement('div');
    messagewrap.classList.add('mesgwrap');

    var messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add('recvmessage');
    messageElement.innerText = message;
    //messageElement.innerHTML = markdown(message);

    var usernameElement = document.createElement('div');
    usernameElement.classList.add('username');
    messageElement.insertBefore(usernameElement, messageElement.firstChild);
    if (user != undefined) {
        usernameElement.innerText = user;
    }
    var timeElement = document.createElement('div');
    timeElement.classList.add('mesgtimestamp');
    messageElement.appendChild(timeElement);
    messagewrap.appendChild(messageElement);
    if (time != undefined) {
        //<div class="mesgtimestamp">12:30✔✔</div>;
        timeElement.innerText = time;
    }

    messagesContainer.appendChild(messagewrap);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageElement;
}

// Example function to handle sending a message
var sendMessage = (msg) => {

}
const getDateLocalFormat = a => {
    if (a == undefined) {
        return (new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    } else {
        return (new Date(a)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
const _sendMessage = () => {
    var input = document.getElementById('message-input');
    var message = input.innerText.trim();

    if (message !== '') {
        messages.push({
            type: 'sendmsg',
            user: "",
            time: Date.now(),
            data: message
        });
        savemessages();
        addMessage(message, trystnick, getDateLocalFormat()); 
        //res = chatbotsay(message);
        //addRecvMesg(res,"chatbot",getDateLocalFormat())
        input.innerHTML = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        sendMessage(message);
    }
}
// Example event listener to handle sending a message on Enter key press
document.getElementById('message-input').addEventListener('keydown', function (event) {
    if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        _sendMessage();
    }
});
const DEBUG = true;
if (DEBUG) {
    /*addStatus("status"+getDateLocalFormat())
    addRecvMesg(
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt odit similique repudiandae dolores! Nemo facilis repudiandae accusamus iste. Architecto excepturi voluptas nulla porro eius ad labore adipisci aperiam odio tempora.",
        "chatbot",getDateLocalFormat()
    )
    addRecvMesg(chatbotsay("hi"),"chatbot",getDateLocalFormat())
    addRecvMesg(chatbotsay("hi"))
    sentmesg = addRecvMesg(chatbotsay("hi"),"username","⏱")
    setTimeout(()=>{
        sentmesg.querySelector(".mesgtimestamp").innerText="✔";
        setTimeout(()=>{
            sentmesg.querySelector(".mesgtimestamp").innerText="✔✔"
        },1000);
    },1000);
    addMessage(chatbotsay("asdfasdf"),"chatbot",getDateLocalFormat());
    addMessage(chatbotsay("asdfasdf"),undefined,getDateLocalFormat());
    addMessage(chatbotsay("asdfasdf"),"",getDateLocalFormat());
    */
    messages.forEach(m => {
        if (m.type == "sendmsg") {
            addMessage(m.data, m.user, getDateLocalFormat(m.time));
        }
        else if (m.type == "recvmsg") {
            addRecvMesg(m.data, m.user, getDateLocalFormat(m.time));
        }
        else if (m.type == "statmsg") {
            addMessage(m.data);
        }
    })
    togglesidebar();
}
//addRecvMesg(chatbotsay("hi"),"chatbot",getDateLocalFormat())
//addMessage(chatbotsay("asdfasdf"),"chatbot",getDateLocalFormat())