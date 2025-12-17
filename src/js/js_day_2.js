const EmoName = "злость"   
const EmoIntensiv = "1"
const intensivNumber= Number(EmoIntensiv)
//const EmoName = 5  
//let EmoIntensiv = "Пять"
if (typeof(EmoName)!="string"){
    console.log(typeof(EmoIntensiv))
    console.error("Эмоция не найдена")
    return
}
if (typeof (EmoIntensiv)=="string"){
    if (Number(EmoIntensiv)>=5){
        console.log("Совет")


    }
    else{
        console.log("Низкая интесивность")

    }
}
else{
    if (EmoIntensiv>=5){
        console.log("Совет")

    }
    else{
        console.log("Низкая интесивность")

    }

}