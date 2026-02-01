
import { createElement } from "react";
import { emotions } from "./const/emotion";
import { emotionProperties } from "./const/emotion";

function createEmotionElement(emotion) {
   const emotionsBtn = document.createElement("button");
   emotionsBtn.textContent = emotion.name;
   emotionsBtn.className = "emotion-btn";
   emotionsBtn.style.backgroundColor = emotion.color;
   emotionsBtn.dataset.emotionId = emotion.id;
   
   return emotionsBtn;
}

function renderAllEmotions(emotions) {
    const emotionsContainer = document.getElementById("emotions-container");

    if (!emotionsContainer) {
        console.error('Container Not Found');
        return;
    }
    if (!emotions || emotions.length === 0) {
        console.error('Emotions Not Found');
        return;
    }

    
    
    emotions.forEach(element => {
        const domElement = createEmotionElement(element);
        emotionsContainer.appendChild(domElement);
    });
}

function main() {
    
    renderAllEmotions(emotions);
}

main();
