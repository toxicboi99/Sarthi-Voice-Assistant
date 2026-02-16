let btn = document.querySelector("#btn")
let content = document.querySelector("#content")
let voice = document.querySelector("#voice")

// ================= SPEECH SETUP =================
let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
let recognition = new SpeechRecognition()

recognition.continuous = true
recognition.interimResults = false

// ================= SPEAK FUNCTION =================
function speak(text){

    recognition.stop()
    window.speechSynthesis.cancel()

    setTimeout(()=>{

        let t = new SpeechSynthesisUtterance(text)
        t.rate = 1
        t.pitch = 1
        t.volume = 1
        t.lang = "hi-IN"

        t.onend = () => {
            setTimeout(()=>recognition.start(),500)
        }

        window.speechSynthesis.speak(t)

    },300)
}

// ================= OPEN APP =================
function openApp(mobileUrl, desktopUrl){
    if(/Android/i.test(navigator.userAgent)){
        window.location.href = mobileUrl
        setTimeout(()=>{
            window.open(desktopUrl,"_blank")
        },800)
    }else{
        window.open(desktopUrl,"_blank")
    }
}

// ================= GREETING =================
function wishMe(){

    let h = new Date().getHours()

    if(h >= 0 && h < 12){
        speak("Good Morning Sir")
    }
    else if(h >= 12 && h < 16){
        speak("Good Afternoon Sir")
    }
    else if(h >= 16 && h < 21){
        speak("Good Evening Sir")
    }
    else{
        speak("Good Night Sir")
    }
}


// ================= START AFTER LOAD =================
window.addEventListener("load", ()=>{
    wishMe()
})

// ================= MIC RESULT =================
recognition.onresult = (e)=>{
    let i = e.resultIndex
    let transcript = e.results[i][0].transcript
    content.innerText = transcript
    takeCommand(transcript.toLowerCase())
}

// ================= BUTTON (FIRST CLICK REQUIRED) =================
btn.addEventListener("click",()=>{
    recognition.start()
    btn.style.display="none"
    voice.style.display="block"
})

// ================= COMMAND HANDLER =================
function takeCommand(message){

    // HELLO
    if(message.includes("hello")){
        speak("Hello sir, what can I help you")
    }

    else if(message.includes("who are you")){
        speak("I am virtual assistant developed by Abhishek || Ritesh || Suhani")
    }

    // ================= YOUTUBE =================
    else if(message.includes("open youtube") || message.startsWith("play")){

        let song = message
        .replace("hey","")
        .replace("sarthi","")
        .replace("play","")
        .replace("open youtube","")
        .replace("song","")
        .trim()

        if(song.length === 0){
            speak("Opening YouTube")
            window.open("https://www.youtube.com","_blank")
        }else{
            speak("Playing " + song)
            let q = encodeURIComponent(song)
            window.open(`https://www.youtube.com/results?search_query=${q}`,"_blank")
        }
    }

    // ================= CALCULATOR =================
    else if(message.includes("calculate") || message.includes("what is")){

        let text = message
        .replace("calculate","")
        .replace("what is","")
        .trim()

        text = text
        .replaceAll("plus","+")
        .replaceAll("minus","-")
        .replaceAll("into","*")
        .replaceAll("times","*")
        .replaceAll("divide","/")
        .replaceAll("by","/")

        text = text.replace(/[^0-9+\-*/.]/g,"")

        try{
            let result = Function("return " + text)()
            speak("The answer is " + result)
            content.innerText = result
        }catch{
            speak("Sorry calculation failed")
        }
    }

    // ================= SOCIAL APPS =================
    else if(message.includes("open whatsapp")){
        speak("Opening WhatsApp")
        openApp("whatsapp://","https://web.whatsapp.com")
    }

    else if(message.includes("open instagram")){
        speak("Opening Instagram")
        openApp("instagram://app","https://instagram.com")
    }

    else if(message.includes("open facebook")){
        speak("Opening Facebook")
        openApp("fb://facewebmodal/f?href=https://facebook.com","https://facebook.com")
    }

    else if(message.includes("open gmail")){
        speak("Opening Gmail")
        window.open("https://mail.google.com","_blank")
    }

    else if(message.includes("open spotify")){
        speak("Opening Spotify")
        window.open("https://spotify.com","_blank")
    }

    else if(message.includes("open linkedin")){
        speak("Opening LinkedIn")
        window.open("https://linkedin.com","_blank")
    }

    else if(message.includes("open twitter")){
        speak("Opening Twitter")
        window.open("https://twitter.com","_blank")
    }

    else if(message.includes("open amazon")){
        speak("Opening Amazon")
        window.open("https://amazon.in","_blank")
    }

    else if(message.includes("open flipkart")){
        speak("Opening Flipkart")
        window.open("https://flipkart.com","_blank")
    }

    // ================= TIME / DATE =================
    else if(message.includes("time")){
        speak(new Date().toLocaleTimeString())
    }

    else if(message.includes("date")){
        speak(new Date().toLocaleDateString())
    }

    // ================= SEARCH COMMANDS (NO CONFLICT) =================
    else if(message.includes("search on wikipedia")){
        let topic = message.replace("search on wikipedia","").trim()
        speak("Searching Wikipedia for " + topic)
        window.open("https://en.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(topic),"_blank")
    }

    else if(message.includes("search on google")){
        let topic = message.replace("search on google","").trim()
        speak("Searching Google for " + topic)
        window.open("https://www.google.com/search?q=" + encodeURIComponent(topic),"_blank")
    }

    else if(message.includes("search on chatgpt")){
        let topic = message.replace("search on chatgpt","").trim()
        speak("Searching ChatGPT for " + topic)
        window.open("https://chat.openai.com/?q=" + encodeURIComponent(topic),"_blank")
    }

    // ================= JOKE =================
    else if(message.includes("tell me a joke")){
        const jokes=[
            "Why do programmers prefer dark mode? Because light attracts bugs.",
            "Why was the computer cold? Because it forgot to close windows.",
            "Why do Java developers wear glasses? Because they do not see sharp."
        ]
        speak(jokes[Math.floor(Math.random()*jokes.length)])
    }

    // ================= LOCATION =================
    else if(message.includes("my location")){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                speak("Showing your location")
                window.open("https://www.google.com/maps?q="+
                position.coords.latitude+","+position.coords.longitude)
            })
        }
    }

    else{
        speak("Sorry I did not understand that command")
    }
}
    

window.onload=()=>{

let n=localStorage.getItem("va_name")
let img=localStorage.getItem("va_img")

console.log("Loaded:",n,img)

if(n){
document.getElementById("welcome").innerText="Welcome "+n
}

if(img){
document.getElementById("avatar").src=img
}

}

window.addEventListener("load", () => {

    let name = localStorage.getItem("va_name");
    let img = localStorage.getItem("va_img");

    console.log("Loaded:", name, img);

    // Show welcome text
    if (name) {
        document.getElementById("welcome").innerText = "Welcome " + name;
        document.getElementById("name").innerText = name;
    }

    // Show selected avatar
    if (img) {
        document.getElementById("avatar").src = img;
    }

});

