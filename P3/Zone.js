class Zone extends THREE.Object3D {
    constructor (aDeep,width) {
        super();
        this.type = 'zone';
        this.MAX = 20;
        var zone = this.GenerateZone(aDeep);
        //zone.position.x = width;
        this.add(zone);
        this.position.x = width/2 ;

    }

    GenerateZone(aDeep){

        var geocil = new THREE.BoxGeometry(70,5,aDeep/4);
        var zone = new THREE.Mesh(geocil,new THREE.MeshBasicMaterial ({color: 0x31B404}) );
            zone.position.y = 2.5;
        return zone;
    }
    

};