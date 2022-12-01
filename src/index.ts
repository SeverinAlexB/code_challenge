const world = 'world';

export function hello(who: string = world) {
  console.log(`Hello ${who}!`);
}

export function add(a: number, b: number): number {
  return a + b;
}

hello("Sev");
hello();
