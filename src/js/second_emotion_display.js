import { emotion } from "./const/emotion.js";
import { emotionsProperties } from "./const/emotionProperties.js";

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const emotionCode = params.get('emotion');
    
    if (!emotionCode) {
        displayError('Эмоция не выбрана');
        return;
    }
    
    loadEmotionData(emotionCode);
});

function loadEmotionData(emotionCode) {
    try {
        const emotionData = emotion.find(em => em.code === emotionCode);
        
        if (!emotionData) {
            displayError('Эмоция не найдена');
            return;
        }
        
        const emotionProps = emotionsProperties.find(prop => prop.code === emotionCode);
        
        displayEmotionInfo(emotionData, emotionProps);
        
    } catch (error) {
        displayError('Ошибка загрузки данных');
    }
}

function displayEmotionInfo(emotionData, emotionProps) {
    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.info-box p');
    
    if (!titleElement || !descriptionElement) {
        return;
    }
    
    titleElement.textContent = emotionData.label || 'Эмоция';
    
    if (emotionProps && emotionProps.description) {
        descriptionElement.textContent = emotionProps.description;
    }
    
    addAdditionalInfo(emotionData, emotionProps);
}




    
    const infoBox = document.querySelector('.info-box');
    if (infoBox) {
        infoBox.style.borderLeftColor = emotionColor;
        infoBox.style.backgroundColor = `${emotionColor}20`;
    }
    
    document.body.classList.add(`emotion-${emotionData.effect}`);


function addAdditionalInfo(emotionData, emotionProps) {
    let additionalInfoContainer = document.querySelector('.additional-emotion-info');
    
    if (!additionalInfoContainer) {
        additionalInfoContainer = document.createElement('div');
        additionalInfoContainer.className = 'additional-emotion-info';
        
        const infoBox = document.querySelector('.info-box');
        if (infoBox && infoBox.parentNode) {
            infoBox.parentNode.insertBefore(additionalInfoContainer, infoBox.nextSibling);
        }
    }
    
    let additionalHtml = '';
    
    const effectText = emotionData.effect === 'positive' ? '😊 Положительная' : '😔 Отрицательная';
    additionalHtml += `<p><strong>Тип:</strong> ${effectText}</p>`;
    
    if (emotionProps && emotionProps.material) {
        const materialCounts = [];
        
        if (emotionProps.material.music && emotionProps.material.music.length > 0) {
            materialCounts.push(`🎵 Музыка: ${emotionProps.material.music.length}`);
        }
        if (emotionProps.material.video && emotionProps.material.video.length > 0) {
            materialCounts.push(`🎬 Видео: ${emotionProps.material.video.length}`);
        }
        if (emotionProps.material.exersice && emotionProps.material.exersice.length > 0) {
            materialCounts.push(`📖 Упражнения: ${emotionProps.material.exersice.length}`);
        }
        if (emotionProps.material.articles && emotionProps.material.articles.length > 0) {
            materialCounts.push(`📄 Статьи: ${emotionProps.material.articles.length}`);
        }
        
        if (materialCounts.length > 0) {
            additionalHtml += `<p><strong>Доступные материалы:</strong> ${materialCounts.join(' | ')}</p>`;
        }
    }
    
    additionalInfoContainer.innerHTML = additionalHtml;
}

    
    

