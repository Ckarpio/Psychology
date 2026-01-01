const Emo ={
    name: "Гнев",
    type: "negative",
    color: "red",
    material:{
        music: ["Beatles"],
        video:[],
        exercises:[],
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

console.log(intensiv)

console.log(Emo)

console.log(Emo.material.music)