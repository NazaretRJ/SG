/**
flying object class
**/




class FlyObj extends THREE.Object3D {
    constructor (parameters){
        super();
        this.NIVEL_1 = 10;
        var NIVEL_2 = 40;
        this.num_good = 0;
        this.num_vueltas = 0;
        this.v = 0;
        this.GenerateNew();
        this.origen = 250;
        this.destino = -250;
        this.visible = true;
        this.add( this.sphere );
        
    }

    GenerateSoul(){
        var random_boolean = Math.random() >= 0.5;  //random boolean
        if(this.num_vueltas * 0.2 < this.num_good){
            this.bad = false;
            this.num_good ++;
        }
        else
            this.bad = random_boolean;
        
        this.num_vueltas++;

        return this.bad;

    }
//posicion y velocidad aleatoria

    GenerateNew(){
        var soul = this.GenerateSoul();
        if(soul == true){ // OvoMa (bad)
            this.material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        }
        else{
            this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        }

        this.geometry = new THREE.SphereGeometry( 5, 32, 32 );
        this.sphere = new THREE.Mesh( this.geometry, this.material );
        this.position.x = this.origen;
        this.position.y += 5;
        //this.add( this.sphere );

    }
//movimiento.start();
    Animacion(){
        if(this.position.x > this.destino ){
            if(this.num_vueltas > this.NIVEL_1 && this.num_vueltas < this.NIVEL_2){
                this.v = -1.5;
            }
            else{
                if(this.num_vueltas < this.NIVEL_1)
                    this.v = -1;
                else
                    this.v = -2;
            }
            this.position.x += this.v;
        }
        else{
            //visible = false;
            this.NuevaVuelta();
        }
            
    }

    getBad(){
        return this.bad;
    }


    //TODO COLISION  que sea funcional (POINTS) sale NaN

    NuevaVuelta(){
        this.GenerateSoul();
        var soul = this.GenerateSoul();
        if(soul == true){ // OvoMa (bad)
            this.material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        }
        else{
            this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        }
        this.sphere.material = this.material;//cambiamos material    
        var rnd = Math.random()* 150;
        var random_boolean = Math.random() >= 0.5;
       
        if(random_boolean == false){
            rnd *=-1;
        }

        this.position.z = rnd;
        this.position.x = this.origen;
        this.visible = true;
    }


};