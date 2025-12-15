const EmoName = "злость"   
let EmoIntensiv = 5 
if (!EmoName){
    console.error("Эмоция не выбрана")
    return
}
else{
    if(EmoIntensiv==Number){
        if(EmoIntensiv>=5){
            alert("Cовет")
            console.log("рабоает")
        }   
    }
    else{
        return
        
    }
}
