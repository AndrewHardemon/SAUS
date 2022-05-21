// Display color list to input
const colorListEl = document.querySelector("#color-list")
const colorListArr = JSON.parse(window.localStorage.getItem("colorList")) || ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#008000", "#0000FF", "#00008B", "#800080"]
colorListEl.value = colorListArr.toString()

function runCode(){
    // Get Values
    let ballCount = parseInt(document.querySelector("#ball-count").value)
    let speedCount = parseInt(document.querySelector("#speed-count").value)
    let sizeChoice = parseInt(document.querySelector("#size-choice").value)

    const keyChoiceEl = document.querySelector("#key-choice")
    const keyChoice = keyChoiceEl.options[keyChoiceEl.selectedIndex].value
    const scaleChoiceEl = document.querySelector("#scale-choice")
    const scaleChoice = scaleChoiceEl.options[scaleChoiceEl.selectedIndex].value

    const uniqueChoice = document.querySelector("#unique-choice").checked

    // Validation
    if(isNaN(ballCount)) ballCount = 7
    if(ballCount <= 0 || ballCount > 500) ballCount = 7

    if(isNaN(speedCount)) speedCount = 3
    if(speedCount <= 0 || speedCount > 100) speedCount = 3

    if(isNaN(sizeChoice)) sizeChoice = 10
    if(sizeChoice <= 0 || sizeChoice > 1000) sizeChoice = 10

    // Color List
    const colors = colorListEl.value.split(",")
        .map(color => color.trim())
        .filter(color => color[0] === "#" && color.length === 7)
    console.log(colors)
    // Save to localstorage
    window.localStorage.setItem("ballCount", ballCount);
    window.localStorage.setItem("speedCount", speedCount);
    window.localStorage.setItem("sizeChoice", sizeChoice);

    if(colors.length >= 1){
        window.localStorage.setItem("colorList", JSON.stringify(colors));
    }

    window.localStorage.setItem("scaleChoice", `${keyChoice} ${scaleChoice}`);
    window.localStorage.setItem("uniqueChoice", uniqueChoice);

    // Change Page
    window.location.href = "./index.html"
}




document.querySelector("#runBtn").addEventListener("click", runCode);