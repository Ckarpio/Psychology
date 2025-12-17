const EmoName = "злость"   
let EmoIntensiv = 5
//const EmoName = 5  
//let EmoIntensiv = "Пять"
if (typeof(EmoName)!="string"){
    console.error("Эмоция не найдена")
    return
}
else{
    if(typeof(EmoIntensiv)=="number"){
        if(EmoIntensiv>=5){
            console.log("Coвет")
        }   
    }
    else{
        console.error("Интесивность не найдена")
        return
    }
}