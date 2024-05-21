// hello.ts
// console.log("你好，TypeScript！");
interface Person {
    name: string;
    age: number;
}
class Student {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    showTecher(person:Person) {
        console.log(person.name);
    }
}

// new Student('jack', 18).showTecher({name:'tom',age:20});
