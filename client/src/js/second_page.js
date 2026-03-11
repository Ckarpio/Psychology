
// import { API_URL } from "./const/const.js";

// document.addEventListener('DOMContentLoaded', async function() {
//     const params = new URLSearchParams(window.location.search);
//     const emotionCode = params.get('emotion');
    
//     if (!emotionCode) {
//         displayError('Эмоция не выбрана');
//         return;
//     }
    
//     try {

//         const emotionsResponse = await fetch(`${API_URL}/api/emotions`);
        
//         if (!emotionsResponse.ok) {
//             throw new Error('Ошибка загрузки списка эмоций');
//         }
        
//         const emotions = await emotionsResponse.json();
//         const emotionData = emotions.find(em => em.code === emotionCode);
        
//         if (!emotionData) {
//             displayError('Эмоция не найдена');
//             return;
//         }

//         displayEmotionInfo(emotionData);

//         try {
//             const recommendationResponse = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
            
//             if (recommendationResponse.ok) {
//                 const recommendationData = await recommendationResponse.json();
//                 window.currentEmotionMaterials = recommendationData.material || {};
//             } else {
//                 window.currentEmotionMaterials = {};
//             }
//         } catch (e) {
//             console.log('Рекомендации временно недоступны');
//             window.currentEmotionMaterials = {};
//         }
        
    
//         initTabs();
        
//     } catch (error) {
//         console.error('Ошибка:', error);
//         displayError('Ошибка загрузки данных с сервера');
//     }
// });

// function displayEmotionInfo(emotionData) {
//     const titleElement = document.querySelector('h1');
//     const descriptionElement = document.querySelector('.info-box p');
    
//     if (!titleElement || !descriptionElement) {
//         return;
//     }
    
//     titleElement.textContent = emotionData.label;
//     descriptionElement.textContent = emotionData.description;
   
//     const infoBox = document.querySelector('.info-box');
//     if (infoBox && emotionData.color) {
//         infoBox.style.borderLeftColor = emotionData.color;
//         infoBox.style.backgroundColor = `${emotionData.color}20`;
//     }
    
//     if (emotionData.effect) {
//         document.body.classList.add(`emotion-${emotionData.effect}`);
//     }
    
//     addAdditionalInfo(emotionData);
// }

// function addAdditionalInfo(emotionData) {
//     let additionalInfoContainer = document.querySelector('.additional-emotion-info');
    
//     if (!additionalInfoContainer) {
//         additionalInfoContainer = document.createElement('div');
//         additionalInfoContainer.className = 'additional-emotion-info';
        
//         const infoBox = document.querySelector('.info-box');
//         if (infoBox && infoBox.parentNode) {
//             infoBox.parentNode.insertBefore(additionalInfoContainer, infoBox.nextSibling);
//         }
//     }
    
//     let additionalHtml = '';
    
//     if (emotionData.color) {
//         additionalHtml += `<p><strong>Тип:</strong> ${emotionData.effect === 'positive' ? 'Позитивная' : 'Негативная'}</p>`;
//     }
    
//     additionalInfoContainer.innerHTML = additionalHtml;
// }

// function initTabs() {
//     const tabs = document.querySelectorAll('.tab');
    
//     if (tabs.length === 0) return;
    
//     const container = document.querySelector('.container');
//     const tabsContainer = document.querySelector('.tabs');
    
//     let contentContainer = document.querySelector('.tab-content-container');
//     if (!contentContainer) {
//         contentContainer = document.createElement('div');
//         contentContainer.className = 'tab-content-container';
//         if (tabsContainer && container) {
//             container.insertBefore(contentContainer, tabsContainer.nextSibling);
//         }
//     }
    
//     tabs.forEach(tab => {
//         tab.addEventListener('click', function() {
//             tabs.forEach(t => t.classList.remove('active'));
//             this.classList.add('active');
            
//             const tabId = this.getAttribute('data-tab');
//             showTabContent(tabId, contentContainer);
//         });
//     });
    
//     const defaultTab = document.querySelector('.tab[data-tab="music"]');
//     if (defaultTab) {
//         defaultTab.classList.add('active');
//         showTabContent('music', contentContainer);

//     }
    
// }

// function showTabContent(tabId, container) {
//     const materials = window.currentEmotionMaterials || {};
    
//     let items = [];
//     let title = '';
    
//     switch(tabId) {
//         case 'music':
//             title = 'Музыка';
//             items = materials.music || [];
//             break;
//         case 'video':
//             title = 'Видео';
//             items = materials.video || [];
//             break;
//         case 'images':
//             title = 'Картинки';
//             items = materials.images || [];
//             break;
//         case 'exercises':
//             title = 'Упражнения';
//             items = materials.exercises || [];
//             break;
//         case 'articles':
//             title = 'Статьи';
//             items = materials.articles || [];
//             break;
//     }
    
//     let html = `<h2>${title}</h2>`;
    
//     if (items && items.length > 0) {
//         html += '<ul>';
//         items.forEach(item => {
//             html += '<li style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee;">';
//             if (item.title) {
//                 html += `<strong>${item.title}</strong><br>`;
//             }
//             if (item.subtitle) {
//                 html += `<small style="color: #666;">${item.subtitle}</small><br>`;
//             }
//             if (item.body) {
//                 html += `<p style="margin: 5px 0;">${item.body}</p>`;
//             }
//             if (item.url) {
//                 html += `<a href="${item.url}" target="_blank" style="color: #4CAF50; text-decoration: none;">Перейти к материалу →</a>`;
//             }
//             html += '</li>';
//         });
//         html += '</ul>';
//     } else {
//         html += '<p>Нет доступных материалов</p>';
//     }
    
//     container.innerHTML = html;
// }

// function displayError(message) {
//     const titleElement = document.querySelector('h1');
//     const descriptionElement = document.querySelector('.info-box p');
    
//     if (titleElement) {
//         titleElement.textContent = 'Ошибка';
//     }
    
//     if (descriptionElement) {
//         descriptionElement.textContent = message;
//     }
    
//     const tabs = document.querySelector('.tabs');
//     if (tabs) {
//         tabs.style.display = 'none';
//     }
// }




import { API_URL } from "./const/const.js";

document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const emotionCode = params.get('emotion');
    
    if (!emotionCode) {
        displayError('Эмоция не выбрана');
        return;
    }
    
    try {
        // Загружаем информацию об эмоции
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

        // Загружаем рекомендации для конкретной эмоции
        await loadRecommendations(emotionCode);
        
        // Инициализируем вкладки после загрузки всех данных
        initTabs();
        
    } catch (error) {
        console.error('Ошибка:', error);
        displayError('Ошибка загрузки данных с сервера');
    }
});

/**
 * Загрузка рекомендаций для эмоции
 * @param {string} emotionCode - код эмоции
 */
async function loadRecommendations(emotionCode) {
    try {
        // Пытаемся загрузить рекомендации через основной эндпоинт с параметром emotion
        // Так как в recommendation.routes.js используется router.get('/')
        const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
        
        if (response.ok) {
            const data = await response.json();
            
            // Обрабатываем разные форматы ответа
            if (data.materials) {
                window.currentEmotionMaterials = data.materials;
            } else if (data.material) {
                window.currentEmotionMaterials = data.material;
            } else if (data.music || data.video || data.images || data.exercises || data.articles) {
                // Если данные приходят прямо в корне ответа
                window.currentEmotionMaterials = data;
            } else {
                console.warn('Неизвестный формат данных:', data);
                window.currentEmotionMaterials = {};
            }
            
            console.log('Загруженные материалы:', window.currentEmotionMaterials);
            return;
        }
        
        // Если первый способ не сработал, пробуем через API эмоций
        console.warn('Не удалось загрузить через /api/recommendation, пробуем другие варианты...');
        
        // Пробуем загрузить через эндпоинт с emotionCode в пути
        const altResponse = await fetch(`${API_URL}/api/recommendations/${emotionCode}`);
        if (altResponse.ok) {
            const altData = await altResponse.json();
            window.currentEmotionMaterials = altData.materials || altData.material || altData;
            console.log('Загружено через альтернативный эндпоинт:', window.currentEmotionMaterials);
            return;
        }
        
        // Если ничего не сработало, создаем пустой объект
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
        infoBox.style.backgroundColor = `${emotionData.color}20`; // 20 = ~12% прозрачности
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
    
    // Показываем первую вкладку по умолчанию
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
    
    // Маппинг вкладок на соответствующие поля в данных
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
            
            // Заголовок
            if (item.title) {
                html += `<h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">${item.title}</h3>`;
            }
            
            // Подзаголовок или исполнитель для музыки
            if (item.subtitle || item.artist) {
                const subtitle = item.subtitle || item.artist;
                html += `<div style="margin: 0 0 10px 0; color: #666; font-weight: normal; font-size: 14px;">${subtitle}</div>`;
            }
            
            // Описание
            if (item.description || item.body || item.text) {
                const description = item.description || item.body || item.text;
                html += `<p style="margin: 10px 0; color: #555; line-height: 1.5;">${description}</p>`;
            }
            
            // Ссылка
            if (item.url || item.link) {
                const url = item.url || item.link;
                html += `<a href="${url}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Перейти к материалу →</a>`;
            }
            
            // Вложения (если есть)
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
    
    // Добавляем кнопку возврата на главную
    const container = document.querySelector('.container');
    if (container) {
        const backButton = document.createElement('button');
        backButton.textContent = '← Вернуться на главную';
        backButton.style.cssText = 'margin-top: 20px; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;';
        backButton.onclick = () => window.location.href = 'index.html';
        container.appendChild(backButton);
    }
}