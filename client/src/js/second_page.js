

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

//         await loadRecommendations(emotionCode);

//         initTabs();
        
//     } catch (error) {
//         console.error('Ошибка:', error);
//         displayError('Ошибка загрузки данных с сервера');
//     }
// });

// /**
//  *
//  * @param {string} emotionCode -
//  */
// async function loadRecommendations(emotionCode) {
//     try {
    
//         const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
        
//         if (response.ok) {
//             const data = await response.json();
            
//             if (data.materials) {
//                 window.currentEmotionMaterials = data.materials;
//             } else if (data.material) {
//                 window.currentEmotionMaterials = data.material;
//             } else if (data.music || data.video || data.images || data.exercises || data.articles) {
         
//                 window.currentEmotionMaterials = data;
//             } else {
//                 console.warn('Неизвестный формат данных:', data);
//                 window.currentEmotionMaterials = {};
//             }
            
//             console.log('Загруженные материалы:', window.currentEmotionMaterials);
//             return;
//         }
        
//         console.warn('Не удалось загрузить через /api/recommendation, пробуем другие варианты...');

//         const altResponse = await fetch(`${API_URL}/api/recommendations/${emotionCode}`);
//         if (altResponse.ok) {
//             const altData = await altResponse.json();
//             window.currentEmotionMaterials = altData.materials || altData.material || altData;
//             console.log('Загружено через альтернативный эндпоинт:', window.currentEmotionMaterials);
//             return;
//         }
        
    
//         window.currentEmotionMaterials = {};
//         console.log('Рекомендации не найдены, используем пустой объект');
        
//     } catch (error) {
//         console.error('Ошибка при загрузке рекомендаций:', error);
//         window.currentEmotionMaterials = {};
//     }
// }

// function displayEmotionInfo(emotionData) {
//     const titleElement = document.querySelector('h1');
//     const descriptionElement = document.querySelector('.info-box p');
    
//     if (!titleElement || !descriptionElement) {
//         console.error('Элементы для отображения информации не найдены');
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
    
//     if (emotionData.effect) {
//         additionalHtml += `<p><strong>Тип:</strong> ${emotionData.effect === 'positive' ? 'Позитивная' : 'Негативная'}</p>`;
//     }
    
//     additionalInfoContainer.innerHTML = additionalHtml;
// }

// function initTabs() {
//     const tabs = document.querySelectorAll('.tab');
    
//     if (tabs.length === 0) {
//         console.error('Вкладки не найдены');
//         return;
//     }
    
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
    

//     const defaultTab = document.querySelector('.tab');
//     if (defaultTab) {
//         defaultTab.classList.add('active');
//         const defaultTabId = defaultTab.getAttribute('data-tab');
//         showTabContent(defaultTabId, contentContainer);
//     }
// }

// function showTabContent(tabId, container) {
//     const materials = window.currentEmotionMaterials || {};
    
//     let items = [];
//     let title = '';
//     let icon = '';
    
//     const tabMapping = {
//         'music': 'music',
//         'video': 'video',
//         'images': 'images',
//         'exercises': 'exercises',
//         'articles': 'articles'
//     };
    
//     const dataField = tabMapping[tabId];
    
//     switch(tabId) {
//         case 'music':
//             title = 'Музыка';
//             icon = '🎵';
//             items = materials[dataField] || [];
//             break;
//         case 'video':
//             title = 'Видео';
//             icon = '🎬';
//             items = materials[dataField] || [];
//             break;
//         case 'images':
//             title = 'Картинки';
//             icon = '🖼️';
//             items = materials[dataField] || [];
//             break;
//         case 'exercises':
//             title = 'Упражнения';
//             icon = '📖';
//             items = materials[dataField] || [];
//             break;
//         case 'articles':
//             title = 'Статьи';
//             icon = '📄';
//             items = materials[dataField] || [];
//             break;
//         default:
//             title = tabId;
//             items = [];
//     }
    
//     let html = `<h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">${icon} ${title}</h2>`;
    
//     if (items && items.length > 0) {
//         html += '<div class="materials-list">';
//         items.forEach((item, index) => {
//             html += '<div class="material-item" style="margin-bottom: 20px; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">';
            
            
//             if (item.title) {
//                 html += `<h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">${item.title}</h3>`;
//             }
            
            
//             if (item.subtitle || item.artist) {
//                 const subtitle = item.subtitle || item.artist;
//                 html += `<div style="margin: 0 0 10px 0; color: #666; font-weight: normal; font-size: 14px;">${subtitle}</div>`;
//             }
            

//             if (item.description || item.body || item.text) {
//                 const description = item.description || item.body || item.text;
//                 html += `<p style="margin: 10px 0; color: #555; line-height: 1.5;">${description}</p>`;
//             }
            
        
//             if (item.url || item.link) {
//                 const url = item.url || item.link;
//                 html += `<a href="${url}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Перейти к материалу →</a>`;
//             }
            
    
//             if (item.attachments && item.attachments.length > 0) {
//                 html += '<div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc;">';
//                 html += '<div style="font-size: 13px; color: #666; margin-bottom: 8px;">Вложения:</div>';
//                 item.attachments.forEach(att => {
//                     if (att.url) {
//                         html += `<a href="${att.url}" target="_blank" style="display: inline-block; margin-right: 15px; color: #2196F3; text-decoration: none; font-size: 13px;">📎 ${att.name || 'Файл'}</a>`;
//                     }
//                 });
//                 html += '</div>';
//             }
            
//             html += '</div>';
//         });
//         html += '</div>';
//     } else {
//         html += '<div style="padding: 40px 20px; text-align: center; background: #f9f9f9; border-radius: 8px; color: #999;">';
//         html += `<p style="font-size: 48px; margin: 0 0 10px 0;">${icon}</p>`;
//         html += '<p style="font-style: italic;">Нет доступных материалов для этой категории</p>';
//         html += '</div>';
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
    

//     const container = document.querySelector('.container');
//     if (container) {
//         const backButton = document.createElement('button');
//         backButton.textContent = '← Вернуться на главную';
//         backButton.style.cssText = 'margin-top: 20px; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;';
//         backButton.onclick = () => window.location.href = 'index.html';
//         container.appendChild(backButton);
//     }
// }



import { API_URL } from "./const/const.js";

// Глобальная переменная для хранения материалов
window.currentEmotionMaterials = {};

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

        // Загружаем рекомендации из базы данных
        await loadRecommendationsFromDB(emotionCode);

        initTabs();
        
    } catch (error) {
        console.error('Ошибка:', error);
        displayError('Ошибка загрузки данных с сервера');
    }
});

/**
 * Загрузка рекомендаций из базы данных
 * @param {string} emotionCode - код эмоции
 */
async function loadRecommendationsFromDB(emotionCode) {
    try {
        // Пытаемся загрузить данные из базы через API
        const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Данные из базы данных:', data);
        
        // Обрабатываем данные в зависимости от структуры
        if (data.materials) {
            // Структура: { materials: { music: [...], images: [...], ... } }
            window.currentEmotionMaterials = data.materials;
        } else if (data.material) {
            // Структура: { material: { music: [...], images: [...], ... } }
            window.currentEmotionMaterials = data.material;
        } else if (data.music || data.video || data.images || data.exercises || data.articles) {
            // Структура: { music: [...], images: [...], ... }
            window.currentEmotionMaterials = data;
        } else {
            // Если структура неизвестна, пробуем определить по первому уровню
            console.warn('Неизвестная структура данных, пробуем определить автоматически:', data);
            window.currentEmotionMaterials = detectMaterialsStructure(data);
        }
        
        console.log('Обработанные материалы из БД:', window.currentEmotionMaterials);
        
        // Проверяем, есть ли вообще какие-то материалы
        const hasMaterials = Object.values(window.currentEmotionMaterials).some(
            arr => Array.isArray(arr) && arr.length > 0
        );
        
        if (!hasMaterials) {
            console.warn('В базе данных нет материалов для этой эмоции');
            // Не показываем ошибку, просто оставляем пустые вкладки
        }
        
    } catch (error) {
        console.error('Ошибка при загрузке из базы данных:', error);
        displayError('Не удалось загрузить материалы из базы данных');
    }
}

/**
 * Пытается определить структуру материалов из полученных данных
 * @param {Object} data - данные из БД
 * @returns {Object} структурированные материалы
 */
function detectMaterialsStructure(data) {
    const structured = {
        music: [],
        video: [],
        images: [],
        exercises: [],
        articles: []
    };
    
    // Если data - массив, группируем по полю type
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item.type && structured.hasOwnProperty(item.type)) {
                structured[item.type].push(item);
            } else if (item.category) {
                const category = item.category.toLowerCase();
                if (structured.hasOwnProperty(category)) {
                    structured[category].push(item);
                }
            } else {
                // Если тип не указан, пробуем определить по содержимому
                if (item.url && item.url.match(/\.(mp3|wav|ogg)$/i)) {
                    structured.music.push(item);
                } else if (item.url && item.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    structured.images.push(item);
                } else if (item.url && item.url.match(/\.(mp4|webm|ogg)$/i)) {
                    structured.video.push(item);
                } else {
                    // По умолчанию в статьи
                    structured.articles.push(item);
                }
            }
        });
    } else {
        // Если data - объект, оставляем как есть
        return data;
    }
    
    return structured;
}

/**
 * Загрузка содержимого текстового файла из базы
 * @param {string} url - URL файла из БД
 * @returns {Promise<string|null>} содержимое файла
 */
async function loadTextFileContent(url) {
    try {
        // Если URL уже полный, используем его, иначе добавляем базовый URL
        const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
        const response = await fetch(fullUrl);
        
        if (response.ok) {
            return await response.text();
        }
    } catch (error) {
        console.error('Ошибка загрузки текстового файла:', error);
    }
    return null;
}

function displayEmotionInfo(emotionData) {
    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.info-box p');
    
    if (!titleElement || !descriptionElement) {
        console.error('Элементы для отображения информации не найдены');
        return;
    }
    
    titleElement.textContent = emotionData.label || emotionData.name || 'Эмоция';
    descriptionElement.textContent = emotionData.description || '';
   
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
    
    // Активируем первую вкладку
    const defaultTab = document.querySelector('.tab');
    if (defaultTab) {
        defaultTab.classList.add('active');
        const defaultTabId = defaultTab.getAttribute('data-tab');
        showTabContent(defaultTabId, contentContainer);
    }
}

async function showTabContent(tabId, container) {
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
    items = materials[dataField] || [];
    
    // Загружаем содержимое текстовых файлов для статей
    if (tabId === 'articles' && items.length > 0) {
        for (const item of items) {
            // Проверяем разные возможные поля для URL файла
            const fileUrl = item.file_url || item.fileUrl || item.url || item.path || item.content_url;
            if (fileUrl) {
                const content = await loadTextFileContent(fileUrl);
                if (content) {
                    item.displayContent = content;
                }
            }
        }
    }
    
    let html = `<h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">${getIconForTab(tabId)} ${getTitleForTab(tabId)}</h2>`;
    
    if (items && items.length > 0) {
        html += renderTabContent(tabId, items);
    } else {
        html += getEmptyStateHTML(tabId);
    }
    
    container.innerHTML = html;
}

/**
 * Получить иконку для вкладки
 */
function getIconForTab(tabId) {
    const icons = {
        'music': '🎵',
        'video': '🎬',
        'images': '🖼️',
        'exercises': '📖',
        'articles': '📄'
    };
    return icons[tabId] || '📁';
}

/**
 * Получить заголовок для вкладки
 */
function getTitleForTab(tabId) {
    const titles = {
        'music': 'Музыка',
        'video': 'Видео',
        'images': 'Картинки',
        'exercises': 'Упражнения',
        'articles': 'Статьи'
    };
    return titles[tabId] || tabId;
}

/**
 * Рендеринг содержимого вкладки
 */
function renderTabContent(tabId, items) {
    switch(tabId) {
        case 'images':
            return renderImages(items);
        case 'music':
            return renderMusic(items);
        case 'video':
            return renderVideo(items);
        case 'exercises':
            return renderExercises(items);
        case 'articles':
            return renderArticles(items);
        default:
            return renderDefault(items);
    }
}

/**
 * Рендеринг изображений из базы данных
 */
function renderImages(items) {
    let html = '<div class="images-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; padding: 15px 0;">';
    
    items.forEach((item, index) => {
        // Получаем URL изображения из разных возможных полей БД
        const imageUrl = item.url || item.src || item.path || item.image_url || item.imageUrl;
        const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${API_URL}${imageUrl}`) : null;
        
        if (fullImageUrl) {
            html += `
                <div class="image-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s; cursor: pointer;" onclick="window.open('${fullImageUrl}', '_blank')">
                    <img src="${fullImageUrl}" alt="${item.title || item.name || item.description || 'Image'}" 
                         style="width: 100%; height: 200px; object-fit: cover; border-bottom: 1px solid #eee;"
                         onerror="this.onerror=null; this.src='${API_URL}/placeholder.jpg';">
                    <div style="padding: 12px;">
                        ${item.title ? `<h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">${item.title}</h4>` : ''}
                        ${item.name && !item.title ? `<h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">${item.name}</h4>` : ''}
                        ${item.description ? `<p style="margin: 0; color: #666; font-size: 14px;">${item.description}</p>` : ''}
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг музыки из базы данных
 */
function renderMusic(items) {
    let html = '<div class="music-list">';
    
    items.forEach((item, index) => {
        // Получаем URL аудио из разных возможных полей БД
        const audioUrl = item.url || item.audio_url || item.audioUrl || item.file_url || item.fileUrl;
        const fullAudioUrl = audioUrl ? (audioUrl.startsWith('http') ? audioUrl : `${API_URL}${audioUrl}`) : null;
        
        html += `
            <div class="music-item" style="margin-bottom: 20px; padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 40px;">🎵</div>
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 5px 0; color: #333; font-size: 18px;">${item.title || item.name || 'Аудиозапись'}</h3>
                        ${item.artist || item.author || item.subtitle ? `<div style="margin: 0 0 10px 0; color: #666; font-size: 14px;">${item.artist || item.author || item.subtitle}</div>` : ''}
                        ${item.description ? `<p style="margin: 0 0 15px 0; color: #555; line-height: 1.5;">${item.description}</p>` : ''}
                        
                        ${fullAudioUrl ? `
                            <audio controls style="width: 100%; margin-top: 10px;">
                                <source src="${fullAudioUrl}" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        ` : ''}
                        
                        ${item.external_url || item.link ? `
                            <a href="${item.external_url || item.link}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Слушать на внешнем ресурсе →</a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг видео из базы данных
 */
function renderVideo(items) {
    let html = '<div class="video-list">';
    
    items.forEach((item, index) => {
        // Получаем URL видео из разных возможных полей БД
        const videoUrl = item.url || item.video_url || item.videoUrl || item.embed_url || item.embedUrl;
        
        html += `
            <div class="video-item" style="margin-bottom: 30px; padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">${item.title || item.name || 'Видео'}</h3>
                ${item.description ? `<p style="margin: 0 0 15px 0; color: #666;">${item.description}</p>` : ''}
                
                ${videoUrl ? `
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; margin-bottom: 10px;">
                        <iframe 
                            src="${videoUrl}" 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                            allowfullscreen>
                        </iframe>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг упражнений из базы данных
 */
function renderExercises(items) {
    let html = '<div class="exercises-list">';
    
    items.forEach((item, index) => {
        html += `
            <div class="exercise-item" style="margin-bottom: 20px; padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">${item.title || item.name || 'Упражнение'}</h3>
                ${item.subtitle ? `<div style="margin: 0 0 10px 0; color: #666; font-weight: 500;">${item.subtitle}</div>` : ''}
                ${item.description ? `<p style="margin: 0 0 15px 0; color: #555;">${item.description}</p>` : ''}
                
                ${item.body || item.instructions || item.text || item.content ? `
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 10px;">
                        <pre style="margin: 0; white-space: pre-wrap; font-family: inherit; color: #333;">${item.body || item.instructions || item.text || item.content}</pre>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг статей из базы данных
 */
function renderArticles(items) {
    let html = '<div class="articles-list">';
    
    items.forEach((item, index) => {
        const content = item.displayContent || item.text || item.body || item.content || item.description;
        
        html += `
            <div class="article-item" style="margin-bottom: 25px; padding: 25px; background: white; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">${item.title || item.name || 'Статья'}</h3>
                ${item.author ? `<div style="margin: 0 0 10px 0; color: #666; font-style: italic;">Автор: ${item.author}</div>` : ''}
                
                <div style="line-height: 1.6; color: #444;">
                    ${content ? content.split('\n').map(paragraph => 
                        paragraph.trim() ? `<p style="margin-bottom: 15px;">${paragraph}</p>` : ''
                    ).join('') : '<p style="color: #999;">Содержание не доступно</p>'}
                </div>
                
                ${item.external_url || item.link || item.url ? `
                    <a href="${item.external_url || item.link || item.url}" target="_blank" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Читать полностью →</a>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг по умолчанию (для отладки)
 */
function renderDefault(items) {
    let html = '<div class="default-list">';
    
    items.forEach((item, index) => {
        html += `
            <div class="default-item" style="margin-bottom: 15px; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 8px;">
                <pre style="margin: 0; white-space: pre-wrap;">${JSON.stringify(item, null, 2)}</pre>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * HTML для пустого состояния
 */
function getEmptyStateHTML(tabId) {
    const messages = {
        'music': '🎵 В базе данных нет музыкальных материалов для этой эмоции',
        'video': '🎬 В базе данных нет видео материалов для этой эмоции',
        'images': '🖼️ В базе данных нет изображений для этой эмоции',
        'exercises': '📖 В базе данных нет упражнений для этой эмоции',
        'articles': '📄 В базе данных нет статей для этой эмоции'
    };
    
    return `
        <div style="padding: 60px 20px; text-align: center; background: #f9f9f9; border-radius: 12px; color: #999;">
            <p style="font-size: 64px; margin: 0 0 20px 0;">${getIconForTab(tabId)}</p>
            <p style="font-size: 18px; font-style: italic; margin: 0;">${messages[tabId] || 'Нет доступных материалов в базе данных'}</p>
        </div>
    `;
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
    
    // Добавляем кнопку возврата
    const container = document.querySelector('.container');
    if (container) {
        const backButton = document.createElement('button');
        backButton.textContent = '← Вернуться на главную';
        backButton.style.cssText = 'margin-top: 20px; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;';
        backButton.onclick = () => window.location.href = 'index.html';
        container.appendChild(backButton);
    }
}

// Добавляем CSS для анимации
const style = document.createElement('style');
style.textContent = `
    .image-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.15);
    }
    
    .music-item:hover, .exercise-item:hover, .article-item:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .tab-content-container {
        animation: fadeIn 0.3s ease-out;
    }
    
    audio {
        width: 100%;
        border-radius: 30px;
    }
    
    audio::-webkit-media-controls-panel {
        background-color: #f0f0f0;
    }
`;
document.head.appendChild(style);