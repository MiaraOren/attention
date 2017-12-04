var canvas_unds = canvas_bored = canvas_diffi = null;
var unds_button = bored_button = diffi_button = null;
var unds_ruler = bored_ruler = diffi_ruler = null;

class button {
    constructor(x, y, width, height, radius) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
     
    }

    draw(ctx) {
        /*
        ctx.globalCompositeOperation = 'xor';
        ctx.lineJoin = "round";
        ctx.lineWidth = this.radius;
        ctx.strokeRect(this.x+(this.radius/2), this.y+(this.radius/2), this.width-this.radius, this.height-this.radius);
        ctx.fillRect(this.x, this.y+(this.radius/2), this.width-this.radius, this.height-this.radius);
        */
        ctx.globalCompositeOperation = 'overlay';
        ctx.beginPath();
        ctx.moveTo(this.x+this.width, this.y);
        ctx.lineTo(this.x+this.width, this.y+120);
        
        var gradient = ctx.createRadialGradient(this.x, this.y, 50, 500, 200,300);
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(1, 'green');
        ctx.fillStyle = gradient;
       
        ctx.stroke();


    }

}

class ruler {

    constructor(x, y, width, height, radius) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
    }

    draw(ctx) {
        
        ctx.lineJoin = "round";
        ctx.lineWidth = this.radius;
        //ctx.strokeRect(this.x+(this.radius/2), this.y+(this.radius/2), this.width-this.radius, this.height-this.radius);
        ctx.fillRect(this.x+(this.radius/2), this.y+(this.radius/2), this.width-this.radius, this.height-this.radius);
    }
}



$(document).ready(function() {

    canvas_unds = document.getElementById('undrstnd-cnvs');
    canvas_bored = document.getElementById('bored-cnvs');
    canvas_diffi = document.getElementById('diffi-cnvs');

    all_canvases = [canvas_unds, canvas_bored, canvas_diffi];

    unds_button = new button(0, canvas_unds.height/4, 5, canvas_unds.height, 5);
    unds_ruler = new ruler(0, canvas_unds.height/2, canvas_unds.width, canvas_unds.height/4, 5);

    bored_button = new button((canvas_bored.width/2)-5, 0, 5, canvas_bored.height, 5);
    bored_ruler = new ruler(0, canvas_bored.height/2, canvas_bored.width, canvas_bored.height/8, 5);

    diffi_button = new button((canvas_diffi.width/2)-5, 0, 5, canvas_diffi.height, 5);
    diffi_ruler = new ruler(0, canvas_diffi.height/2, canvas_diffi.width, canvas_diffi.height/8, 5);
   
    drawButtons();
    drawRulers();
    
    all_canvases.forEach(element => {
        element.addEventListener("click", onMouseDown(canvas_unds));
        element.addEventListener("mouseup", onMouseUp(canvas_unds));
    });
    
});


function onMouseDown(canvas) {
    let temp = canvas;
    return function(e) {
        let rect = temp.getBoundingClientRect();
        let s = {
            'rect.left': rect.left,
            'rect.right': rect.right,
            'rect.width': rect.width,
            'clientX': e.clientX
        }
        unds_button.width = e.clientX-rect.left;
    }
}

function onMouseUp(e) {

}


function drawButtons() {

    canvas_unds.getContext('2d').clearRect(0,0, canvas_unds.width, canvas_unds.height);
    canvas_bored.getContext('2d').clearRect(0,0, canvas_bored.width, canvas_bored.height);
    canvas_diffi.getContext('2d').clearRect(0,0, canvas_diffi.width, canvas_diffi.height);
    
    if(canvas_unds.getContext('2d')) {
        unds_button.draw(canvas_unds.getContext('2d'));
    }

    if (canvas_bored.getContext('2d')) {
        bored_button.draw(canvas_bored.getContext('2d'));
    }

    if (canvas_diffi.getContext('2d')) {
        diffi_button.draw(canvas_diffi.getContext('2d'));
    }

    raf = window.requestAnimationFrame(drawButtons);
}

function drawRulers() {

    
    if(canvas_unds.getContext('2d')) {
        unds_ruler.draw(canvas_unds.getContext('2d'));
    }

    if (canvas_bored.getContext('2d')) {
        bored_ruler.draw(canvas_bored.getContext('2d'));
    }

    if (canvas_diffi.getContext('2d')) {
        diffi_ruler.draw(canvas_diffi.getContext('2d'));
    }

    raf = window.requestAnimationFrame(drawRulers);
    }
