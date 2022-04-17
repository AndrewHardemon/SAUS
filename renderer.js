const WIDTH = 800-16
const HEIGHT = 600-59
const SPEED = 3
const COLOR = '#ffffff'
const WALL_THICKNESS = 1;
const AMOUNT = 2 

const DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
    //add more?
}

// Editable Global Variables
const colors = ['#1abc9c', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6']
const sounds = [new Audio("./sound-effects/A0.mp3"),new Audio("./sound-effects/Bb0.mp3"),new Audio("./sound-effects/B0.mp3"),new Audio("./sound-effects/C1.mp3"),new Audio("./sound-effects/Db1.mp3"),new Audio("./sound-effects/D1.mp3"),new Audio("./sound-effects/Eb1.mp3"),new Audio("./sound-effects/E1.mp3")]

const Square = {
    new: function (incrementedSpeed){ //possibly add dynamic positions
        let width = 10;
        let height = 10; 
        return {
            width,
            height,
            x: (WIDTH/2) - (width/2),
            y: (HEIGHT/2) - (height/2),
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
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

const balls = []
for(let i = 0; i < AMOUNT; i++){
    //Create ball with random values
    const ball = Ball.new()
    ball.moveX = Math.ceil(Math.random() * 2) + 2
    ball.moveY = Math.ceil(Math.random() * 2)
    
    ball.sound = sounds[Math.floor(Math.random() * sounds.length)]
    ball.color = colors[Math.floor(Math.random() * colors.length)]
    
    const buffer = WALL_THICKNESS + ball.radius

    ball.x = Math.floor(Math.random() * WIDTH - buffer) + buffer
    ball.y = Math.floor(Math.random() * HEIGHT - buffer) + buffer

    balls.push(ball)
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

    //Create Balls
    balls.forEach((ball) => {
        context.fillStyle = ball.color
        context.beginPath()
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true)
        context.stroke();
        context.fill("evenodd")
    })

    update(...balls)
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
            item.sound.play()
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
            item.sound.play()
        }
    })
}


runProgram()

document.addEventListener("keydown", function(key){
    pause = !pause
    if(!pause){
        runProgram()
    }
})

// const Program = {
//     initialize: function(){
//         this.
//     }
// }