import { PCustomElement } from "../../lib/customElement";

/**
 * Галерея моделей для вставки в сцену
 */
export class ObjectGallery extends PCustomElement {
  static toString() {
    return "p-object-gallery";
  }

  static SELECT_OBJECT_EVENT = "SELECT_OBJECT_EVENT";

  listContainer: HTMLDivElement;

  constructor() {
    super();

    const root = this.attachShadow({ mode: "open" });

    const div = document.createElement("div");

    div.innerHTML = `
<details>
    <summary>Gallery</summary>
    <div id='list' />
</details>
    `;

    root.append(div);

    this.listContainer = root.querySelector("#list")!;
  }

  protected connectedCallback(): void {
    this.loadObjects();
  }

  private async loadObjects() {
    const objects = await Promise.resolve([
      { name: "cube" },
      { name: "sphere" },
    ]);

    this.listContainer.append(...objects.map((obj) => this.makeListItem(obj)));
  }

  private makeListItem(obj: { name: string }) {
    const listItem = document.createElement("div");
    listItem.style.cursor = "pointer"; // TODO add css
    listItem.textContent = obj.name;
    listItem.onclick = () => this.onSelectListItem(obj);
    return listItem;
  }

  private onSelectListItem(obj: { name: string }) {
    this.dispatchEvent(
      new CustomEvent<{ name: string }>(ObjectGallery.SELECT_OBJECT_EVENT, {
        detail: obj,
      })
    );
  }
}
customElements.define(String(ObjectGallery), ObjectGallery);
