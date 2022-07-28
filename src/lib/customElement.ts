export class PCustomElement extends HTMLElement {
  private connectedCallbackWaiters: (() => any)[] = [];
  private isReallyConnected = false;

  constructor() {
    super();
  }

  protected runConnectedCallbacks() {
    this.isReallyConnected = true;
    for (const cb of this.connectedCallbackWaiters) {
      cb();
    }
  }

  waitUntilConnected(callback: () => void) {
    if (!this.isReallyConnected) {
      this.connectedCallbackWaiters.push(callback);
    } else {
      callback();
    }
  }
}
