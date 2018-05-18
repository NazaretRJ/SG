
/// The Robot class
/**
 * @author Nazaret
 */

//comparamos los centros y si son menor que la distancia del radio que los une se considera colisión 

class Robot extends THREE.Object3D {

  constructor (parameters) {
    super();
    this.orientacion = 0; // 0-> norte, 1-> sur, 2->este,3->oeste
    // If there are no parameters, the default values are used

    this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xd4af37, specular: 0xfbf804, shininess: 70}) : parameters.material);
    this.distance = 1.5;
    // With these variables, the posititon of the robot is set
    this.alpha = 0.5; //cabeza
    this.MAX_ANGLE_HEAD = 13.9626; //80º
    this.h = 20;
    this.MAX_H_LEG = 24; // 20% 
    this.MIN_H_LEG = 20;
    this.beta = 0; //body
    this.MAX_BODY = 5.23599; // 30º
    this.MIN_BODY = -6.98132; //-40º
    //como no se puede para las dos piernas tener la misma variable
    this.leg1 = new THREE.Object3D();
    this.leg2 = new THREE.Object3D();
    this.stick1 = new THREE.Object3D();//el palo
    this.stick2 = new THREE.Object3D();//el palo

    var robot = this.createRobot();
    //robot.position.x = -200;
    //scale
    this.setHLeg(this.h,this.leg1,this.stick1);
    this.setHLeg(this.h,this.leg2,this.stick2);
    //add to scene
    this.add(robot);
  }

  setRobotPosition(head,body,leg){
    this.setAngleHead(head);
    this.setLeg(leg);
    this.setAngleBody(body);
  }

  SetRobotReinicio(){
    this.position.x = -200;
    this.position.y = 0;
    this.position.z = 0;
    this.setRobotPosition(0,0,0);
  }


  ConvertDegreesToRadians(degrees){
    var n = degrees * 3.1415;

    return n/180.0;
  }

  setAngleHead (anAngle) {
    var n =this.ConvertDegreesToRadians(anAngle);
    if(n <= this.MAX_ANGLE_HEAD && n >= -this.MAX_ANGLE_HEAD  )
      this.alpha = n;
    else
      if(n > 0)
        this.alpha = this.MAX_ANGLE_HEAD;
      else
        this.alpha = -this.MAX_ANGLE_HEAD;
   
    this.head1.rotation.y = this.alpha;

  }
  
  setLeg(distance){
    this.setHLeg(distance,this.leg1,this.stick1);
    this.setHLeg(distance,this.leg2,this.stick2);
  }

  setHLeg(distance,leg,stick){
    if(distance>= this.MIN_H_LEG && distance<= this.MAX_H_LEG)
      this.h = distance;
    else
      this.h = this.MIN_H_LEG;

    stick.scale.y = this.h;
    leg.position.y = -this.h;
    this.robot.position.y = this.h+1.6;
  }

  setAngleBody(anAngle){
    var n = this.ConvertDegreesToRadians(anAngle);
    if(n >= this.MIN_BODY && n <= this.MAX_BODY)
      this.beta = n;
    else{
      if(n > 0)
        this.beta = this.MAX_BODY;
      else
        this.beta = this.MIN_BODY;
    }
    this.body.rotation.z = this.beta;

  }


//It creates the head of the robot

  createHead(){
    //creamos

    this.head1 = new THREE.Object3D();//padre
    var geometry = new THREE.SphereGeometry(0.5, 20, 20);
    var loader = new THREE.TextureLoader();
    
    var material = loader.load("imgs/casco.png");
    console.log(material);
    //MESH con esfera
    var sphere = new THREE.Mesh(geometry,new THREE.MeshPhongMaterial ({map:material}));
      sphere.scale.set(2.2,2.2,2.2);//create light
      this.spotLight = new THREE.SpotLight( 0xffffff,1,75);
      this.spotLight.position.set(2.1,2.1,2.1);
      this.spotLight.castShadow = true;
    this.head1.add(this.spotLight);
    this.head1.add(sphere);

    var geocil = new THREE.CylinderGeometry( 0.5, 0.5, 1, 32 );
    var loader = new THREE.TextureLoader();
    var text = loader.load("imgs/ojo.jpg");
    var cylinder = new THREE.Mesh(geocil,new THREE.MeshPhongMaterial({map:text}));
      cylinder.rotation.z=1.57; //90 grados en Z
      cylinder.scale.set(0.25,0.5,0.25);
      //MESH con cilindro ojo
      var head2 = new THREE.Object3D();
        head2.position.set(0.5,0.75,0.5);
        //añadimos la camara
        var aux = new THREE.Object3D();
          aux.rotation.z=-1.57;
          aux.rotation.x = -1.57
          
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set (0,0,0);
        var look = new THREE.Vector3 (0,0,0);
        this.camera.lookAt(look);//rotar para que mire a donde el cilindro
          aux.add(this.camera);
          cylinder.add(aux);

        //var angle = this.ConvertDegreesToRadians(90);
        //this.camera.rotate.z = 1.57;
        
        

        //cylinder.add(this.camera);


    head2.add(cylinder);
    //juntamos
    this.head1.add(head2);

    this.head1.scale.set(5,5,5);
    //head1.rotation.y=0; //rotation en set
    this.head1.castShadow = true;
    return this.head1;
  }

  createLeg(arm,stick){
    //el hombro
    var leg = new THREE.Object3D();//variable de clase asi se modifica

    var geocil = new THREE.CylinderGeometry( 0.5, 0.5, 1, 32 );
    //var loader = new THREE.TextureLoader();
    //var text = loader.load("imgs/ojo.jpg");
    var mat = new THREE.MeshBasicMaterial( {color: 0x08088A} );
    var cylinder = new THREE.Mesh(geocil,mat);
      cylinder.rotation.x=1.57; //90 grados en Z
      cylinder.scale.set(3,5,3);
    leg.add(cylinder);
    //leg
    
     arm.position.set(0,-1,0)//escalammos a uno y despues en otra funcion escalamos a h
    
    //pie
    var base = new THREE.Object3D();//la base
    var geometry = new THREE.ConeGeometry( 1,1,32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x04B4AE} );
    var cone = new THREE.Mesh( geometry, material );
    base.add(cone);
      base.position.y=-0.25;
      base.scale.set(3,3,3);

    arm.add(base);

    
    var geometry2 = new THREE.CylinderGeometry(0.5,0.5,1,32);
    var cylinder_stick = new THREE.Mesh(geometry2,new THREE.MeshBasicMaterial({color:0x6E6E6E}));
      cylinder_stick.position.y=0.5;
    stick.add(cylinder_stick);
      stick.scale.set(3,1,3); //escalammos a uno y despues en otra funcion escalamos a h
    
    arm.add(stick);
    leg.add(arm);
    return leg;
  }

  createBody(){
    this.body = new THREE.Object3D();//cuerpo con cabeza
      //this.body.rotation.z=this.beta;
      this.body.position.set(0,2,0);
   /* this.body2 = new THREE.Object3D();
    this.body2.rotation.z=this.beta;
    this.body.add(this.body2);*/

    var tronco = new THREE.Object3D();//cuerpo

    var geocil = new THREE.CylinderGeometry( 0.5, 0.5, 1, 32 );
    var loader = new THREE.TextureLoader();
    var text = loader.load("imgs/texturaMetal.jpg");
    var cylinder = new THREE.Mesh(geocil,new THREE.MeshPhongMaterial({map:text}));
      cylinder.position.set(0,-0.5,0);

    tronco.add(cylinder);
      tronco.scale.set(10,20,10);

    var head = this.createHead();

    this.body.add(tronco);
    this.body.add(head);

    return this.body;
  }


  createRobot(){
    var robot1 = new THREE.Object3D();//robot
    this.robot = new THREE.Object3D();//robot
      this.robot.position.y = this.h+1.6;

    var arm1 = new THREE.Object3D();
      arm1.position.set(0,0,6);
      var leg1 = this.createLeg(this.leg1,this.stick1);
      arm1.add(leg1);

      var arm2 = new THREE.Object3D();
        arm2.position.set(0,0,-6);
        var leg2 = this.createLeg(this.leg2,this.stick2);
        arm2.add(leg2);

    var cuerpo = this.createBody();

    robot1.add(cuerpo);
    robot1.add(arm1);
    robot1.add(arm2);
    this.robot.add(robot1);
    return this.robot;
  }
 // 0-> norte, 1-> sur, 2->este,3->oeste
//1.Escalado, 2.Rotacion, 3.Translaciones
 //Por defecto esta mirando a la x+
  moveRight(){
    this.rotation.y -= 0.1;
  }

  moveLeft(){
    this.rotation.y += 0.1;
  }

  moveUp(){
    this.position.x += this.distance*Math.cos(this.rotation.y);
    this.position.z -= this.distance*Math.sin(this.rotation.y); 
  }

  moveDown(){
    this.position.x -= this.distance*Math.cos(this.rotation.y);
    this.position.z += this.distance*Math.sin(this.rotation.y); 
  }

  //controles de camara (camera)
  getCamera () {
    return this.camera;
  }

  
  setCameraAspect (anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }


};
// class variables
Robot.WORLD = 0;
Robot.LOCAL = 1;
