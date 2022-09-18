const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorsBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor="#000";

window.addEventListener("load", function(){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
})

function drawRect(e){
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

function drawCircle(e) {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2)+ Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2*Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

function drawTriangle(e) {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

function startDraw(e){
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawing(e){
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if(selectedTool === "brush" || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }else if(selectedTool === "rectangle"){
        drawRect(e);
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }else {
        drawTriangle(e);
    }
}

toolBtns.forEach((btn)=>{
    btn.addEventListener("click", function(){
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
})

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value)

colorsBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
})

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener("click", function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

saveImg.addEventListener("click", function() {
    const link = document.createElement("a");
    link.download = `${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
})

canvas.addEventListener("mouseup", ()=>isDrawing=false);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);