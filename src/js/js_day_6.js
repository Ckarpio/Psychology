import { emotions } from "./const/emotion.js";
import {emotionsProperties} from "./const/emotionProperties.js"


function findEmo(emotionsCode){
    try{
    return emotions.find(emotions=> emotions.code==emotionsCode)
    }
    catch(error){
        console.error("Ошибка при посике")
        return null
    }
    


}

function findEmoProperties(emotions){
    try{
        if (!emotions || !emotions.code){
            console.error("Неверный объект")
        }
    
    return emotionsProperties.find(property => property.code===emotions.code)
    }
    catch(error){
        console.error("Ошибка поиска свойств" )
        return nyll
    }

} 

function main(){
    try{
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
} catch(error){
    console.error('Ошибка  приложения')
}
}

try{
main()
}
catch(error){
    console.error("Ошибка запуска")

}