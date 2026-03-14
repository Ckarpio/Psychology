

import { API_URL } from "./const/const.js";

document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const emotionCode = params.get('emotion');
    
    if (!emotionCode) {
        displayError('Эмоция не выбрана');
        return;
    }
    
    try {
        const emotionsResponse = await fetch(`${API_URL}/api/emotions`);
        
        if (!emotionsResponse.ok) {
            throw new Error('Ошибка загрузки списка эмоций');
        }
        
        const emotions = await emotionsResponse.json();
        const emotionData = emotions.find(em => em.code === emotionCode);
        
        if (!emotionData) {
            displayError('Эмоция не найдена');
            return;
        }

        displayEmotionInfo(emotionData);

        await loadRecommendations(emotionCode);

        initTabs();
        
    } catch (error) {
        console.error('Ошибка:', error);
        displayError('Ошибка загрузки данных с сервера');
    }
});

/**
 *
 * @param {string} emotionCode 
 */
async function loadRecommendations(emotionCode) {
    try {
    
        const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.materials) {
                window.currentEmotionMaterials = data.materials;
            } else if (data.material) {
                window.currentEmotionMaterials = data.material;
            } else if (data.music || data.video || data.images || data.exercises || data.articles) {
         
                window.currentEmotionMaterials = data;
            } else {
                console.warn('Неизвестный формат данных:', data);
                window.currentEmotionMaterials = {};
            }
            
            console.log('Загруженные материалы:', window.currentEmotionMaterials);
            return;
        }
        
        console.warn('Не удалось загрузить через /api/recommendation, пробуем другие варианты...');

        const altResponse = await fetch(`${API_URL}/api/recommendations/${emotionCode}`);
        if (altResponse.ok) {
            const altData = await altResponse.json();
            window.currentEmotionMaterials = altData.materials || altData.material || altData;
            console.log('Загружено через альтернативный эндпоинт:', window.currentEmotionMaterials);
            return;
        }
        
    
        window.currentEmotionMaterials = {};
        console.log('Рекомендации не найдены, используем пустой объект');
        
    } catch (error) {
        console.error('Ошибка при загрузке рекомендаций:', error);
        window.currentEmotionMaterials = {};
    }
}

function displayEmotionInfo(emotionData) {
    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.info-box p');
    
    if (!titleElement || !descriptionElement) {
        console.error('Элементы для отображения информации не найдены');
        return;
    }
    
    titleElement.textContent = emotionData.label;
    descriptionElement.textContent = emotionData.description;
   
    const infoBox = document.querySelector('.info-box');
    if (infoBox && emotionData.color) {
        infoBox.style.borderLeftColor = emotionData.color;
        infoBox.style.backgroundColor = `${emotionData.color}20`; 
    }
    
    if (emotionData.effect) {
        document.body.classList.add(`emotion-${emotionData.effect}`);
    }
    
    addAdditionalInfo(emotionData);
}

function addAdditionalInfo(emotionData) {
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
    
    if (emotionData.effect) {
        additionalHtml += `<p><strong>Тип:</strong> ${emotionData.effect === 'positive' ? 'Позитивная' : 'Негативная'}</p>`;
    }
    
    additionalInfoContainer.innerHTML = additionalHtml;
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    if (tabs.length === 0) {
        console.error('Вкладки не найдены');
        return;
    }
    
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
    

    const defaultTab = document.querySelector('.tab');
    if (defaultTab) {
        defaultTab.classList.add('active');
        const defaultTabId = defaultTab.getAttribute('data-tab');
        showTabContent(defaultTabId, contentContainer);
    }
}

function showTabContent(tabId, container) {
    const materials = window.currentEmotionMaterials || {};
    
    let items = [];
    let title = '';
    let icon = '';
    
    const tabMapping = {
        'music': 'music',
        'video': 'video',
        'images': 'images',
        'exercises': 'exercises',
        'articles': 'articles'
    };
    
    const dataField = tabMapping[tabId];
    
    switch(tabId) {
        case 'music':
            title = 'Музыка';
            icon = '🎵';
            items = materials[dataField] || [];
            break;
        case 'video':
            title = 'Видео';
            icon = '🎬';
            items = materials[dataField] || [];
            break;
        case 'images':
            title = 'Картинки';
            icon = '🖼️';
            items = materials[dataField] || [];
            break;
        case 'exercises':
            title = 'Упражнения';
            icon = '📖';
            items = materials[dataField] || [];
            break;
        case 'articles':
            title = 'Статьи';
            icon = '📄';
            items = materials[dataField] || [];
            break;
        default:
            title = tabId;
            items = [];
    }
    
    let html = `<h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">${icon} ${title}</h2>`;
    
    if (items && items.length > 0) {
        html += '<div class="materials-list">';
        items.forEach((item, index) => {
            html += '<div class="material-item" style="margin-bottom: 20px; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">';
            
            
            if (item.title) {
                html += `<h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">${item.title}</h3>`;
            }
            
            
            if (item.subtitle || item.artist) {
                const subtitle = item.subtitle || item.artist;
                html += `<div style="margin: 0 0 10px 0; color: #666; font-weight: normal; font-size: 14px;">${subtitle}</div>`;
            }
            

            if (item.description || item.body || item.text) {
                const description = item.description || item.body || item.text;
                html += `<p style="margin: 10px 0; color: #555; line-height: 1.5;">${description}</p>`;
            }
            
        
            if (item.url || item.link) {
                const url = item.url || item.link;
                html += `<a href="${url}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Перейти к материалу →</a>`;
            }
            
    
            if (item.attachments && item.attachments.length > 0) {
                html += '<div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc;">';
                html += '<div style="font-size: 13px; color: #666; margin-bottom: 8px;">Вложения:</div>';
                item.attachments.forEach(att => {
                    if (att.url) {
                        html += `<a href="${att.url}" target="_blank" style="display: inline-block; margin-right: 15px; color: #2196F3; text-decoration: none; font-size: 13px;">📎 ${att.name || 'Файл'}</a>`;
                    }
                });
                html += '</div>';
            }
            
            html += '</div>';
        });
        html += '</div>';
    } else {
        html += '<div style="padding: 40px 20px; text-align: center; background: #f9f9f9; border-radius: 8px; color: #999;">';
        html += `<p style="font-size: 48px; margin: 0 0 10px 0;">${icon}</p>`;
        html += '<p style="font-style: italic;">Нет доступных материалов для этой категории</p>';
        html += '</div>';
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
    
    const tabs = document.querySelector('.tabs');
    if (tabs) {
        tabs.style.display = 'none';
    }
    

    const container = document.querySelector('.container');
    if (container) {
        const backButton = document.createElement('button');
        backButton.textContent = '← Вернуться на главную';
        backButton.style.cssText = 'margin-top: 20px; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;';
        backButton.onclick = () => window.location.href = 'index.html';
        container.appendChild(backButton);
    }
}