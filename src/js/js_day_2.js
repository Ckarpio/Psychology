const emoName = 'злость'  
const emoIntensiv = false
const intensivNumber= Number(emoIntensiv)
//const emoName = 5  
//let emoIntensiv = "Пять"
/*
if (typeof(emoName)!="string"){
    console.error("Эмоция не найдена")
    return
}
if (typeof (emoIntensiv)=="string" || typeof(emoIntensiv)=="boolean" || typeof(emoIntensiv)=="number"){
    if (Number(emoIntensiv)>=5 || Boolean(emoIntensiv)==true || emoIntensiv>=5){
        console.log("Совет1")


    }
    else{
        console.log("Низкая интесивность1")
    }
}
else{
    console.log("Интенсивность не найдена")
}
*/

if (!emoName || (emoName && typeof emoName === 'string' && emoName.length === 0) || !(typeof emoName === 'string')){
    console.error("Эмоция не найдена")
    return
}

if (Number(emoIntensiv)){
    if (emoIntensiv >= 5)
        console.log("Совет1")
    else
        console.log("Низкая интесивность1")
}
else
    console.log("Интенсивность не найдена")



