// Display color list to input
const colorListEl = document.querySelector("#color-list")
const colorListArr = JSON.parse(window.localStorage.getItem("colorList")) || []
colorListEl.value = colorListArr.toString()

function runCode(){
    // Get Values
    let ballCount = parseInt(document.querySelector("#ball-count").value)
    let speedCount = parseInt(document.querySelector("#speed-count").value)

    const keyChoiceEl = document.querySelector("#key-choice")
    const keyChoice = keyChoiceEl.options[keyChoiceEl.selectedIndex].value
    const scaleChoiceEl = document.querySelector("#scale-choice")
    const scaleChoice = scaleChoiceEl.options[scaleChoiceEl.selectedIndex].value

    const uniqueChoice = document.querySelector("#unique-choice").checked

    // Validation
    if(isNaN(ballCount)) ballCount = 3 
    if(ballCount <= 0 || ballCount > 20) ballCount = 3

    if(isNaN(speedCount)) speedCount = 3
    if(speedCount <= 0 || speedCount > 10) speedCount = 3

    // Color List
    const colors = colorListEl.value.split(",")
        .map(color => color.trim())
        .filter(color => color[0] === "#" && color.length === 7)

    // Save to localstorage
    window.localStorage.setItem("ballCount", ballCount);
    window.localStorage.setItem("speedCount", speedCount);
    window.localStorage.setItem("colorList", colors.length >= 1 ? JSON.stringify(colors) : "");
    window.localStorage.setItem("scaleChoice", `${keyChoice} ${scaleChoice}`);
    window.localStorage.setItem("uniqueChoice", uniqueChoice);

    // Change Page
    window.location.href = "./index.html"
}




document.querySelector("#runBtn").addEventListener("click", runCode);