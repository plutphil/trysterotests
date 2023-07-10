import { joinRoom } from 'https://cdn.skypack.dev/trystero'


const log = (msg) => {
    console.log(msg)
    const li = document.createElement("li");
    li.innerText = msg
    document.getElementById("chatlist").appendChild(li);
    //addStatus(msg);
}
let chatrooms = [];
let room = undefined;
let allusers=[];
let nicknameuser={};
let peeriduser = {};
let iduser = {};
document.getElementById("leaveroom").addEventListener('click', () => {
    room.leave();
    document.getElementById("leaveroom").setAttribute("disabled", "disabled");
    log("left room");
});
let statusmessages = [];
let messageselements = [];
let sendnickcb = ()=>{};
document.getElementById("savenick").addEventListener('click', () => {
    localStorage.setItem("trystnickname",document.getElementById("nickname").value)
    sendnickcb();
});
document.getElementById("joinroom").addEventListener('click', () => {
    const roomid = document.getElementById("roomid").value;
    const namespace = document.getElementById("namespace").value;
    const roompw = document.getElementById("roompw").value;
    
    const config = { appId: roomid };
    if(roompw != ""){
        config["password"] = roompw;
    }
    try {
         room = joinRoom(config, namespace);
    } catch (e) {
        log(e);
        return;
    }
    document.getElementById("leaveroom").removeAttribute("disabled");
    let friendId = null;
    log("waiting for peers ...");
    if (!DEBUG)
        document.getElementById("messageinput").focus();
    //togglesidebar(true);
    document.getElementById("settingsdialog").style.display="none";
    
    const [sendNickname, getNickname] = room.makeAction('nickname')
    sendnickcb=()=>{
        sendNickname({nickname:trystnick});
    };
    let oldtosend = [];
    for (let i = Math.max(messages.length-11,0); i < messages.length;i++) {
        const e = messages[i];
        oldtosend.push({
            user:e.user,
            data:e.data,
            time:e.time
        });
        console.log(e);
        if(oldtosend.length>=10){
            break;
        }
    }
    const [sendOldMessaged, getOldMessages] = room.makeAction('old');
    /* 
    synchronisation steps
    length check getMesgStats => lenght,hash,lastchange
    hash check
    newest changes check

    */
    room.onPeerJoin(peerId => {
        log(`${peerId} joined`)
        friendId = peerId;
        sendNickname({nickname:trystnick},peerId);
        let peers = room.getPeers();
        console.log(peers);
        document.querySelector(".chatstatus").innerText = ""+  Object.keys(peers).length+ " peers";
        let elm = addStatus("joined");
        statusmessages.push({
            type: "joined",
            peerId: peerId,
            time: new Date().getTime(),
            element: elm
        });
        sendOldMessaged({messages:oldtosend});
        
    })
    getNickname((dat, peerId)=>{
        console.log(peerId,dat);
        nicknameuser[dat.nickname]=peerId;
        peeriduser[peerId]=dat.nickname;
        if(peerId!=getpeerid(peerId)){
            log("nickname "+peerId+" "+getpeerid(peerId)+" to "+dat.nickname);
        }
        setnickname(peerId,dat.nickname);
        statusmessages.forEach(e=>{
            e.element.innerText = getpeerid(e.peerId)+" "+e.type;
        });
        messageselements.forEach(e=>{
            try {
                e.element.querySelector("username").innerText = nicknames[e.peerId]+" "+e.type;
            } catch (error) {
            }
        });
    })
    room.onPeerLeave(peerId => {
        log(`${peerId} left`)
        let peers = room.getPeers();
        console.log(peers);
        document.querySelector(".chatstatus").innerText = ""+  Object.keys(peers).length+ " peers";
    })
    const [sendChatMsg, recvChatMsg] = room.makeAction('chatmesg');
    const [sendChatMsgRecvValidate, recvChatMsgRecvValidate] = room.makeAction('msgvali');
    sendMessage = (msgtext,time) => {
        const data = {
            type: "text",
            data: msgtext,
            time
        };
        sendChatMsg(data);
    };
    
    recvChatMsg((dat, peerId) => {
        if (dat.type == "text") {
            messages.push({
                user: getpeerid(peerId),
                data: dat.data,
                time: dat.time
            });
            savemessages();
            const elm = addRecvMesg(dat.data, getpeerid(peerId), getDateLocalFormat());
            messageselements.push({
                type: 'recvmsg',
                user: getpeerid(peerId),
                time: Date.now(),
                data: dat.data,
                element:elm
            });
            sendChatMsgRecvValidate(dat,peerId)
            var audio = new Audio('ringtone.mp3');
            audio.play();
        }
    });
    recvChatMsgRecvValidate((dat, peerId) => {
        log("received message from"+peerId+JSON.stringify(dat));
    });
    const [sendIsTyping, getIsTyping] = room.makeAction('typing')

    getOldMessages((data, peerId)=>{
        data.messages.forEach(m => {
            const hash = hashCode(m.data+m.user+m.time)
            if(!(hash in hashmesg)){
                messages.push(m);
                if (m.user==trystnick) {
                    addMessage(m.data, trystnick, getDateLocalFormat(m.time));
                }
                else {
                    addRecvMesg(m.data, m.user, getDateLocalFormat(m.time));
                }
            }
        })
    })

    const [sendDrink, getDrink] = room.makeAction('drink')
    const [sendThankDrink, getThankDrink] = room.makeAction('thankdrink')
    // listen for drinks sent to you
    getDrink((data, peerId) => {
        log(
            `got a ${data.drink} with${data.withIce ? '' : 'out'} ice from ${peerId}`
        )
        sendThankDrink(data)
    }
    )
    getThankDrink((data, peerId) => {
        log(
            `thanky you for a ${data.drink} with${data.withIce ? '' : 'out'} ice from ${peerId}`
        )
    }
    )

    // buy drink for a friend
    sendDrink({ drink: 'negroni', withIce: true }, friendId)
    // buy round for the house (second argument omitted)
    sendDrink({ drink: 'mezcal', withIce: false })
    document.getElementById('senddrink').addEventListener('click', () => {
        const data = { drink: 'mezcal', withIce: false }
        log(`sent drink ${data.drink} with${data.withIce ? '' : 'out'}`)
        sendDrink(data)
    });
    //room.leave()
})
document.getElementById("joinroom").click();