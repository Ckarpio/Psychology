
import { emotions } from "./const/emotion.js";


function createEmotionElement(emotions) {
   const emotionsBtn = document.createElement("button");
   emotionsBtn.textContent = emotions.label;
   emotionsBtn.className = "emotion-btn";
   emotionsBtn.style.backgroundColor = emotions.color;
   emotionsBtn.effect=emotions.effect
   return emotionsBtn;
}

function renderAllEmotions(emotions) {
    const emotionsContainer = document.querySelector("emotion-btn");

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
    debugger
    renderAllEmotions(emotions);
    createEmotionElement(emotions)
}

main();
