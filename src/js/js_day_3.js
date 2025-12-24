const negativEmo=["Злость", "Грусть", "Паника", "Одиночество", "Стресс", "Тревога"]
const poistivEmo=["Радость", "Уверенность", "Любовь"]
const Emo = negativEmo.concat(poistivEmo)
const a = "Эмоция:"
console.log(a.concat(negativEmo))
negativEmo.forEach(a => {
    console.log("Эмоция:", a )
});
const symbol = negativEmo.map(n => n.length)
console.log(symbol.reduce((prev,current)=> prev+=current))











