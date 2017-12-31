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
  constructor(initialValue) {
    this.items = [];
    if(initialValue !== undefined) {this.items.push(initialValue);}
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