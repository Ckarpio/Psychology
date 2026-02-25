

const API_URL = 'http://localhost:3000';

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

        try {
            const recommendationResponse = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
            
            if (recommendationResponse.ok) {
                const recommendationData = await recommendationResponse.json();
                window.currentEmotionMaterials = recommendationData.material || {};
            } else {
                window.currentEmotionMaterials = {};
            }
        } catch (e) {
            console.log('Рекомендации временно недоступны');
            window.currentEmotionMaterials = {};
        }
        
    
        initTabs();
        
    } catch (error) {
        console.error('Ошибка:', error);
        displayError('Ошибка загрузки данных с сервера');
    }
});

function displayEmotionInfo(emotionData) {
    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.info-box p');
    
    if (!titleElement || !descriptionElement) {
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
    
    if (emotionData.color) {
        additionalHtml += `<p><strong>Тип:</strong> ${emotionData.effect === 'positive' ? 'Позитивная' : 'Негативная'}</p>`;
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
            items = materials.images || [];
            break;
        case 'exercises':
            title = 'Упражнения';
            items = materials.exercises || [];
            break;
        case 'articles':
            title = 'Статьи';
            items = materials.articles || [];
            break;
    }
    
    let html = `<h2>${title}</h2>`;
    
    if (items && items.length > 0) {
        html += '<ul>';
        items.forEach(item => {
            html += '<li style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee;">';
            if (item.title) {
                html += `<strong>${item.title}</strong><br>`;
            }
            if (item.subtitle) {
                html += `<small style="color: #666;">${item.subtitle}</small><br>`;
            }
            if (item.body) {
                html += `<p style="margin: 5px 0;">${item.body}</p>`;
            }
            if (item.url) {
                html += `<a href="${item.url}" target="_blank" style="color: #4CAF50; text-decoration: none;">Перейти к материалу →</a>`;
            }
            html += '</li>';
        });
        html += '</ul>';
    } else {
        html += '<p>Нет доступных материалов</p>';
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
}