let WIDTH = window.innerWidth || 800-16
let HEIGHT = window.innerHeight || 600-59
const SPEED = parseInt(window.localStorage.getItem("speedCount")) || 3
const COLOR = '#ffffff'
const WALL_THICKNESS = 1;
const AMOUNT = parseInt(window.localStorage.getItem("ballCount")) || 2
const ITEM = window.localStorage.getItem("shapeType") || "ball" 
const SCALE = window.localStorage.getItem("scaleChoice") || "none"
const UNIQUE = window.localStorage.getItem("uniqueChoice");

const DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
    //add more?
}

// Editable Global Variables
const colors = JSON.parse(window.localStorage.getItem("colorList")) || ['#1abc9c', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6']
// const sounds = [new Audio("./sound-effects/A0.mp3"),new Audio("./sound-effects/Bb0.mp3"),new Audio("./sound-effects/B0.mp3"),new Audio("./sound-effects/C1.mp3"),new Audio("./sound-effects/Db1.mp3"),new Audio("./sound-effects/D1.mp3"),new Audio("./sound-effects/Eb1.mp3"),new Audio("./sound-effects/E1.mp3")]
const scaleObj = {"a": 0, "a#": 1, "b": 2, "c": 3, "c#": 4, "d": 5, "d#": 6, "e": 7, "f": 8, "f#": 9, "g": 10, "g#": 11}
let soundList = ["./sound-effects/a3.mp3","./sound-effects/aS3.mp3","./sound-effects/b3.mp3","./sound-effects/c3.mp3","./sound-effects/cS3.mp3","./sound-effects/d3.mp3","./sound-effects/dS3.mp3","./sound-effects/e3.mp3","./sound-effects/f3.mp3","./sound-effects/fS3.mp3","./sound-effects/g3.mp3","./sound-effects/gS3.mp3"]

let sounds = []

const minor = [2, 1, 2, 2, 1, 2, 2]
const major = [2, 2, 1, 2, 2, 2, 1]

const key = SCALE.split(" ")[0];
const scale = SCALE.split(" ")[1] === "minor" ? minor : major

if(key !== "none" && scale !== "none"){
    soundList = soundList.slice(scaleObj[key]).concat(soundList.slice(0,scaleObj[key]))
    
    let index = 0;
    for(let i = 0; i < scale.length; i++){
        sounds.push(soundList[index])
        index += scale[i]
    }
} else {
    sounds = soundList
}

console.log(sounds)

// A Major = A B C# D E F# G#
// A Minor = A B C D E F G

const Square = {
    new: function (color, sound, incrementedSpeed){ //possibly add dynamic positions
        let width = 10;
        let height = 10; 
        return {
            // radius: (width+height)/4,
            width,
            height,
            x: (WIDTH/2) - (width/2),
            y: (HEIGHT/2) - (height/2),
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            color,
            sound,
            speed: incrementedSpeed || SPEED
        }
    }
}

const Ball = {
    new: function (color, sound, incrementedSpeed){ //possibly add dynamic positions
        let radius = 10;
        return {
            radius,
            x: (WIDTH/2) - radius,
            y: (HEIGHT/2) - radius,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            color,
            sound,
            speed: incrementedSpeed || SPEED
        }
    }
}

const Wall = {
    new: function (side) {
        //Initialize the Height and Width
        let width, height;

        if(side === "left" || side === "right") {
            width = WALL_THICKNESS
            height = HEIGHT
        } else if (side === "up" || side === "down"){
            width = WIDTH
            height = WALL_THICKNESS
        } else {
            throw new Error("Side is an invalid property (init height width)")
        }

        //Initialize the x y coordinates
        let x, y;
        switch(side){
            case "up": x = 0; y = HEIGHT-WALL_THICKNESS;
                break;
            case "down": x = 0; y = 0;
                break;
            case "left": x = 0; y = 0;
                break;
            case "right": x = WIDTH-WALL_THICKNESS; y = 0;
                break;
            default:
                throw new Error("Side is an invalid property (init x y)")
        }

        return {
            width,
            height,
            x,
            y,
            move: DIRECTION.IDLE, //should always be IDLE,
            speed: 0 //possibly null
        }
    }
}

//Choosing shape
let Item;
switch(ITEM){
    case "ball":
        Item = Ball;
        break;
    case "square":
        Item = Square;
        break;
    default:
        throw new Error("Invalid property");
}


const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

// Initialize Canvas
canvas.width = WIDTH;
canvas.height = HEIGHT;

let pause = false;
const runProgram = () => {
    //Grab data from localstorage or elsewhere
    //Draw the Canvas
    update();
    draw();

    if(!pause){
        // runProgram()
    }

    // // const item1 = document.createElement("span")
    // const item1 = document.getElementById("item1")
    // // document.body.appendChild(item1)
    // item1.classList.add("dot")
    // item1.classList.add("dialog")
    // // item1.style.transform = "translateY(1000px)"
    // // item1.style.transition = "all 6s"
    
}

const wall_up = Wall.new("up");
const wall_down = Wall.new("down")
const wall_left = Wall.new("left")
const wall_right = Wall.new("right")

const walls = [wall_up, wall_down, wall_left, wall_right]
// const balls = []
// colors.forEach(color => {
//     const ball = Ball.new()
//     ball.moveX = Math.ceil(Math.random() * 4)
//     ball.moveY = Math.ceil(Math.random() * 4)
//     ball.color = color
//     // ball.moveX = DIRECTION.RIGHT
//     // ball.moveY = DIRECTION.DOWN
//     // context.fillStyle = color
//     ball.x = Math.ceil(Math.random() * WIDTH)
//     ball.y = Math.ceil(Math.random() * HEIGHT)
// })

function randomize(arr, remainArr){
    const item = remainArr[Math.floor(Math.random() * remainArr.length)]
    const index = remainArr.indexOf(item)
    let startArr = remainArr.slice(0, index)
    let endArr = remainArr.slice(index+1)
    let newArr = startArr.concat(endArr)

    console.log(index, startArr, endArr, newArr)
    return {item, newArr}
}

const items = [];
let remainSounds = [...sounds];
let remainColors = [...colors];
for(let i = 0; i < AMOUNT; i++){
    //Create item with random values
    const item = Item.new()
    item.moveX = Math.ceil(Math.random() * 2) + 2
    item.moveY = Math.ceil(Math.random() * 2)
    
    if(UNIQUE){
        const {item: sound, newArr: newSounds} = randomize(sounds, remainSounds)
        if(newSounds.length <= 1){
            remainSounds = [...sounds]
        } else {
            remainSounds = [...newSounds]
        }
        item.sound = sound
        const {item: color, newArr: newColors} = randomize(colors, remainColors)
        if(newColors.length <= 1){
            remainColors = [...colors]           
        } else {
            remainColors = [...newColors]
        }
        item.color = color
    } else {
        item.sound = sounds[Math.floor(Math.random() * sounds.length)]
        item.color = colors[Math.floor(Math.random() * colors.length)]
    }
    const buffer = WALL_THICKNESS + item.radius

    item.x = Math.floor(Math.random() * WIDTH - buffer) + buffer
    item.y = Math.floor(Math.random() * HEIGHT - buffer) + buffer

    items.push(item)
}

const draw = () => {
    //Clear Canvas
    context.clearRect(0,0,WIDTH,HEIGHT)
    //Fill Canvas
    context.fillStyle = "white"
    context.fillRect(0,0,WIDTH,HEIGHT)
    
    //Create Walls
    walls.forEach(wall => {
        context.fillStyle = "black"
        context.fillRect(wall.x, wall.y, wall.width, wall.height)
        // context.fillStyle = "red"
    })

    //Create Itemss
    items.forEach((item) => {
        context.fillStyle = item.color
        context.beginPath()
        context.arc(item.x, item.y, item.radius, 0, Math.PI * 2, true)
        context.stroke();
        context.fill("evenodd")
    })

    update(...items)
    console.log("hello")
    if(!pause){
        setTimeout(()=> {
            requestAnimationFrame(draw)
        }, 1000/60)
    }
}



const update = (...rest) => {
    rest.forEach(item => {
        // Change X location
        if(item.moveX === DIRECTION.RIGHT){
            item.x += item.speed 
        } else if(item.moveX === DIRECTION.LEFT){
            item.x -= item.speed
        } else {
            console.log("Help", item.moveX)
        }
    
        // X Axis Bounce
        if(item.x <= WALL_THICKNESS || item.x >= WIDTH - WALL_THICKNESS) {
            item.moveX = item.moveX === DIRECTION.RIGHT ? DIRECTION.LEFT : DIRECTION.RIGHT
            const audio = new Audio(item.sound)
            audio.volume = 0.2
            audio.play()
        }
        
        // Change Y location
        if(item.moveY === DIRECTION.UP){
            item.y += item.speed 
        } else if(item.moveY === DIRECTION.DOWN){
            item.y -= item.speed
        }else {
            console.log("Help", item.moveY)
        }
    
        // Y Axis Bounce
        if(item.y <= WALL_THICKNESS || item.y >= HEIGHT - WALL_THICKNESS) {
            item.moveY = item.moveY === DIRECTION.UP ? DIRECTION.DOWN : DIRECTION.UP
            const audio = new Audio(item.sound)
            audio.volume = 0.2
            audio.play()
        }
    })
}

// const uniquify = (arr) => {
//     const obj = arr.reduce((acc, cur) => ({...acc, cur: }))

// }


runProgram()

document.addEventListener("keydown", function({key}){
    if(key === "q"){
        window.location.href = "./options.html"
        return;
    } else if (key === "r") {
        window.location.href = "./index.html"
        return;
    }
    pause = !pause
    if(!pause){
        runProgram()
    }
})

// window.addEventListener("resize", function(){
//     WIDTH = window.innerWidth
//     HEIGHT = window.innerHeight
//     canvas.width = WIDTH;
//     canvas.height = HEIGHT;

// })

// const Program = {
//     initialize: function(){
//         this.
//     }
// }

