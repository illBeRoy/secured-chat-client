class A {
    static get b() { if (!this._b) this._b = []; return this._b; }
}

class B extends A {}

B.b.push(5);
console.log(A.b, B.b);
