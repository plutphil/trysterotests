import { joinRoom } from 'https://cdn.skypack.dev/trystero'


const log = (msg) => {
    console.log(msg)
    const li = document.createElement("li");
    li.innerText = msg
    document.getElementById("chatlist").appendChild(li);
    //addStatus(msg);
}
let room = undefined;
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
        document.getElementById("message-input").focus();
    togglesidebar(true);

    const [sendNickname, getNickname] = room.makeAction('nickname')
    sendnickcb=()=>{
        sendNickname({nickname:trystnick});
    };
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
        })
    })
    getNickname((dat, peerId)=>{
        console.log(peerId,dat);
        if(peerId!=getpeerid(peerId)){
            log("nickname "+peerId+" "+getpeerid(peerId)+" to "+dat.nickname);
        }
        setnickname(peerId,dat.nickname);
        statusmessages.forEach(e=>{
            e.element.innerText = getpeerid(e.peerId)+" "+e.type;
        });
        messageselements.forEach(e=>{
            e.element.querySelector("username").innerText = nicknames[e.peerId]+" "+e.type;
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
    sendMessage = (msgtext) => {
        const data = {
            "type": "text",
            "data": msgtext
        };
        sendChatMsg(data);
    };
    recvChatMsg((dat, peerId) => {
        if (dat.type == "text") {
            messages.push({
                type: 'recvmsg',
                user: peerId,
                time: Date.now(),
                data: dat.data
            });
            const elm = addRecvMesg(dat.data, getpeerid(peerId), getDateLocalFormat());
            messageselements.push({
                type: 'recvmsg',
                user: peerId,
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