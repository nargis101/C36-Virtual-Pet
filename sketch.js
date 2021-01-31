var dog, sadDog, happyDog;
var position, database;
var foodObject, foodStock = 0; 
var feed, add;
var gameState = 0;
var fedTime, lastFed;
var input, button, greeting;
var backgroundImg;
var bg = "Images/day.jpg";



function preload(){
  Dog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");

  getBackgroundImg();
}

function setup() {
  createCanvas(1000,400);
  database = firebase.database();

  foodObject = new Food();
  
  dog=createSprite(800,200,150,150);
  dog.addImage(Dog);
  dog.scale=0.15;

  var dogo = database.ref('Food');
  dogo.on("value", readPosition, showError);

  input = createInput("pet name");
  input.position(725, 50);

  button = createButton("OK");
  button.position(860, 50);

  greeting = createElement('h3');

  feed = createButton("Feed the Dog");
  feed.position(450, 50);
  feed.mousePressed(feedDog);
  
  add = createButton("Add Food");
  add.position(380, 50);
  add.mousePressed(addFood);
}



function draw() {
  if(backgroundImg)
    background(backgroundImg);

  foodObject.display();


  fill(0);
  textSize(15);
  if(fedTime >= 12){
    text("Last Feed: " + fedTime % 12 + " PM", 200, 45)
  } else if(fedTime == 0){
    text("Last Feed : 12AM", 350, 30);
  } else{
    text("Last Feed: " + fedTime + " AM", 200, 45);
  }

  button.mousePressed(function(){
    input.hide();
    button.hide();
    var name = input.value();
    greeting.html("Pet Name:  " + name);
    greeting.position(735, 30);
  })
  

  fedTime = database.ref('fedTime');
  fedTime.on("value", function(data){
    fedTime = data.val();
  });

  feedDog();
  addFood();
  drawSprites();
}


function readPosition(data){
  position = data.val();
  foodObject.updateFoodStock(position);
}

function showError(){
  console.log("Error in writing to the database");
}


//function to update food stock
function feedDog(){
  dog.addImage(happyDog);

  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
      Food: foodObject.getFoodStock(),
      fedTime: hour()
  })
}


//function to add food in stock
function addFood(){
  position++;
  database.ref('/').update({
      Food: position
  }) 
}


async function getBackgroundImg(){
  var response=await fetch("https://worldtimeapi.org/api/timezone/Asia/Colombo");
  var responseJSON=await response.json();
  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11, 13);
  if(hour >= 06 && hour <= 19){
      bg = "Images/day.jpg";
  }
  else{
      bg = "Images/night.png";
  }
  backgroundImg = loadImage(bg)
  console.log(backgroundImg);
};