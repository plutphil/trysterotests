import { joinRoom } from 'https://cdn.skypack.dev/trystero'




const leaveroom=()=>{
    room.leave();
    log("left room");
}
document.getElementById("leaveroom").addEventListener('click', () => {
    leaveroom();
    document.getElementById("leaveroom").setAttribute("disabled", "disabled");
    
});
let statusmessages = [];
let messageselements = [];
let sendnickcb = ()=>{};
const savemessage=(mesg)=>{
    console.log("savemsg",mesg)
    allmessages.push(mesg);
    localStorage.setItem("allmessages",JSON.stringify(allmessages));
}


const setusername=(username)=>{
    localStorage.setItem("trystusername",username)
    sendnickcb();
};
const setpeercount=()=>{
    let peers = room.getPeers();
    chat.setchatstatus(""+  (Object.keys(peers).length+1)+ " peers"+", "+Object.keys(userId2User).length)+" Users"
}
const dojoinroom=(appid,namespace,roompw)=>{
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
    
    
}
document.getElementById("savenick").addEventListener('click', () => {
    setusername(document.getElementById("username").value)
});
document.getElementById("joinroom").addEventListener('click', () => {
    const roomid = document.getElementById("roomid").value;
    const namespace = document.getElementById("namespace").value;
    const roompw = document.getElementById("roompw").value;
    dojoinroom(roomid, namespace, roompw);
    document.getElementById("leaveroom").removeAttribute("disabled");
    document.getElementById("settingsdialog").style.display="none";
    log("waiting for peers ...");
    const routes = {
        
    }
    const [sendmsg, recvmsg] = room.makeAction('msg')
    recvmsg((data, peerId)=>{
        if(data.type in routes){
            routes[data.type](data,peerId);
        }else{
            console.log("unknown route ",data.type)
        }
    })

    sendnickcb=()=>{
        sendusername({username:username});
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
    routes["username"]=(dat, peerId)=>{
        console.log(peerId,dat);
        
        if(allmessages.length>0){
            let lastmesg = allmessages[allmessages.length-1];
            console.log(lastmesg)
            if(typeof dat["lastmesg"] != undefined){
                const recvlastmesg = dat["lastmesg"];
                if(recvlastmesg.time!=lastmesg.time||recvlastmesg.userid!=userid){
                    console.log("download old messages!")
                    sendmsg({
                        type:"reqoldmesg",
                        lastmesg:{
                            time:lastmesg.time,
                            userid:lastmesg.userid
                        }
                    },peerId)
                }
            }
        }else{
            sendmsg({
                type:"reqoldmesg",
                lastmesg:{
                    time:0,
                    userid:""
                }
            },peerId)
        }

        chat.setusername(peerId,dat.username); 
        statusmessages.forEach(e=>{
            e.element.innerText = getpeerid(e.peerId)+" "+e.type;
        });
        messageselements.forEach(e=>{
            try {
                e.element.querySelector("username").innerText = usernames[e.peerId]+" "+e.type;
            } catch (error) {
            }
        });
        if(!(typeof userId2User[dat.userid] == "undefined")){
            let elm = chat.addStatus(dat.username+" joined");
            statusmessages.push({
                type: "joined",
                peerId: peerId,
                time: new Date().getTime(),
                element: elm
            });
        }
        peerId2User[peerId]=dat;
        console.log(typeof userId2User,userId2User);
        if(typeof userId2User=="string"){
            userId2User = JSON.parse(userId2User);
            console.log(typeof userId2User,userId2User);
        }
        userId2User[dat.userid]=dat; 
        localStorage.setItem("userId2User",JSON.stringify(userId2User))
        userName2User[dat.username]=dat;
    }
    let respondtoallonjoin = true;

    room.onPeerJoin(peerId => {
        //log(`${peerId} joined`)
        let lastmesg = {};
        console.log(allmessages)
        if(allmessages.length>0){
            lastmesg = allmessages[allmessages.length-1];
        }
        if(respondtoallonjoin){
            
            sendmsg({
                type:"username",
                userid,
                username,
                mesglength:messages.length,
                lastmesg:{
                    time:lastmesg.time,
                    userid:lastmesg.userid
                }
            },peerId);
        }
        setpeercount();
        //sendOldMessaged({messages:oldtosend});
    })
    room.onPeerLeave(peerId => {
        log(`${peerId} left`)
        let peers = room.getPeers();
        //console.log(peers);
        
        setpeercount();
    })
    chat.callbacks.sendMessage = (msgtext,time) => {
        const data = {
            type: "chatmesg",
            data: msgtext,
            time
        };
        savemessage(
            {
                type: "text",
                data: msgtext,
                time,
                userid
            }
        )
        sendmsg(data);
        console.log(data) 
    };
    const addmesg =()=>{
        
    }
    routes.chatmesg=(dat, peerId) => { 
        savemessage({
            userid: peerId2User[peerId].userid,
            data: dat.data,
            time: dat.time
        });
        let elm;
        if(peerId2User[peerId].userid==userid){
            elm = chat.addSendMesg(dat.data, getpeerid(peerId), getDateLocalFormat());
        }else{
            elm = chat.addRecvMesg(dat.data, getpeerid(peerId), getDateLocalFormat());
        }
        messageselements.push({
            type: 'recvmsg',
            user: getpeerid(peerId),
            time: Date.now(),
            data: dat.data,
            element:elm
        });
        //sendChatMsgRecvValidate(dat,peerId)
        var audio = new Audio('ringtone.mp3');
        audio.play();
    
    };
    routes.reqoldmesg = (data, peerId)=>{
        let outlist=[];
        let continuation = undefined;
        for (let i = allmessages.length-1; i >=0 ; i--) {
            const e = allmessages[i];
            if(e.time>data.lastmesg.time){
                outlist.push(e);
                if(outlist.length>10){
                    continuation=e;
                    break;
                }
            }
        }
        console.log("onoldmesg",data,outlist);
        sendmsg({
            type:"oldmesg",
            messages:outlist.reverse(),
            continuation
        })
    };
    routes.oldmesg = (data, peerId)=>{
        console.log(data);
        data.messages.forEach(e=>{
            console.log(e);
            savemessage({
                userid: e.userid,
                data: e.data,
                time: e.time
            });
            let elm;
            if(peerId2User[peerId].userid==userid){
                elm = chat.addSendMesg(e.data, e.peerId, getDateLocalFormat());
            }else{
                elm = chat.addRecvMesg(e.data, e.peerId, getDateLocalFormat());
            }
        });
    }
    //room.leave()
});