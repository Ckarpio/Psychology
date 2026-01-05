import { emotions } from "./const/emotion.js";
import {emotionsProperties} from "./const/emotionProperties.js"


function findEmo(emotionsCode){
    return emotions.find(emotions=> emotions.code==emotionsCode)
}

function findEmoProperties(emotions){
    return emotionsProperties.find(property => property.code===emotions.code)
} 

function main(){
    let emoCode="joy"
    let foundEmotions = findEmo(emoCode)
    if (!foundEmotions){
        console.log("Эмоция не найдена")
        return
    }

    let foundProperties = findEmoProperties(foundEmotions)
    if (!foundProperties){
        console.log('Свойства не найдены')
        return
    }

    
    console.log("Найденная эмоция:" , foundEmotions)
    console.log("Свойства эмоции:", foundProperties )
    
}


main()