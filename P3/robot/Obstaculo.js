class Obstaculo extends THREE.Object3D {

    constructor (aWidth, aDeep,positionx,positionz,pyposx,pyposz) {
        super();
        this.type = 'obstaculo';
        this.radio = 0;
        this.MAX = 50;
        this.orientacion = 1;
        this.add(this.GenerateObject());
        this.aDeep = aDeep;
        this.Trasladar(aWidth,positionx,positionz,pyposx,pyposz);
    }

    getRadio(){
        return this.radio;
    }

    GenerateObject(){

        this.radio = Math.random() * this.MAX;

        var geometry = new THREE.SphereGeometry(this.radio, 20, 20);
        var loader = new THREE.TextureLoader();
        var material = loader.load("imgs/cabeza.jpg");
        var sphere = new THREE.Mesh(geometry,new THREE.MeshPhongMaterial ({map:material}));


        return sphere;

    }
    
    Trasladar(aWidth,positionx,positionz,pyposx,pyposz){
        var random_position_x = Math.random() * aWidth/2;
        var random_position_z = Math.random() * this.aDeep/2;

        var rndx = Math.random() >=0.5;
        var rndz = Math.random() >=0.5;
        
        if( rndx == false ){
            random_position_x *=-1;
        }
        
        if( rndz == false ){
            random_position_z *=-1;
        }        

        while(random_position_z == positionz && random_position_z == pyposz){
            random_position_z = Math.random() * this.aDeep/2;
        }

        while(random_position_x == positionx && random_position_x == pyposx){
            random_position_x = Math.random() * aWidth/2;
        }



        this.position.y = this.radio;
        this.position.x = random_position_x;
        this.position.z = random_position_z;

    }

    animar(){
        //si no está en los borders
        if(this.OutOfBorders()==true){
            var posz = this.position.z;
            var posx = this.position.x;
            if(posz< -this.aDeep/2){
                this.orientacion = 1;
            }
            else{
                if(posz > this.aDeep/2)
                    this.orientacion = -1;
            }
        }
        //avanzamos
        this.position.z += this.orientacion;
        
    }

    OutOfBorders(){
        var posz = this.position.z;
        var posx = this.position.x;
        if(posz< -this.aDeep/2 || posz > this.aDeep/2)  //se sale de los bordes
            return true;
        else
            return false;
    }
    
    changeOrientacion(){
        if(!this.OutOfBorders())
            this.orientacion = this.orientacion*-1; //cambia de dirección
        else
            this.orientacion = 0;
        
    }

};

