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
    initTabs();
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
        
        window.currentEmotionMaterials = emotionProps?.material || null;
        
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
    
    if (emotionProps && emotionProps.material && emotionProps.material.description) {
        descriptionElement.textContent = emotionProps.material.description;
    } else {
        descriptionElement.textContent = 'Описание отсутствует';
    }
    
    const infoBox = document.querySelector('.info-box');
    if (infoBox && emotionData.color) {
        infoBox.style.borderLeftColor = emotionData.color;
        infoBox.style.backgroundColor = `${emotionData.color}20`;
    }
    
    if (emotionData.effect) {
        document.body.classList.add(`emotion-${emotionData.effect}`);
    }
    
    addAdditionalInfo(emotionData, emotionProps);
}

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

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    if (tabs.length === 0) return;
    
    const container = document.querySelector('.container');
    const tabsContainer = document.querySelector('.tabs');
    
    let contentContainer = document.querySelector('.tab-content-container');
    if (!contentContainer) {
        contentContainer = document.createElement('div');
        contentContainer.className = 'tab-content-container';
        if (tabsContainer && container) {
            container.insertBefore(contentContainer, tabsContainer.nextSibling);
        }
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            showTabContent(tabId, contentContainer);
        });
    });
    
    const defaultTab = document.querySelector('.tab[data-tab="music"]');
    if (defaultTab) {
        defaultTab.classList.add('active');
        showTabContent('music', contentContainer);
    }
}

function showTabContent(tabId, container) {
    const materials = window.currentEmotionMaterials || {};
    
    let items = [];
    let title = '';
    
    switch(tabId) {
        case 'music':
            title = 'Музыка';
            items = materials.music || [];
            break;
        case 'video':
            title = 'Видео';
            items = materials.video || [];
            break;
        case 'images':
            title = 'Картинки';
            items = materials.images || materials.pictures || [];
            break;
        case 'exercises':
            title = 'Упражнения';
            items = materials.exersice || [];
            break;
        case 'articles':
            title = 'Статьи';
            items = materials.articles || [];
            break;
    }
    
    let html = `<h2>${title}</h2>`;
    
    if (items && items.length > 0) {
        html += '<ul class="tab-content-list">';
        items.forEach(item => {
            if (typeof item === 'string') {
                html += `<li>${item}</li>`;
            } else if (item.title) {
                html += `<li><strong>${item.title}</strong>${item.description ? ': ' + item.description : ''}</li>`;
            }
        });
        html += '</ul>';
    }
    
    container.innerHTML = html;
}

function displayError(message) {
    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.info-box p');
    
    if (titleElement) {
        titleElement.textContent = 'Ошибка';
    }
    
    if (descriptionElement) {
        descriptionElement.textContent = message;
    }
}