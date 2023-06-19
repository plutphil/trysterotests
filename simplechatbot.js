conversations = [
    {
        trig:["hi", "hey", "hello"],
        repl:["Hello!", "Hi!", "Hey!", "Hi there!"]
    },
    {
        trig:["how are you", "how are things"],
        repl:[
            "Fine... how are you?",
            "Pretty well, how are you?",
            "Fantastic, how are you?"
            ]
    },
    {
        trig:["what is going on", "what is up"],
        repl:[
            "Nothing much",
            "Exciting things!"
            ]
    },
    {
        trig:["fine","happy", "good", "well", "fantastic", "cool"],
        repl:["Glad to hear it"]
    },
    {
        trig:["bad", "bored", "tired", "sad"],
        repl:["Why?", "Cheer up buddy"]
    },
    {
        trig:["tell me story", "tell me joke"],
        repl:["What about?", "Once upon a time..."]
    },
    {
        trig:["thanks", "thank you"],
        repl:["You're welcome", "No problem"]
    },
    {
        trig:["bye", "good bye", "goodbye"],
        repl:["Goodbye", "See you later"]
    },
    {
        trig:["turn on light"],
        repl:["turning on light"]
    },
    {
        trig:["turn off light"],
        repl:["turning off light"]
    },
    {
        trig:["im %name","hi im %name","hello im %name"],
        repl:["Hi, %name. I'm chatbot!"]
    }
]

alternative = [
    "Same",
    "Go on...",
    "Try again",
    "I'm listening...",
    "Bro...",
    "%inp",
    "What do you mean with '%inp'?",
    
];
const robot = ["How do you do, fellow human", "I am not a bot"];

chatbotsay = (input)=>{
    //remove all characters except word characters, space, and digits
    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");

// 'tell me a story' -> 'tell me story'
// 'i feel happy' -> 'happy'
    text = text
    .replace(/ a /g, " ")
    .replace(/i feel /g, "")
    .replace(/whats/g, "what is")
    .replace(/please /g, "")
    .replace(/ please/g, "");
let variables = {};
function comparevariable(text,trig,repls){
    trigsplit = trig.split(" ");
    textsplit = text.split(" ");
    if(trigsplit.length==textsplit.length){
        for(let i = 0;i < trigsplit.length;i++){
            word = trigsplit[i];
            inputword= textsplit[i];
            if(word.charAt()==='%'){
                console.log(word,"=",inputword)
                variables[word]=inputword;
            }else if(word!=inputword){
                return undefined;
            }
        }
    }else{
        return undefined;
    }
    console.log(variables);
    item = repls[Math.floor(Math.random() * repls.length)];
    for (let [key, value] of Object.entries(variables)) {
        item = item.replace(key, value); 
    }
    return item;
}
function compare( text) {
    let item;
    for (let x = 0; x < conversations.length; x++) {
    for (let y = 0; y < conversations[x].trig.length; y++) {
        if (conversations[x].trig[y] === text) {
            items = conversations[x].repl;
            item = items[Math.floor(Math.random() * items.length)];
        }else{
            newitem = comparevariable(text,conversations[x].trig[y],conversations[x].repl);
            if(newitem != undefined) {
                item = newitem;
            }
        }
    }
    }
    return item;
}
console.log(text);
product = compare(text);
if (product) {
} else if (text.match(/robot/gi)) {
    product = robot[Math.floor(Math.random() * robot.length)];
} else {
    product = alternative[Math.floor(Math.random() * alternative.length)];
    product = product.replace("%inp",text)
}
console.log(product);
return product;
}
chatbotsay("hi, I'm test!");