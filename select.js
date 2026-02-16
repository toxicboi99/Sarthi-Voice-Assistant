let chars=document.querySelectorAll(".char")
let selected=""

const slider=document.getElementById("slider")
const left=document.getElementById("left")
const right=document.getElementById("right")

// ================= select + center =================

chars.forEach(c=>{
c.onclick=()=>{
chars.forEach(i=>i.classList.remove("active"))
c.classList.add("active")
selected=c.src

c.scrollIntoView({behavior:"smooth",inline:"center"})
}
})

// ================= arrows =================

right.onclick=()=> slider.scrollLeft+=220
left.onclick=()=> slider.scrollLeft-=220

// ================= submit =================

document.getElementById("submit").onclick=()=>{

let name=document.getElementById("username").value

if(!name||!selected){
alert("Select character & enter name")
return
}

localStorage.setItem("va_name",name)
localStorage.setItem("va_img",selected)

window.location.href="/assistant.html"
}

// ================= drag =================

let down=false,startX,scroll

slider.onmousedown=e=>{
down=true
startX=e.pageX-slider.offsetLeft
scroll=slider.scrollLeft
}

slider.onmouseup=()=>down=false
slider.onmouseleave=()=>down=false

slider.onmousemove=e=>{
if(!down)return
e.preventDefault()
let x=e.pageX-slider.offsetLeft
slider.scrollLeft=scroll-(x-startX)*2
}

// ================= mobile swipe =================

let touchStart=0

slider.addEventListener("touchstart",e=>{
touchStart=e.touches[0].clientX
})

slider.addEventListener("touchend",e=>{
let touchEnd=e.changedTouches[0].clientX
if(touchStart-touchEnd>50) slider.scrollLeft+=220
if(touchEnd-touchStart>50) slider.scrollLeft-=220
})

// ================= auto slide =================

setInterval(()=>{
slider.scrollLeft+=0
if(slider.scrollLeft>=slider.scrollWidth-slider.clientWidth){
}
},3000)
