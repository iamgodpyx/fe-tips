class EventEmit {
  constructor() {
    this.eventMap = {};
  }

  on(name, cb) {
    if (this.eventMap[name]) {
      this.eventMap[name].push(cb);
    } else {
      this.eventMap[name] = [cb];
    }
  }

  emit(name) {
    if (this.eventMap[name]) {
      this.eventMap[name].forEach((cb) => cb());
    }
  }

  off(name, cb) {
    if (this.eventMap[name]) {
      this.eventMap[name] = this.eventMap[name].filter((item) => item !== cb);
    }
  }
}

const eventEmit = new EventEmit();

const cb1 = () => console.log("haha");
const cb2 = () => console.log(1111);

eventEmit.on("haha",cb1);

eventEmit.on("haha", cb2);

eventEmit.emit("haha");

eventEmit.off("haha",cb1);
eventEmit.emit("haha");




