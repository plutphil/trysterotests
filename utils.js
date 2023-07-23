function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
const getSetDefault=(key,onset,override)=>{
    if(localStorage.getItem(key)==null && !override){
        localStorage.setItem(key,onset())
    }
    return localStorage.getItem(key);
}
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
const log = (msg) => {
    console.log(msg)
    const li = document.createElement("li");
    li.innerText = msg
    document.getElementById("chatlog").appendChild(li);
    //addStatus(msg);
}
function getRandomColor() {
    return "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%,0.5)'
}
const getDateLocalFormat = a => {
    if (a == undefined) {
        return (new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    } else {
        return (new Date(a)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}