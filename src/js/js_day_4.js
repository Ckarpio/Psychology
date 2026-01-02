const Emo ={
    name: "Гнев",
    type: "negative",
    color: "red",
    material:{
        music: ["Beatles"],
        video:[],
        exercises:["№1"],
        articles:[],
    }   

}

Emo.intensiv= 24 // Создание нового элемента

delete Emo.intensiv // Удаление элемента

Emo.color="black" // Изменение элемента

if(Emo.type="negative"){
    console.log(Emo.material) // Цикл
}

let intensiv = Object.assign({}, Emo) // Дублирование объекта

Emo.material.music.push("Beach Boy")
Emo.material.exercises.pop("№1")


console.log(Emo)

console.log(Emo.material.music)