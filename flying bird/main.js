var background = document.getElementById("background");
var startTitle = document.getElementById("startTitle");
var startBird = document.getElementById("startBird");
var grass1 = document.getElementById("grass1");
var grass2 = document.getElementById("grass2");
var startButton = document.getElementById("startButton")


//waving at the starting page
var imgArr = ["image/bird0.png","image/bird1.png"]//store image of bird waving
var wavingTimer = setInterval(waving,300);//300ms wave once
var counter = 0;
var movement = 5;//wave the title how much
function waving(){
    movement *= -1;
    startTitle.style.top = startTitle.offsetTop + movement + "px"
    startBird.src = imgArr[counter++]
    if(counter == 2){
        counter = 0;
    }
}

var baseObj = {
	randomNum: function(min, max) {
		return parseInt(Math.random() * (max - min + 1) + min);
	},

	rectangleCrashExamine: function (obj1, obj2) {
			var obj1Left = obj1.offsetLeft;
			var obj1Width = obj1.offsetLeft + obj1.offsetWidth;
			var obj1Top = obj1.offsetTop;
			var obj1Height = obj1.offsetTop + obj1.offsetHeight;

			var obj2Left = obj2.offsetLeft;
			var obj2Width = obj2.offsetLeft + obj2.offsetWidth;
			var obj2Top = obj2.offsetTop;
			var obj2Height = obj2.offsetTop + obj2.offsetHeight;

			if (!(obj1Left > obj2Width || obj1Width < obj2Left || obj1Top > obj2Height || obj1Height < obj2Top)) {
				return true;
			}
			return false;
	},
};

var bird = {
	flyTimer:null,
	wingTimer:null,
	
	div:document.createElement("div"),
	showBird:function(parentObj) {
		this.div.style.width = "40px";
		this.div.style.height = "28px";
		this.div.style.backgroundImage = "url(image/bird0.png)";
		this.div.style.backgroundRepeat = "no-repeat";
		this.div.style.position = "absolute";
		this.div.style.left = "50px";
		this.div.style.top = "200px";
		this.div.style.zIndex = "1";
		
		parentObj.appendChild(this.div);  
	},
	
	fallSpeed: 0, 
	flyBird: function(){ 
		bird.flyTimer = setInterval(fly,40);
		function fly() {
			bird.div.style.top = bird.div.offsetTop + bird.fallSpeed++ + "px";
			if (bird.div.offsetTop < 0) {  
				bird.fallSpeed = 2; //control to not fly out of the screen
			}
			if (bird.div.offsetTop >= 395) {
				bird.fallSpeed = 0;
				clearInterval(bird.flyTimer); //once reach the ground, clear interval
				clearInterval(bird.wingTimer); 
			}
			if (bird.fallSpeed > 12) {
				bird.fallSpeed = 12;  //max falling speed
			}
		}
	},
	
	wingWave: function() { 
		var up = ["url(image/up_bird0.png)", "url(image/up_bird1.png)"];
		var down = ["url(image/down_bird0.png)", "url(image/down_bird1.png)"];
		var i = 0, j = 0;
		bird.wingTimer = setInterval(wing,100);
		function wing() {
			if (bird.fallSpeed > 0) {
				bird.div.style.backgroundImage = down[i++];
				if (i==2) {i = 0}
            }
            if (bird.fallSpeed < 0) {
				bird.div.style.backgroundImage = up[j++];
				if (j==2) {j = 0}
			}
		}
	},	
};

function Block() {
	this.upDivWrap = null;
	this.downDivWrap = null;
	this.downHeight = baseObj.randomNum(0,150);
	this.gapHeight = baseObj.randomNum(150,160);
	this.upHeight = 312 - this.downHeight - this.gapHeight;

	this.createDiv = function(url, height, positionType, left, top) {
		var newDiv = document.createElement("div");
		newDiv.style.width = "62px";
		newDiv.style.height = height;
		newDiv.style.position = positionType;
		newDiv.style.left = left;
		newDiv.style.top = top;
		newDiv.style.backgroundImage = url; 
		return newDiv;
	};
	
	this.createBlock = function() {
		var upDiv1 = this.createDiv("url(image/up_mod.png)", this.upHeight + "px");
		var upDiv2 = this.createDiv("url(image/up_pipe.png)", "60px");
		this.upDivWrap = this.createDiv(null, null, "absolute", "450px");
		this.upDivWrap.appendChild(upDiv1);
		this.upDivWrap.appendChild(upDiv2);
		
		var downDiv1 = this.createDiv("url(image/down_pipe.png)", "60px");
		var downDiv2 = this.createDiv("url(image/down_mod.png)", this.downHeight +"px");
		this.downDivWrap = this.createDiv(null, null, "absolute", "450px", 363 - this.downHeight + "px");
		this.downDivWrap.appendChild(downDiv1);
		this.downDivWrap.appendChild(downDiv2); 
		
		background.appendChild(this.upDivWrap);
		background.appendChild(this.downDivWrap);
	};
	
	this.moveBlock = function() { 
		this.upDivWrap.style.left = this.upDivWrap.offsetLeft - 5 + "px";
		this.downDivWrap.style.left = this.downDivWrap.offsetLeft - 5 + "px";
	};	
}


var gameOver = document.getElementById("gameOver");
var blocksArr = [];
var blockDistance = baseObj.randomNum(130,250);
//let the grass keep moving 
var grassTimer = setInterval(grassMovement,20);//check every 20ms
function grassMovement(){
    if (grass1.offsetLeft <= -343){
        grass1.style.left = "343px";
    }
    if(grass2.offsetLeft <= -343){
        grass2.style.left = "343px";
    }
    grass1.style.left = grass1.offsetLeft - 5 + "px";
    grass2.style.left = grass2.offsetLeft - 5 + "px";

    if (blocksArr.length) {
        for (var i = 0; i < blocksArr.length; i++) {
            blocksArr[i].moveBlock();
            var x = baseObj.rectangleCrashExamine(blocksArr[i].downDivWrap, bird.div);
            var y = baseObj.rectangleCrashExamine(blocksArr[i].upDivWrap, bird.div);
            var z = bird.div.offsetTop >= 390;
            if (x || y || z) {
                window.clearInterval(grassTimer);
                bird.fallSpeed = 0; 
                background.onclick = null; 
                gameOver.style.display = "block";
            }
        }
        if (blocksArr[blocksArr.length - 1].downDivWrap.offsetLeft < (450 - blockDistance)) {
                blockDistance = baseObj.randomNum(130,250);
                var newBlock = new Block();
                newBlock.createBlock();
                blocksArr.push(newBlock);
        }

        
        if (blocksArr[0].downDivWrap.offsetLeft < -50) {
                background.removeChild(blocksArr[0].downDivWrap);
                background.removeChild(blocksArr[0].upDivWrap);
                blocksArr.shift(blocksArr[0]);
        }
    }
}

//when click the start button
startButton.onclick = function(){
    //clear all the display at the starting page
    startTitle.style.display = "none";
    startBird.style.display = "none";
    startButton.style.display = "none";
    clearInterval(wavingTimer);
    //In game
    bird.showBird(background);
    bird.flyBird();
    bird.wingWave();
    background.onclick = function(){
        bird.fallSpeed = -8;
    };
    var a = new Block();
			a.createBlock();		
			blocksArr.push(a);


}

