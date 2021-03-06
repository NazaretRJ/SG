
/// Several functions, including the main

/// The scene graph
scene = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

/// The current mode of the application
applicationMode = TheScene.NO_ACTION;


//Time 
this.MAX_TIME = 1;
//reloj
this.parar = false;

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
  GUIcontrols = new function() {
    this.axis = true;
    this.lightIntensity = 0.5;
    
    this.angleHead = 0;
    this.height = 20;
    this.angleBody = 0;
  }

  var gui = new dat.GUI();
  var axisLights = gui.addFolder ('Axis and Lights');
    axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
    axisLights.add(GUIcontrols, 'lightIntensity', 0, 1.0).name('Light intensity :');

  var action = gui.addFolder('Rotar Player');
    action.add(GUIcontrols,'angleHead',-30,60,2).name('Rotar cabeza: ').listen();

  if (withStats)
    stats = initStats();
}

/// It adds statistics information to a previously created Div
/**
 * @return The statistics object
 */
function initStats() {

  var stats = new Stats();

  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  $("#Stats-output").append( stats.domElement );

  return stats;
}

/// It shows a feed-back message for the user
/**
 * @param str - The message
 */
function setMessage (str) {
  document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
}




function onKeyDown(event){
  var keycode = event.keyCode;

  //console.log(keycode);
  switch(keycode){

    case 32: //menu, space

      if(applicationMode != TheScene.NO_ACTION){
        applicationMode = TheScene.NO_ACTION;
        document.getElementById("menu").style.display = "block";
      }
      else{
        if(this.restart == true){
          start();
        }
        else{
          document.getElementById("menu").style.display = "none";
          applicationMode = TheScene.MOVE;
        }
      }
      //console.log(applicationMode);
    break;

    case 37://left
    //llamar a funcion
      scene.moveLeft();
    break;

    case 38://up
      scene.moveUp();
    break;

    case 39: //right
      scene.moveRight();
    break;

    case 40://down
      scene.moveDown();
    break;

    case 69://E
      scene.moveHeadRight();
    break;

    case 70://F
      scene.moveHeadLeft();
    break;


    case 86: //cambiar de camara V
      scene.changeCamera();
    break;


  }

}

/// It processes the window size changes
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}

/// It creates and configures the WebGL renderer
/**
 * @return The renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  this.crono_start();
  return renderer;
}

//crono

function crono_start(){
  this.mlseg = 0;
  this.centseg = 0;
  this.seg = 0;
  this.mint = this.MAX_TIME;
  this.parar = false;

}



function crono(){
  var visor=document.getElementById("reloj");
  
    this.centseg ++;

    if(this.centseg == 100){
      this.seg--;
      this.centseg = 0;
      if(this.seg <= 0){
        if(this.mint <= 0 && this.seg <= 0){
          //console.log("entro");
          this.parar = true;
        }
        else{
          this.mint --;
          this.seg = 59;
        }
          
      }
    }


  visor.innerHTML=this.mint+" "+":"+" "+this.seg;

}

function start(){
  document.getElementById("winner").style.display = "none";
  document.getElementById("dead").style.display = "none";
  document.getElementById("Flag").style.display = "none";
  //applicationMode = TheScene.NO_ACTION;
  crono_start();
  this.restart = false;
  //scene.restart();
}
//TODO PORQUE ESCENA ES NULL??


/// It renders every frame
function render() {
  requestAnimationFrame(render);
  stats.update();
  scene.getCameraControls().update ();
  //console.log(this.parar);
    if(applicationMode != TheScene.NO_ACTION && this.parar == false){
      scene.animate(GUIcontrols);
      scene.CatchTheFlag();
      scene.colision();
      this.crono();
      if(scene.player.getHaveFlag() == true){
        document.getElementById("Flag").style.display = "block";
      }
      if(scene.IsWinner() == true){
        document.getElementById("winner").style.display = "block";
        this.restart = true;
      }
    }
    else{
      if(this.parar == true){
        if(scene.IsWinner() == true){
          document.getElementById("winner").style.display = "block";
        }
        else
          document.getElementById("dead").style.display = "block";

        this.restart = true;
      }
    
    }
  //TODO comprobar dead y si es dead se para y muestra otra pantalla
  renderer.render(scene, scene.getCamera());
 
 
}




/// The main function
$(function () {
  start();
  // create a render and set the size

  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // liseners
  window.addEventListener("keydown",onKeyDown,true);//keypress
  window.addEventListener ("resize", onWindowResize);
  /*window.addEventListener ("mousemove", onMouseMove, true);
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener ("mouseup", onMouseUp, true);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox
*/
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new TheScene (renderer.domElement);

  createGUI(true);

  render();
});
