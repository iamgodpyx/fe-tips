// type ReturnType1<T> = T extends (...args: any[]) => infer R ? R : any;

// type func = () => number;
// type variable = string;

// type funcReturnType = ReturnType1<func>;
// type vatReturnType = ReturnType1<variable>;

// type Ids = number[];
// type Names = string[];

// type Unpacked<T> = T extends (infer R)[] ? R : T;

// type idType = Unpacked<Ids>;
// type nameType = Unpacked<Names>;

// type Foo<T> = T extends {a: infer U;b: infer U} ? U : never;
// type T10 = Foo<{a: string; b: string}>
// type T11 = Foo<{a: string; b: number}>

// type TypeName<T> = T extends string ? 'string' : T extends boolean ? 'boolean' : 'object';

// type T0 = TypeName<string>
// type T1 = TypeName<'a'>
// type T2 = TypeName<{}>

// // 这里用到了泛型的默认值语法 <T = any>
// type Ref<T = any> = {
//   value: T;
// };

// function ref<T>(value: T): Ref<T> {
//   return { value };
// }

// const count = ref(2);

// count.value; // number

// let str: string = '我是字符串类型'
// let haoza = '我是具体字符串' as const

// haoza = str;

interface Person {
    name: string;
    age: number;
}

interface Student extends Person {
    status: string;
}

type Arr1 = Array<Person>;
type Arr2 = Array<Student>;

let test1 = [] as Arr1;
let test2 = [] as Arr2;


test2 = test1;