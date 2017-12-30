const clone = (a) => {
  if (Array.isArray(a)) {
    return a.map(i => clone(i));
  } else {
    if (typeof a === 'object') {
      return Object.assign({}, Object.keys(a).reduce((p, i) => {
        p[i] = clone(a[i]);
        return p;
      }, {}));
    } else {
      return a;
    }
  }
}

class CarbonValue {
  constructor() {
    this.items = [];
  }

  set value(v) {
    let items = this.items;
    if(v.path) {
      const {path, value} = v;
      let prop = this.getPath(this.value, path);
      let newValue = this.clone;
      this.setPath(newValue, path, value);
      items.push(newValue);
    }
    else {
      items.push(v);
    }
    return items[items.length - 1];
  }

  get value() {
    let items = this.items;
    return items[items.length - 1];
  }

  get clone() {
    let items = this.items;
    return clone(items[items.length - 1]);
  }

  getPath(root, path) {
    let prop = root;
    let parts = path.toString().split('.');
    for (let i=0; i<parts.length; i++) {
      if (!prop) {
        return;
      }
      let part = parts[i];
      prop = prop[part];
    }
    return prop;
  }

  setPath(root, path, value) {
    let prop = root;
    let parts = path.toString().split('.');
    let last = parts[parts.length - 1];
    if (parts.length > 1) {
      for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        if (!prop[part]) {
          if (last) {
            prop[part] = {};
          }
        }
        prop = prop[part];
      }
      prop[last] = value;
    } else {
      prop[path] = value;
    }
    return parts.join('.');
  }
}




/*
class StoreManager {
  constructor(value) {
    this.path = {};
    this.data = {};
    this.model = new FootPrint();
    this.store = this.createStore();
  }

  createReducer() {
    return (state = undefined, action) => {
      if (action.type === '@@redux/INIT') {return state;}
      else {
        const {path, value} = action.value;
        return this.update({path, value});
      }
    };
  }

  createStore() {
    return this.store || Redux.createStore(this.createReducer());
  }

  update({path, value}) {
    if (path) {
      if (!this.path[path]) {
        this.path[path] = new CarbonValue();
      }
      const prop = this.path[path];
      prop.value = value;
      this.model.setPath(path, prop.value);
      return this.model.value;
    }
    return undefined;
  }

  get(path, isClone) {
    if (path) {
      const prop = this.path[path];
      if (prop) {
        return isClone ? prop.clone : prop.value;
      }
    }
    return undefined;
  }

  dispatch({path, value}) {
    this.store.dispatch({type: '', value: {path, value}});
  }
}

class StoreAction {
  constructor() {
    this.items = {};
  }

  load(actions) {
    Object.assign(this.items, actions);
    return actions;
  }

  dispatch({type, value}) {
    return this.item[type](value);
  }
}
  */