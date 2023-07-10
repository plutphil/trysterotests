var messages = [];
let trystnick = null;
var nicknames = {};
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
const setnickname=(id,name)=>{
    nicknames[id]=name;
}
if(localStorage){
    trystnick = localStorage.getItem("trystnickname"); 
    console.log("trystnick",trystnick);
}
if(trystnick==null){
    trystnick = generateName();
    if(localStorage){
        localStorage.setItem("trystnickname",trystnick);
    }
    document.getElementById("nickname").value = trystnick;
    document.getElementById("nicknamebig").innerText = trystnick;
}  
const getpeerid=id=>{
    if(id in nicknames){
        return nicknames[id];
    }else{
        return id;
    }
    return "?";
}
var mesghash=""+Math.random();
/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
if (localStorage) {
    const oldmessages = localStorage.getItem("oldmessages");
    if (oldmessages != undefined) {
        messages = JSON.parse(oldmessages);
        mesgshash= hashCode(oldmessages);
    }
}
var mesglength = messages.length;

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

var hashmesg = {};
var savemessages = () => {
    localStorage.setItem("oldmessages", JSON.stringify(messages));
    messages.forEach(m=>{
        hashmesg[hashCode(m.data+m.user+m.time)]=m;

    })
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
document.getElementById("settingsbutton").onclick=()=>{
    document.getElementById("settingsdialog").style.display="flex";
}
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
    /*messages.push({
        type: 'stat',
        time: Date.now(),
        data: message
    });*/
    //savemessages();
    var messageElement = document.createElement('div');
    messageElement.classList.add('statmesg');
    messageElement.classList.add('sendmesg');
    messageElement.innerText = message;

    var messagewrap = document.createElement('div');
    messagewrap.classList.add('statwrap');
    messagewrap.appendChild(messageElement);
    messagesContainer.appendChild(messagewrap);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
    var input = document.getElementById('messageinput');
    var message = input.innerText.trim();

    if (message !== '') {
        const msgobj = {
            user: trystnick,
            time: Date.now(),
            data: message
        }
        messages.push(msgobj);
        savemessages();
        addMessage(message, trystnick, getDateLocalFormat()); 
        //res = chatbotsay(message);
        //addRecvMesg(res,"chatbot",getDateLocalFormat())
        input.innerHTML = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        sendMessage(message,msgobj.time);
    }
}
// Example event listener to handle sending a message on Enter key press
document.getElementById('messageinput').addEventListener('keydown', function (event) {
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
        if (m.user==trystnick) {
            addMessage(m.data, trystnick, getDateLocalFormat(m.time));
        }
        else {
            addRecvMesg(m.data, m.user, getDateLocalFormat(m.time));
        }
        /*else if (m.type == "stat") {
            addStatus(m.data);
        }*/
    })
    //togglesidebar();
}
//addRecvMesg(chatbotsay("hi"),"chatbot",getDateLocalFormat())
//addMessage(chatbotsay("asdfasdf"),"chatbot",getDateLocalFormat())