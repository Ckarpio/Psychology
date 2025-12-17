const emoName = 'злость'  
const emoIntensiv = 5
const intensivNumber= Number(emoIntensiv)
//const emoName = 5  
//let emoIntensiv = "Пять"
if (typeof(emoName)!="string"){
    console.error("Эмоция не найдена")
    return
}
if (typeof (emoIntensiv)=="string"){
    if (Number(emoIntensiv)>=5){
        console.log("Совет1")


    }
    else{
        console.log("Низкая интесивность1")

    }
}
else{
    if (emoIntensiv>=5){
        console.log("Совет2")

    }
    else{
        console.log("Низкая интесивность2")

    }

}