// ================= SETUP PAGE =================
const setupPage = document.getElementById("setupPage");
const mainPage = document.getElementById("mainPage");
const avatarElements = document.querySelectorAll(".avatar");
const startBtn = document.getElementById("startBtn");
const assistantNameInput = document.getElementById("assistantName");

const logo = document.getElementById("logo");
const nameSpan = document.getElementById("name");

let selectedAvatar = "/img/google assistent.png"; // default

// Avatar selection
avatarElements.forEach(avatar => {
    avatar.addEventListener("click", () => {
        avatarElements.forEach(a => a.classList.remove("selected"));
        avatar.classList.add("selected");
        selectedAvatar = avatar.src;
    });
});

// Start button
startBtn.addEventListener("click", () => {
    const assistantName = assistantNameInput.value.trim();
    if (!assistantName) {
        alert("Please enter assistant name");
        return;
    }

    // Set final page
    nameSpan.textContent = assistantName;
    logo.src = selectedAvatar;

    // Switch pages
    setupPage.style.display = "none";
    mainPage.style.display = "flex";
});



// ================= ELEMENTS ================= 
const btn = document.querySelector("#btn")
const content = document.querySelector("#content")
const voice = document.querySelector("#voice")

// ================= SPEECH SETUP =================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.continuous = true
recognition.interimResults = false

// ================= SPEAK =================
function speak(text){
    recognition.stop()
    speechSynthesis.cancel()

    setTimeout(()=>{
        const t = new SpeechSynthesisUtterance(text)
        t.rate = 1
        t.pitch = 1
        t.volume = 1
        t.lang = "hi-IN"

        t.onend = ()=> setTimeout(()=>recognition.start(), 500)
        speechSynthesis.speak(t)
    },300)
}

// ================= OPEN APP =================
function openApp(mobileUrl, desktopUrl){
    if(/Android/i.test(navigator.userAgent)){
        location.href = mobileUrl
        setTimeout(()=> window.open(desktopUrl,"_blank"), 800)
    }else{
        window.open(desktopUrl,"_blank")
    }
}

// ================= GREETING =================
function wishMe(){
    const h = new Date().getHours()
    speak(
        h < 12 ? "Good Morning Sir" :
        h < 16 ? "Good Afternoon Sir" :
                 "Good Evening Sir"
    )
}

// ================= NORMALIZE TEXT =================
function cleanText(msg){
    return msg
        .toLowerCase()
        .replace(/hey|sarthi|please/g,"")
        .trim()
}

// ================= CALCULATOR =================
function calculate(message){
    let text = cleanText(message)
        .replace(/calculate|what is/g,"")

    const map = {
        zero:0, one:1, two:2, three:3, four:4, five:5,
        six:6, seven:7, eight:8, nine:9, ten:10,
        eleven:11, twelve:12, thirteen:13, fourteen:14,
        fifteen:15, sixteen:16, seventeen:17, eighteen:18,
        nineteen:19, twenty:20, thirty:30, forty:40,
        fifty:50, sixty:60, seventy:70, eighty:80, ninety:90
    }

    Object.keys(map).forEach(w => text = text.replaceAll(w, map[w]))

    text = text
        .replace(/plus/g,"+")
        .replace(/minus/g,"-")
        .replace(/into|times|multiply/g,"*")
        .replace(/divide|by/g,"/")
        .replace(/[^0-9+\-*/.]/g,"")

    try{
        const result = Function("return " + text)()
        if(isNaN(result)) throw "error"
        speak("The answer is " + result)
        content.innerText = result
    }catch{
        speak("Sorry, I could not calculate")
    }
}

// ================= GOOGLE SEARCH (FALLBACK) =================
function googleSearch(query){
    speak("Searching on Google")
    setTimeout(()=>{
        window.open(
            `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            "_blank"
        )
    },800)
}

// ================= COMMAND HANDLER =================
function takeCommand(message){
    const msg = cleanText(message)
    content.innerText = message

    // greetings
    if(msg.includes("hello")){
        speak("Hello sir, what can I help you with")
        return
    }

    if(msg.includes("who are you")){
        speak("I am a virtual assistant developed by SARTHI Group")
        return
    }

    // youtube
    if(msg.includes("open youtube") || msg.startsWith("play")){
        const song = msg
            .replace("open youtube","")
            .replace("play","")
            .replace("song","")
            .trim()

        if(!song){
            speak("Opening YouTube")
            setTimeout(()=> window.open("https://youtube.com","_blank"),800)
            return
        }

        speak("Playing " + song)
        setTimeout(()=>{
            window.open(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`,
                "_blank"
            )
        },800)
        return
    }

    // google
    if(msg.includes("open google")){
        speak("Opening Google")
        setTimeout(()=> openApp("https://google.com","https://google.com"),800)
        return
    }

    // calculator
    if(msg.includes("calculate") || msg.includes("what is")){
        calculate(msg)
        return
    }

    // whatsapp
    if(msg.includes("open whatsapp")){
        speak("Opening WhatsApp")
        setTimeout(()=> openApp("whatsapp://","https://web.whatsapp.com"),800)
        return
    }

    // chatgpt
    if(
        msg.includes("open chat gpt") ||
        msg.includes("open chatgpt") ||
        msg.startsWith("search") ||
        msg.startsWith("ask")
    ){
        const query = msg
            .replace(/open chat gpt|open chatgpt|search|ask/g,"")
            .trim()

        speak(query ? "Searching " + query : "Opening ChatGPT")

        setTimeout(()=>{
            window.open(
                query
                    ? `https://chatgpt.com/?q=${encodeURIComponent(query)}`
                    : "https://chatgpt.com/",
                "_blank"
            )
        },800)
        return
    }

    // social
    if(msg.includes("open instagram")){
        speak("Opening Instagram")
        setTimeout(()=> openApp("instagram://app","https://instagram.com"),800)
        return
    }

    if(msg.includes("open facebook")){
        speak("Opening Facebook")
        setTimeout(()=> openApp("fb://facewebmodal/f?href=https://facebook.com","https://facebook.com"),800)
        return
    }

    // time & date
    if(msg.includes("time")){
        speak(new Date().toLocaleTimeString())
        return
    }

    if(msg.includes("date")){
        speak(new Date().toLocaleDateString())
        return
    }

    // ================= FINAL FALLBACK =================
    googleSearch(msg)
}

// ================= EVENTS =================
window.addEventListener("load", wishMe)

btn.addEventListener("click", ()=>{
    recognition.start()
    btn.style.display = "none"
    voice.style.display = "block"
})

recognition.onresult = (e)=>{
    const transcript = e.results[e.resultIndex][0].transcript
    takeCommand(transcript)
}
