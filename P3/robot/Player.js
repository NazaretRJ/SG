
/// The Robot class
/**
 * @author Nazaret
 */


class Player extends THREE.Object3D {

    constructor (parameters) {
        super();
        this.type = 'player';
        this.HaveFlag = false;
        this.distance = 1.5;
        //Angles
        this.a_wheel_d = 0; //degrees
        //radians
        this.a_arm1 = 0;
        this.a_arm2 = 0;
        this.a_head_x = 0;
        this.a_head_y = 0;
        
        this.MAX_HEAD_X = this.ConvertDegreesToRadians(60);
        this.MAX_HEAD_Y = this.ConvertDegreesToRadians(50);
        this.MIN_HEAD_X = this.ConvertDegreesToRadians(-60);
        this.MIN_HEAD_Y = this.ConvertDegreesToRadians(-30);

        this.MAX_ARM = this.ConvertDegreesToRadians(45);

        this.MAX_RAD = 15;

        var player = this.createPlayer();
        //this.add(player);
        this.add(player);
    }

    getType(){
        return this.type;
    }
    
    getHaveFlag(){
        return this.HaveFlag;
    }

    setHaveFlag(taken){
        this.HaveFlag = taken;
    }

    getRad(){
        return this.MAX_RAD;
    }

   ConvertDegreesToRadians(degrees){
        var n = degrees * 3.1415;
        return n/180.0;
    }

    createWheel(){
        var geocil = new THREE.CylinderGeometry( 0.5, 0.5, 1, 32 );
        var loader = new THREE.TextureLoader();
        var material = loader.load("imgs/rueda.png");
        this.cylinder = new THREE.Mesh(geocil,new THREE.MeshPhongMaterial ({map:material}));
        
        var wheel = new THREE.Object3D();

        var w1 = new THREE.Object3D();
            w1.position.y = 0.5;
            w1.add(this.cylinder);

        var w2 = new THREE.Object3D();
            w2.rotation.z = this.ConvertDegreesToRadians(90);
            w2.scale.set(20,5,20);
            w2.add(w1);
        
        
        wheel.add(w2);

        return wheel;

    }


    createArm(){
        this.arm = new THREE.Object3D();//father

        var geocil = new THREE.CylinderGeometry(2.5, 2.5, 15, 32);
        var mat = new THREE.MeshBasicMaterial( {color: 0x08888A} );
        //arm
        var stick = new THREE.Mesh(geocil,mat);
        var a0 = new THREE.Object3D();//father of hand and arm

        var a1 = new THREE.Object3D();
            a1.position.set(0,7.5,0);
            a1.add(stick);
        
        var a2 = new THREE.Object3D();
            a2.rotation.x = this.ConvertDegreesToRadians(90) ;
            //a2.add(stick);
        a2.add(a1);
        a0.add(a2);
        
        //shoulder
        var geocil2 = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        var mat2 = new THREE.MeshBasicMaterial( {color: 0x08808B} );
        var cylinder2 = new THREE.Mesh(geocil2,mat2);
        
        var a3 = new THREE.Object3D();
            a3.position.y = 0.5;
            a3.add(cylinder2);
        
        var a4 = new THREE.Object3D();
            a4.scale.set(5,5,5);
            a4.rotation.z = this.ConvertDegreesToRadians(90);
            a4.position.x = 2.5;
        
        a4.add(a3);
        //hand

        var geometry = new THREE.SphereGeometry(2.5, 20, 20);
        var loader = new THREE.TextureLoader();
        var material = loader.load("imgs/cabeza.jpg");
        var sphere = new THREE.Mesh(geometry,new THREE.MeshPhongMaterial ({map:material}));
            sphere.position.set(0,0,15);
        
        a0.add(sphere);

        this.arm.rotation.x = this.a_arm1;
        
        this.arm.add(a4);
        this.arm.add(a0);

        return this.arm;
    }


    createHead(){
        var geometry = new THREE.SphereGeometry(10, 20, 20);
        var loader = new THREE.TextureLoader();
        var material = loader.load("imgs/cabeza.jpg");
        var sphere = new THREE.Mesh(geometry,new THREE.MeshPhongMaterial ({map:material}));
        
        //create a camera
        var cam = new THREE.Object3D();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set (0,0,0);
        var look = new THREE.Vector3 (0,0,0);
        this.camera.lookAt(look);//rotar para que mire a donde el cilindro
        
        cam.add(this.camera);
            cam.rotation.y = this.ConvertDegreesToRadians(180);
        
          sphere.add(cam);

        return sphere;
    }


    createBody(){
        var geometry = new THREE.BoxGeometry( 20, 20, 20 );
        var loader = new THREE.TextureLoader();
        var material = loader.load("imgs/cabeza.jpg");
        var cube = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial ({map:material}) );
        cube.position.y = 10;

        return cube;
    }


    createPlayer(){
        var cube = this.createBody();
        //body
        var body = new THREE.Object3D();
            body.add(cube);
        //head
        var head = new THREE.Object3D();
            head.position.y = 20;
            this.sphere = this.createHead();
            head.add(this.sphere);

        body.add(head);

        //arms
        this.arm1 = this.createArm();
        this.arm2 = this.createArm();

        var b_arm1 = new THREE.Object3D();
            b_arm1.position.y = 15;
            b_arm1.position.x = 12.5;
            //b_arm1.position.z   = 5;
            b_arm1.add(this.arm1);
        
        var b_arm2 = new THREE.Object3D();
            b_arm2.position.y = 15;
            b_arm2.position.x = -12.5;
           // b_arm2.position.z = 5;
            b_arm2.add(this.arm2);

        body.add(b_arm1);
        body.add(b_arm2);

        body.position.y = 10;
        //wheel
        var body2 = new THREE.Object3D();
        this.wheel = this.createWheel();
        this.wheel2 = this.createWheel();

        var b_wheel = new THREE.Object3D();
            b_wheel.position.y = 10;
            b_wheel.position.x = 15;
            b_wheel.add(this.wheel);
        
        var b_wheel2 = new THREE.Object3D();
            b_wheel2.position.y = 10;
            b_wheel2.position.x = -10;
            b_wheel2.add(this.wheel2);

        body2.add(b_wheel);
        body2.add(b_wheel2);

        body2.add(body);
        return body2;

    }


    // Modify Angles

    //head
    setAngleHead_X (anAngle) {
        var n = anAngle;
        //var n = this.ConvertDegreesToRadians(anAngle);
        if(n >= this.MIN_HEAD_X && n <= this.MAX_HEAD_X  )
          this.a_head_x = n;
        else{
          if(n > 0)
            this.a_head_x = this.MAX_HEAD_X;
          else
            this.a_head_x = this.MIN_HEAD_X;
        }
       
        this.sphere.rotation.y = this.a_head_x; //move horizontally
    
    }

    setAngleHead_Y (anAngle) {
        var n = anAngle;
        //var n = this.ConvertDegreesToRadians(anAngle);
        if(n >= this.MIN_HEAD_Y && n <= this.MAX_HEAD_Y  )
          this.a_head_y = n;
        else{
          if(n > 0)
            this.a_head_y = this.MAX_HEAD_Y;
          else
            this.a_head_y = this.MIN_HEAD_Y;
            
        }
        
        this.sphere.rotation.x = -this.a_head_y;//move vertically
    
    }

    setAngleArm(arm,anAngle){
        var n = this.ConvertDegreesToRadians(anAngle);
        if(n >= -this.MAX_ARM && n <= this.MAX_ARM ){
            arm = n;
        }
        else{
            if(n > 0)
                arm = this.MAX_ARM;
            else
                arm = -this.MAX_ARM;
        }
    }

    setAngleArm(anAngle){
        this.setAngleArm(this.arm1,anAngle);
        this.setAngleArm(this.arm2,anAngle);
    }

    setAngleWheel(){
        this.a_wheel_d ++;
        
        this.wheel.rotation.x = this.ConvertDegreesToRadians(this.a_wheel_d);
        this.wheel2.rotation.x = this.ConvertDegreesToRadians(this.a_wheel_d);
    }

    
    moveRight(){
        this.rotation.y -= 0.1;
        this.setAngleWheel(); //así se moverían las ruedas
    }
    
    moveLeft(){
        this.rotation.y += 0.1;
        this.setAngleWheel(); //así se moverían las ruedas
    }
    //TODO

    PredecirChoqueUP(){
        var posicion_x = this.position.x;
        var posicion_z = this.position.z;
        posicion_x += this.distance*Math.sin(this.rotation.y);
        posicion_z += this.distance*Math.cos(this.rotation.y);
        var posiciones = [posicion_x,posicion_z];
        return posiciones;

    }

    PredecirChoqueDOWN(){
        var posicion_x = this.position.x;
        var posicion_z = this.position.z;
        posicion_x -= this.distance*Math.sin(this.rotation.y);
        posicion_z -= this.distance*Math.cos(this.rotation.y);
        var posiciones = [posicion_x,posicion_z];
        return posiciones;

    }

    moveUp(){
        this.position.x += this.distance*Math.sin(this.rotation.y);
        this.position.z += this.distance*Math.cos(this.rotation.y); 
        this.setAngleWheel(); //así se moverían las ruedas
    }
        
    moveDown(){
        this.position.x -= this.distance*Math.sin(this.rotation.y);
        this.position.z -= this.distance*Math.cos(this.rotation.y);
        this.setAngleWheel(); //así se moverían las ruedas 
    }

    moveArmUP(anAngle){ //TODO CHANGE
        setAngleArm(anAngle);
    }

    moveArmDown(){
        setAngleArm(anAngle);
    }

    moveHeadRight(){
        var anAngle = this.ConvertDegreesToRadians(1);
        anAngle = this.a_head_x + anAngle;
        this.setAngleHead_X(anAngle);

    }

    moveHeadLeft(){
        var anAngle = this.ConvertDegreesToRadians(1);
        anAngle = this.a_head_x - anAngle;
        this.setAngleHead_X(anAngle);

    }

    moveHeadVertical(anAngle){
        //console.log("ENTRA EN VERTICAL");
        anAngle = this.ConvertDegreesToRadians(anAngle);
        this.setAngleHead_Y(anAngle);
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
