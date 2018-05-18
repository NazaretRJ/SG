
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
this.MAX_TIME = 1000;

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

    //TODO QUE FUNCIONEN DESLIZADORES
  var action = gui.addFolder('Rotar Player');
    //min,max,incremento
    action.add(GUIcontrols,'angleHead',-30,60,2).name('Rotar cabeza: ').listen();
    //action.add(GUIcontrols,'angleBody',-40,30).name('Rotar cuerpo: ').listen();
    //action.add(GUIcontrols,'height',20,24).name('Alargar brazos: ').listen();

    //robotControls.add (GUIcontrols, 'height', 0, 50, 0.1).name('Height :').listen();
    // The method  listen()  allows the height attribute to be written, not only read

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
      }
      else{
          applicationMode = TheScene.MOVE;
      }
      console.log(applicationMode);
    break;

    case 37://left
    //llamar a funcion
      scene.moveLeft();
    break;
//como se cual es derecha o izquierda si el robot se va moviendo? ??,podemos poner un orientacion.
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
  /*this.mlseg = 0;*/
  this.seg = 0;
  this.mint = 0;
  this.tiempo = new Date();
  this.m_init = this.tiempo.getMinutes();
  this.seg_init = this.tiempo.getSeconds(); 
}

//TODO ARREGLAR CRONO (VA MUY RÁPIDO hay que meterle los milisegundos y etc)

function crono(){
  var visor=document.getElementById("reloj");
  
  /*if(this.mlseg = 1000){
    this.seg ++;
    if(this.seg==60){
      this.seg=0;
      this.mint++;
  
      if(this.mint==this.MAX_TIME){
        this.mint=0;
      }
    }
  }
 
  this.mlseg++;*/
  var m_act = this.tiempo.getMinutes();
  var seg_act = this.tiempo.getSeconds();

  if(seg_act != this.seg_init){
    this.seg++;
    if(this.seg == 60){
      this.mint ++;
    }
  }
    

  this.mint = Math.abs(m_act - this.m_init);
  this.seg = Math.abs(seg_act - this.seg_init);

  visor.innerHTML=this.mint+" "+":"+" "+this.seg;

}

/// It renders every frame
function render() {
  requestAnimationFrame(render);
  stats.update();
  scene.getCameraControls().update ();

  if(applicationMode != TheScene.NO_ACTION){
    scene.animate(GUIcontrols);
    scene.CatchTheFlag();
    scene.colision();
    this.crono();
  }
  //TODO comprobar dead y si es dead se para y muestra otra pantalla
  renderer.render(scene, scene.getCamera());
 
 
}


/*function actualizarVida() {
  var energy = scene.getEnergy();
  
  document.getElementById("Energy").style.width = scene.getEnergy() + "%";
  if(energy <= 50 && energy > 20){
    document.getElementById("Energy").style.background = "#f4d142";
  }
  else{
    if(energy < 20)
    document.getElementById("Energy").style.background="#ff0000";

  }

}

function actualizarPoints(){
  document.getElementById("Points").innerHTML = scene.getPoints();
}*/

/*function Dead(){
  if(scene.getDead()== true){//no tiene energía
    document.getElementById("Dead").style.display = 'initial';
    applicationMode = TheScene.NO_ACTION;
  }
  else
    document.getElementById("Dead").style.display = 'none';
}*/
/*
function getEnergy(){
  return scene.getEnergy();
}

function getPoints(){
  return scene.getPoints();
}
*/





/// The main function
$(function () {
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
