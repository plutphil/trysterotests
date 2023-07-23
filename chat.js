var messages = [];
let username = null;
var usernames = {};
function Chat(){
    // Example function to handle sending a message
    let callbacks = {
        sendMessage:(msg,time) => {
            throw "not implemented";
        },
        deleteChat:() => {
            throw "not implemented";
        }
    }
    const setusername=(id,name)=>{
        usernames[id]=name;
    }
    const sidebar = document.getElementById("sidebar");
    const chatcontainer = document.getElementById("chatcontainer");
    const chatlist = document.getElementById("chatlist");
    const togglesidebar = (a) => {
        const opensize = "100%";
        let state = sidebar.style.width == opensize;
        if (a != undefined) {
            state = a;
        }
        console.log( sidebar.style.width,chatcontainer.style.widt)
        if (state) {
            sidebar.style.width = "0%";
            chatcontainer.style.width = "100%";
        } else {
            sidebar.style.width = opensize;
            chatcontainer.style.width = "50pt";
        }
    }
    document.getElementById("sidebarbutton").addEventListener("click",e=>togglesidebar());
    document.getElementById("searchinput").addEventListener("keydown",e=>{
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
        }
    });
    
    var hashmesg = {};
    
    var dialogcb = () => { }
    const dialog = (onsuccess) => {
        document.getElementById("dialogpane").style.display = "flex";
        document.getElementById("dialogpane").style.backdropFilter = "blur(5px)";
        dialogcb = onsuccess;
    }
    const dialogclose = () => {
        document.getElementById("dialogpane").style.display = "none";
    }
    const dialogyes = () => {
        callbacks.deleteChat();
        messagesContainer.innerHTML = "";
        dialogclose();
    }
    const dialogno = () => {
        dialogclose();
    }
    const delhist = () => {
        dialog(() => {
            messages = [];
        })
    };
    document.getElementById("settingsbutton").onclick=()=>{
        document.getElementById("settingsdialog").style.display="flex";
    }
    // JavaScript code to handle sending and receiving messages
    var messagesContainer = document.querySelector('.chat-messages');
    const addSendMesg = (message, user, time) => {
    
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
    
    
    
    const _sendMessage = () => {
        var input = document.getElementById('messageinput');
        var message = input.innerText.trim();
    
        if (message !== '') {
            const msgobj = {
                user: username,
                time: Date.now(),
                data: message
            }
            addSendMesg(message, username, getDateLocalFormat()); 
            input.innerHTML = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            callbacks.sendMessage(message,Date.now());
        }
    }
    // Example event listener to handle sending a message on Enter key press
    document.getElementById('messageinput').addEventListener('keydown', function (event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            _sendMessage();
        }
    });
    /*const DEBUG = true;
    if (DEBUG) {
        
        messages.forEach(m => {
            if (m.user==username) {
                addSendMesg(m.data, username, getDateLocalFormat(m.time));
            }
            else {
                addRecvMesg(m.data, m.user, getDateLocalFormat(m.time));
            }
        })
    }*/
    addgroup = (title,status)=>{
        const chatlist = document.getElementById("chatlist");
        const chatitemtemplate = document.getElementById("chatitemtemplate");
        const e = chatitemtemplate.cloneNode(true);
        chatlist.appendChild(e);
        console.log(e)
        console.log(e.getElementsByClassName("chattitle"))
        e.getElementsByClassName("chattitle")[0].innerText = title;
        e.getElementsByClassName("groupchatstat")[0].innerText = status;
        
        return e;
    }
    /*for(let i =0;i<30;i++){
        addgroup(generateName(),""+Math.random()+" Peers")
    }
    setTimeout(()=>{
        togglesidebar();
    },300);*/
        
    const object={
        setusername,
        setchatstatus:t=>{document.querySelector(".chatstatus").innerText = t},
        togglesidebar,
        addStatus,
        hashmesg,
        callbacks,
        addRecvMesg,
        addSendMesg,
        dialogyes,
        dialogno,
        delhist,
        settitle:(text)=>{
            document.getElementById("usernamebig").innerText = text;
        },
        setgroupname:(i,name)=>{

        },
        addgroup
    };
    
    return object;
}
var chat = Chat();

/*
settings = {}
username
chats [
    {
        name
        users:[]
        messages:[]
    }
]


*/