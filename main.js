let chatrooms = [];
var room = undefined;
let allusers=[];
let iduser = {};
let userId2User={};
let userName2User={};
let peerId2User={};
let allmessages=[];

username = localStorage.getItem("trystusername"); 
console.log("username",username);
let userid = getSetDefault("userid",()=>crypto.randomUUID()); 
const publicUserData2Send={
    userid,
    username,
    mesglength:messages.length
}
if(localStorage.getItem("userId2User")==null){
    userId2User={}
}else{
    userId2User = JSON.parse(localStorage.getItem("userId2User"));
}
userId2User[userid]=publicUserData2Send;
userName2User[username]=publicUserData2Send;
const userIdToUsername=(userid)=>{

}
const peerIdToUserId=(userid)=>{

}

localStorage.setItem("userId2User",JSON.stringify(userId2User))

console.log("userId2User",userId2User)
if(username==null){
    username = generateName();
    if(localStorage){
        localStorage.setItem("trystusername",username);
    }
}
chat.settitle(username);
const getpeerid=id=>{
    if(id in usernames){
        return usernames[id];
    }else{
        return id;
    }
    return "?";
}
var mesghash=""+Math.random();

if (localStorage) {
    const oldmessages = localStorage.getItem("oldmessages");
    if (oldmessages != undefined) {
        messages = JSON.parse(oldmessages);
        mesgshash= hashCode(oldmessages);
    }
}
var mesglength = messages.length;

const addMessage=(uid,username,mesg,time)=>{
    let elm;
    if(uid==userid){
        elm = chat.addSendMesg(mesg, username, getDateLocalFormat(time));

    }else{
        elm = chat.addRecvMesg(mesg, username, getDateLocalFormat(time));
    }
    return elm;
}

if(localStorage.getItem("allmessages")!=null){
    allmessages = JSON.parse(localStorage.getItem("allmessages"));
    allmessages.forEach(e=>{
        let username = e.userid;
        if((typeof userId2User[e.userid]) != "undefined"){
            username = userId2User[e.userid].username
        }
        e.elm = addMessage(
            e.userid,
            username,
            e.data,
            e.time);
    })
}
chat.callbacks.deleteChat=()=>{
    allmessages=[];
    localStorage.setItem("allmessages", JSON.stringify(allmessages));
}
setTimeout(e=>{
    
console.log(document.getElementById("joinroom").click());
},100);