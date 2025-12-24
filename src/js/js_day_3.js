const negativEmo=["Злость", "Грусть", "Паника", "Одиночество", "Стресс", "Тревога"]
const poistivEmo=["Радость", "Уверенность", "Любовь"]
const Emo = negativEmo.concat(poistivEmo)
const a = "Эмоция:"
console.log(Emo.length, "Все эмоции")
console.log(negativEmo.length, "Негативные ")

console.log(a.concat(negativEmo))
negativEmo.forEach(a => {
    console.log("Эмоция:", a )
});













