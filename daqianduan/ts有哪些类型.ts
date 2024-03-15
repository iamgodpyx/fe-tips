// basic Types 基本类型 number Tuple void

// interface 接口类型 

// interface Jack {
//     name: string;
//     age: number
// }

// Unions and intersection Types 并集、交集类型 object | null

// Literal types 字面量类型  1 | 2 | 3

// enums 枚举类型 

// enum x {
//     name = 'jack',
//     age = 25
// }

// function 函数类型
// (x: number) => void

// class 类类型

// generics 泛型

// ts的分布式条件类型
// interface IObject {
//     a: string;
//     b: number;
//     c: boolean
// }

// type foo = Extract<keyof IObject, 'a'|'b'>
// type bar = keyof IObject

// type qqq = 'a'| 'b'





// type res = Record<'123' | 'hello', 'love'>

// interface ILength {
//     length: number
// }

// function printLength<T extends ILength>(arg: T): T {
//     console.log(arg.length);
//     return arg;
// }

// const num = printLength(11)

// Partial < T > 将T的所有属性变成可选的


// interface IPerson {
//     name: string;
//     age: number
// }

// type IPartial = Partial<IPerson>

// let p1: IPartial = {}

// Omit，从类型中剔除一些属性

interface IPerson {
    name: string;
    age: number
}

type IOmit = Omit<IPerson, 'age'>
