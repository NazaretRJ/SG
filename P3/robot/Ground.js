
/// The Ground class
/**
 * @author FVelasco
 *
 * @param aWidth - The width of the ground
 * @param aDeep - The deep of the ground
 * @param aMaterial - The material of the ground
 * @param aBoxSize - The size for the boxes
 */

class Ground extends THREE.Object3D {

  constructor (aWidth, aDeep, aMaterial, aBoxSize) {
    super();

    this.width = aWidth;
    this.deep = aDeep;
    this.material = aMaterial;
    this.boxSize = aBoxSize;

    this.ground = null;
    this.boxes  = null;

    this.box    = null;
    this.raycaster = new THREE.Raycaster ();  // To select boxes

    this.ground = new THREE.Mesh (
      new THREE.BoxGeometry (this.width, 0.2, this.deep, 1, 1, 1),
      this.material);
    this.ground.applyMatrix (new THREE.Matrix4().makeTranslation (0,-0.1,0));
    this.ground.receiveShadow = true;
    this.ground.autoUpdateMatrix = false;
    this.add (this.ground);

    this.boxes = new THREE.Object3D();
    this.add (this.boxes);
  }


}
