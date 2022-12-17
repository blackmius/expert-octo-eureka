function proxyA(effect, tasks=[], names=[]) {
  return new Proxy((...args) => effect(tasks, ...args), {
    get: (_object, name, _proxy) => proxyB(effect, tasks, [...names, name]),
  });
}

function proxyB(effect, tasks=[], names=[]) {
  return new Proxy((...args) => proxyA(effect, [...tasks, {names, args}], []), {
    get: (_object, name, _proxy) => proxyB(effect, tasks, [...names, name]),
  });
}

export class Element {
  constructor(tag='div', classes=[], ...children) {
    this.sel = tag;
    this.children = children;
    this.data = { // can be assigned later: on, attrs, props, ns
      classes: new Set(classes),
    };
  }
}

const unwrap = (x) => (typeof x === 'function') ? unwrap(x()) : x;

export const cls = proxyA((tasks, parent, ctx) => {  
  for (let {names, args} of tasks)
    if (!args.length || args.some(x => unwrap(x)))
      names.forEach(n => parent.data.classes.add(kebab(n)));
});

function makeChainableWith(assign) {
  return proxyA((tasks, parent, ctx) => {
    for (let {names, args} of tasks)
      for (let name of names)
        assign(parent, name, args);
  });
}

export const on = makeChainableWith((parent, name, args) =>
  ((parent.data.on ??= {})[name] ??= []).push(...args)); // a single event can have multiple handlers
export const prop = makeChainableWith((parent, name, args) =>
  (parent.data.props ??= {})[name] = unwrap(args.at(-1))); // last assignment overrides previous ones
export const attr = makeChainableWith((parent, name, args) =>
  (parent.data.attrs ??= {})[name] = unwrap(args.at(-1)));
export const css = makeChainableWith((parent, name, args) =>
  (parent.data.style ??= {})[kebab(name)] = unwrap(args.at(-1)));

function append(child, el, ctx) {
  if (child === undefined || child === null || child === false) {}
  else if (Array.isArray(child)) { child.forEach(c => append(c, el, ctx)); }
  else if (typeof child === 'function') {
    // special case: do not call Vals with (el, ctx), call them with no arguments
    if (isUntouchable(child)) append(child(), el, ctx);
    else append(child(el, ctx), el, ctx);
  } else if (child instanceof Element) { el.children.push(child); }
  else { el.children.push({ text: String(child) }); }
}

const kebab = s => s.replaceAll(/[A-Z]/g, (char, pos) => (pos !== 0 ? '-' : '')
  + char.toLowerCase());

export const elem = proxyB((tasks, parent, ctx={}) => {
  let result = new Element();
  if (ctx.ns !== undefined) result.data.ns = ctx.ns;
  for (let {names, args: children} of tasks) {    
    for (let name of names) {
      if (name === '$') {}
      else if (name.match(/^[A-Z]/)) result.sel = kebab(name);        
      else result.data.classes.add(kebab(name));
    }
    let pns = ctx.ns;
    if (result.sel === 'svg') ctx.ns = result.data.ns = 'http://www.w3.org/2000/svg';
    for (let child of children) append(child, result, ctx);
    ctx.ns = pns;
  }
  return result;
});
export const c = elem;

export const key = (x) => (parent, ctx) => { parent.key = parent.data.key = unwrap(x); }

const UNTOUCHABLE = Symbol('UNTOUCHABLE');
function makeUntouchable(x) {
  x[UNTOUCHABLE] = true;
  return x;
}
function isUntouchable(x) {
  return Object.hasOwn(x, UNTOUCHABLE);
}

function wrapAccessor(f) {
  const handlers = new Set();
  const accessor = f(handlers);
  accessor.on = function (f) { handlers.add(f); return accessor; };
  accessor.off = function (f) { handlers.delete(f); return accessor; };
  return makeUntouchable(accessor);
}

export function Val(v) {
  return wrapAccessor(handlers =>
    function accessor(...args) {
      if (args.length > 0) {
        v = (args.length === 1) ? args[0] : args;
        for (let h of handlers) h.call(accessor, v);
      }
      return v;
    });
}

export function Ref(obj, name) {
  return wrapAccessor(handlers =>
    function accessor(...args) {
      if (args.length > 0) {
        obj[name] = (args.length === 1) ? args[0] : args;
        for (let h of handlers) h.call(obj);
      }
      return obj[name];
    });
}

