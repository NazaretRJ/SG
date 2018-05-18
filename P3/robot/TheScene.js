
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends THREE.Scene {

  constructor (renderer) {
    super();
    this.MAX_COLISION = 10;
    this.NIVEL_1 = 30;
    this.NIVEL_2 = 90;
    this.NIVEL_3 = 150;
    // Attributes

    this.ambientLight = null;
    this.spotLight = null;
    this.camera = null;
    this.trackballControls = null;
    this.player = null;
    this.ground = null;
    this.flag = null;
    this.objs = null;
    this.zone = null;

    this.actual = new Array();

    this.camera_global = true;
    this.dead = false;

    this.createLights ();
    this.createCamera (renderer);
    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);
    this.model = this.createModel ();
    this.add (this.model);
  }

  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (60, 30, 60);
    var look = new THREE.Vector3 (0,20,0);
    this.camera.lookAt(look);

    this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
    this.trackballControls.rotateSpeed = 5;//para segunda camara no hace falta
    this.trackballControls.zoomSpeed = -2;
    this.trackballControls.panSpeed = 0.5;
    this.trackballControls.target = look;

    this.add(this.camera);
  }

  /// It creates lights and adds them to the graph
  createLights () {
    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (this.ambientLight);

    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 60, 60, 40 );
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width=2048
    this.spotLight.shadow.mapSize.height=2048;
    this.add (this.spotLight);
  }

  /// It creates the geometric model: robot and ground
  /**
   * @return The model
   */
  createModel () {
    var model = new THREE.Object3D();
    this.player = new Player({});
    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/wood.jpg");
    this.ground = new Ground (1000, 500, new THREE.MeshPhongMaterial ({map: textura}), 4);
    model.add (this.ground);
    this.flag = new Flag();
    model.add(this.flag);

    this.level = 0;
    this.tope = 1;
    this.MAX_OBJS = 8;
    this.objs = new THREE.Object3D();
    var i;

    for( i = 0; i < this.MAX_OBJS; i++){
      var objs_i = new Obstaculo(this.ground.width,this.ground.deep,
        this.flag.position.x,this.flag.position.z,
        this.player.position.x,this.player.position.z);
      this.objs.add(objs_i);
    }

    this.player.position.x = 100;
    model.add(this.player);
    model.add(this.objs);

    this.zone = new Zone(this.ground.deep,this.ground.width);
    model.add(this.zone);
    return model;
  }
/*
  RobotOutofBorders(){
    var posx = this.robot.position.x;
    var posz = this.robot.position.z;
    if(posx < 0){
      posx = posx * -1;
    }
    if(posz < 0)
      posz = posz * -1;



    if(posx > this.ground.width/2 || posz > this.ground.width/2){
      this.dead = true;
    }
  
  }
*/
  // Public methods

  animate (controls) {
    this.axis.visible = controls.axis;
    this.spotLight.intensity = controls.lightIntensity;
    this.player.moveHeadVertical(controls.angleHead);
  }




  changeCamera(){
    this.camera_global = !this.camera_global ;
  }

  /// It returns the camera
  /**
   * @return The camera
   */
  getCamera () {
    if(this.camera_global== true)
      return this.camera;
    else
      return this.player.getCamera();
  }

  /// It returns the camera controls
  /**
   * @return The camera controls
   */

//if the robot camera is active,render can modify the global camera 
  getCameraControls () {
      return this.trackballControls;

  }

  /// It updates the aspect ratio of the camera
  /**
   * @param anAspectRatio - The new aspect ratio for the camera
   */
  setCameraAspect (anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }

  getMouse (event) {
    var mouse = new THREE.Vector2 ();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = 1 - 2 * (event.clientY / window.innerHeight);
    return mouse;
  }
  //para alargar los brazos
  PredicionChoqueUP(){
    var choque = false;
    var i;
    if(this.actual != null){
      for(i = 0; i<this.actual.length && choque == false;i++){
        var MAX = this.objs.children[this.actual[i]].getRadio()+this.player.getRad();
        var posiciones = this.player.PredecirChoqueUP();
        var distancia_x = Math.abs(posiciones[0]-this.objs.children[this.actual[i]].position.x);
        var distancia_z = Math.abs(posiciones[1]-this.objs.children[this.actual[i]].position.z);
        var distancia = Math.sqrt(distancia_x*distancia_x + distancia_z*distancia_z);//modulo

        if(distancia < MAX ){
          choque = true;
        }
      }

    }


  return choque;    
  }

  PredicionChoqueDOWN(){
    var choque = false;
    var i;
    if(this.actual != null){
      for(i = 0; i<this.actual.length && choque == false;i++){
        var MAX = this.objs.children[this.actual[i]].getRadio()+this.player.getRad();
        var posiciones = this.player.PredecirChoqueDOWN();
        var distancia_x = Math.abs(posiciones[0]-this.objs.children[this.actual[i]].position.x);
        var distancia_z = Math.abs(posiciones[1]-this.objs.children[this.actual[i]].position.z);
        var distancia = Math.sqrt(distancia_x*distancia_x + distancia_z*distancia_z);//modulo

        if(distancia < MAX ){
          choque = true;
        }
      }

    }
    return choque;
    
  }

  moveLeft(){
    this.player.moveLeft();
  }

  moveUp(){

      if(!this.PredicionChoqueUP()){ // se aleja
        this.player.moveUp();
    
      }

  }

  moveRight(){
    this.player.moveRight();
  }

  moveDown(){

      if(!this.PredicionChoqueDOWN()){ // se aleja
        this.player.moveDown();
    
      }
    
  }

  moveHeadRight(){
    this.player.moveHeadRight();
  }

  moveHeadLeft(){
    this.player.moveHeadLeft();
  }


  PositionPlayerFlag(){
    var c_x = Math.abs(this.player.position.x - this.flag.position.x);
    var c_y = Math.abs(this.player.position.y - this.flag.position.y);
    var c_z = Math.abs(this.player.position.z - this.flag.position.z);
    if(c_x <= this.MAX_COLISION && c_z <= this.MAX_COLISION && c_y <= this.MAX_COLISION){
      return true;
    }
    else
      return false;
  }

  CatchTheFlag(){
    var colision = this.PositionPlayerFlag();
    //console.log(colision);
    if(colision == true && this.player.getHaveFlag()== false){
      this.flag.ChangeTaken();
      this.player.setHaveFlag(true);
    }
    else{
      if(this.player.getHaveFlag() == false && this.flag.getTaken() == true){ //no la tiene y marca que la tiene
        this.flag.ChangeTaken(); //la ponemos visible
      }
    }
  }
//primero animar

  /*animar_obstaculos(){
    var i;

    for(i = 0; i < this.MAX_OBJS; i++){
      this.objs.children[i].animar(this.flag.position.x,this.flag.position.z,this.player.position.x,this.player.position.z);
    }
  }*/
/*animar_obstaculos(){
  console.log("Entro en animar");
}*/
  colision(){
      var i;

      for(i = 0; i < this.MAX_OBJS; i++) 
        if(this.calcular_colision(this.objs.children[i]) == true){
          this.actual.push(i);
          this.objs.children[i].changeOrientacion();
        }
        else{
          this.objs.children[i].animar();
        }

  }

  // Colision with other objsects

  calcular_colision(objs){
    var MAX_COLISION_objs = objs.getRadio() + this.player.getRad();
    var colision = false;
    var long = Math.abs(this.player.position.x - objs.position.x);
    var longz = Math.abs(this.player.position.z - objs.position.z);
    //var longy = Math.abs(this.player.position.y - objs.position.y);


    if(long <= MAX_COLISION_objs && longz <= MAX_COLISION_objs){
      return true;
    }
    else{
      return false;
    }

  }

}

  // class variables

  // Application modes
  TheScene.NO_ACTION = 0;
  TheScene.MOVE = 4;
  TheScene.ROTATE_HEAD = 1;
  TheScene.ROTATE_BODY = 2;
  TheScene.MOVE_LEG = 3;
  // Actions
  TheScene.MOVE_ROBOT = 0;
  TheScene.MOVE_BOX = 1;
  TheScene.SELECT_BOX = 2;
  TheScene.ROTATE_BOX = 3;
  TheScene.END_ACTION = 10;
