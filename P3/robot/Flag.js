class Flag extends THREE.Object3D {

    constructor () {
        super();
        this.type = 'flag';
        this.taken = false;
        this.add(this.BuildFlag());

    }
    

    BuildFlag(){
        var geocil = new THREE.CylinderGeometry( 0.5, 0.5, 30, 32 );
        var loader = new THREE.TextureLoader();
        var material = loader.load("imgs/plasticoburbujas.jpg");
        var cylinder = new THREE.Mesh(geocil,new THREE.MeshPhongMaterial ({map:material}));
            cylinder.position.y = 15;

        var box = new THREE.BoxGeometry(20,10,1);
        var mat = loader.load("imgs/bandera.jpg");
        var flag = new THREE.Mesh(box,new THREE.MeshPhongMaterial ({map:mat}));
            flag.position.y = 10;
            flag.position.x = 10.5;
        cylinder.add(flag);
        
        
        return cylinder;
    }

    getTaken(){
        return this.taken;
    }

    ChangeTaken(){
        this.taken = !this.taken;
        if(this.taken == true){
            this.visible = false;
        }
        else
            this.visible = true;
    }

    getType(){
        return this.type;
    }
    
};