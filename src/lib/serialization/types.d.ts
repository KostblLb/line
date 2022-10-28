interface ISerializedComponent {
  uid: string;
  name: string;
}

interface ISerializedSceneObject {
  uid: string;
  components: ISerializedComponent[];
}

interface ISerializedScene {
  objects: ISerializedSceneObject[];
}
