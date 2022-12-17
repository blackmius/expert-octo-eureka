import { Val as _Val, Ref as _Ref } from './combinator.js';
import * as snabb from './snabb.js';

function updateClasses(oldVnode, vnode) {
    const elm = vnode.elm;
    let oldClass = oldVnode.data.classes;
    let klass = vnode.data.classes;
    if (oldClass === klass) return;
    if (oldClass) for (name of oldClass) if (!klass || !klass.has(name)) elm.classList.remove(name);
    if (klass) for (name of klass) if (!oldClass || !oldClass.has(name)) elm.classList.add(name);
}
const classesModule = { create: updateClasses, update: updateClasses };

const patch = snabb.init([
  classesModule,
  snabb.attributesModule,
  snabb.propsModule,
  snabb.styleModule,
  snabb.eventListenersModule,
]);

export function throttle(f) {
  let p;
  return () => (p ??= Promise.resolve().then(async () => {
    p = undefined; await f();
  }));
}

export function attach(el) {
  let vEl;
  // body()(): the first () obtains the content of a Val, which is a function
  // made with c-combinator, the second () launches it to get the tree of Elements.
  // During the first call, a real DOM element is used, during the subsequent
  // calls -- the vDOM element obtained as a result of patching.
  // Refresh is being ran upon every Val assigned, but it is throttled, so
  // only one refresh is called, even is there are many Val(...) assignments
  // are called in a row. Also, refresh is called only for the element to which
  // the respective Val is linked.
  const refresh = throttle(() => vEl = patch(vEl ?? el, body()()));
  let Val = (...args) => _Val(...args).on(refresh);
  let Ref = (...args) => _Ref(...args).on(refresh);
  return Object.assign(Val(), { Val, Ref, refresh });
}

// TODO: append to body, not replace it!
let container = document.body;
/*
let container = document.createElement('div');
container.setAttribute('id', 'main');
document.body.appendChild(container);
*/

export const body = attach(container);
export const Val = body.Val;
export const Ref = body.Ref;

