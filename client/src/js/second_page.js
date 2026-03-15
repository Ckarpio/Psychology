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
        await loadRecommendationsFromDB(emotionCode);
        initTabs();
        
        // Добавляем кнопку возврата после загрузки контента
        addBackButton();
        
    } catch (error) {
        console.error('Ошибка:', error);
        displayError('Ошибка загрузки данных с сервера');
    }
});

/**
 * Функция для добавления кнопки возврата на главную
 */
function addBackButton() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Проверяем, есть ли уже кнопка
    if (document.querySelector('.back-to-main')) return;
    
    const backButton = document.createElement('button');
    backButton.className = 'back-to-main';
    backButton.innerHTML = `
        <span style="font-size: 20px;">←</span>
        <span>Вернуться на главную</span>
    `;
    backButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin: 30px 0 20px 0;
        padding: 12px 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    // Добавляем эффекты при наведении
    backButton.addEventListener('mouseover', () => {
        backButton.style.transform = 'translateY(-3px)';
        backButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
    });
    
    backButton.addEventListener('mouseout', () => {
        backButton.style.transform = 'translateY(0)';
        backButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    });
    
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    container.appendChild(backButton);
}

/**
 * Функция для обработки URL Pinterest
 * @param {string} url - URL изображения
 * @returns {string} - обработанный URL для отображения
 */
function processPinterestUrl(url) {
    if (!url) return url;
    
    // Если это уже прямая ссылка на изображение Pinterest
    if (url.includes('i.pinimg.com')) {
        return url;
    }
    
    // Если это ссылка на пин, пытаемся преобразовать
    if (url.includes('pinterest.com/pin/')) {
        console.warn('Обнаружена ссылка на пин Pinterest. Нужна прямая ссылка на изображение (i.pinimg.com)');
        return null;
    }
    
    return url;
}

/**
 * Функция для загрузки и обработки фотографий
 * @param {string} imageUrl - URL изображения
 * @returns {Promise<string>} - обработанный URL или путь к изображению
 */
async function loadImage(imageUrl) {
    if (!imageUrl) return null;
    
    // Обрабатываем URL Pinterest
    const processedUrl = processPinterestUrl(imageUrl);
    if (!processedUrl) return null;
    
    console.log('Попытка загрузить изображение:', processedUrl);
    
    try {
        // Если это уже полный URL, возвращаем как есть
        if (processedUrl.startsWith('http')) {
            // Для Pinterest не проверяем HEAD-запросом, т.к. могут быть ограничения
            if (processedUrl.includes('i.pinimg.com')) {
                return processedUrl;
            }
            
            // Проверяем, доступно ли изображение
            const response = await fetch(processedUrl, { method: 'HEAD' }).catch(() => null);
            if (response && response.ok) {
                return processedUrl;
            } else {
                console.warn('Изображение не доступно по URL:', processedUrl);
                return null;
            }
        }
        
        // Если это относительный путь, добавляем базовый URL
        const fullUrl = `${API_URL}${processedUrl}`;
        
        // Проверяем, доступно ли изображение
        const response = await fetch(fullUrl, { method: 'HEAD' }).catch(() => null);
        if (response && response.ok) {
            return fullUrl;
        } else {
            console.warn('Изображение не найдено на сервере:', fullUrl);
            return null;
        }
    } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
        return null;
    }
}

/**
 * Функция для предзагрузки нескольких изображений
 * @param {Array} items - массив объектов с изображениями
 * @returns {Promise<Array>} - массив объектов с загруженными изображениями
 */
async function preloadImages(items) {
    if (!items || !Array.isArray(items)) return [];
    
    const loadedItems = [];
    
    for (const item of items) {
        // Ищем URL в поле "изображения" (русское название)
        const imageUrl = item.изображения || item.url || item.src || item.path || item.image_url || item.imageUrl;
        
        if (imageUrl) {
            console.log('Найдено изображение в поле:', imageUrl);
            const loadedUrl = await loadImage(imageUrl);
            if (loadedUrl) {
                loadedItems.push({
                    ...item,
                    loadedUrl: loadedUrl,
                    originalUrl: imageUrl
                });
            } else {
                console.warn('Не удалось загрузить изображение:', imageUrl);
            }
        }
    }
    
    return loadedItems;
}

/**
 * Функция для извлечения информации из ссылки VK
 */
function parseVKUrl(url) {
    if (!url) return null;
    
    // Проверяем, что это ссылка VK
    if (!url.includes('vk.com') && !url.includes('vk.ru')) {
        return null;
    }
    
    let trackInfo = {
        title: 'Трек в VK Музыке',
        artist: '',
        type: 'track',
        icon: '🎵',
        color: '#0077FF'
    };
    
    // Пытаемся извлечь информацию из разных паттернов VK ссылок
    
    // Паттерн: audio-20012345_12345678
    const audioMatch = url.match(/audio(-?\d+_\d+)/);
    if (audioMatch) {
        trackInfo.title = 'Аудиозапись VK';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'track';
    }
    
    // Паттерн: music/album/-20012345_12345678
    const albumMatch = url.match(/album[\/-](-?\d+_\d+)/);
    if (albumMatch) {
        trackInfo.title = 'Альбом';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'album';
        trackInfo.icon = '💿';
    }
    
    // Паттерн: music/playlist/-20012345_12345678
    const playlistMatch = url.match(/playlist[\/-](-?\d+_\d+)/);
    if (playlistMatch) {
        trackInfo.title = 'Плейлист';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'playlist';
        trackInfo.icon = '📀';
    }
    
    // Паттерн: artist/id
    const artistMatch = url.match(/artist[\/-](\d+)/);
    if (artistMatch) {
        trackInfo.title = 'Страница артиста';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'artist';
        trackInfo.icon = '👤';
    }
    
    // Пытаемся получить название из query параметров
    try {
        const urlObj = new URL(url);
        const qParam = urlObj.searchParams.get('q');
        if (qParam) {
            trackInfo.title = qParam;
            trackInfo.artist = 'Поиск VK';
        }
    } catch (e) {
        // Игнорируем ошибки парсинга URL
    }
    
    return trackInfo;
}

/**
 * Функция для определения типа ссылки VK
 */
function getVKLinkInfo(url) {
    if (!url) return null;
    
    // Проверяем, что это ссылка VK
    if (!url.includes('vk.com') && !url.includes('vk.ru')) {
        return null;
    }
    
    // Определяем тип контента
    if (url.includes('/music') || url.includes('/audio')) {
        if (url.includes('/playlist')) {
            return {
                type: 'playlist',
                icon: '📀',
                title: 'Плейлист в VK Музыке',
                color: '#0077FF'
            };
        } else if (url.includes('/album')) {
            return {
                type: 'album',
                icon: '💿',
                title: 'Альбом в VK Музыке',
                color: '#0077FF'
            };
        } else if (url.includes('/artist')) {
            return {
                type: 'artist',
                icon: '👤',
                title: 'Артист в VK Музыке',
                color: '#0077FF'
            };
        } else {
            return {
                type: 'track',
                icon: '🎵',
                title: 'Трек в VK Музыке',
                color: '#0077FF'
            };
        }
    } else if (url.includes('/video')) {
        return {
            type: 'video',
            icon: '🎬',
            title: 'Видео в VK',
            color: '#0077FF'
        };
    }
    
    return {
        type: 'vk',
        icon: '🔗',
        title: 'Ссылка VK',
        color: '#0077FF'
    };
}

/**
 * Функция для получения embed URL Rutube
 */
function getRutubeEmbedUrl(url) {
    if (!url || !url.includes('rutube.ru')) return null;
    
    console.log('Обрабатываем ссылку Rutube:', url);
    
    const patterns = [
        { regex: /video\/([a-zA-Z0-9]+)/, type: 'video' },
        { regex: /embed\/([a-zA-Z0-9]+)/, type: 'embed' },
        { regex: /[?&]v=([a-zA-Z0-9]+)/, type: 'param' },
        { regex: /\/([a-zA-Z0-9]{32,})/, type: 'direct' }
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern.regex);
        if (match) {
            const videoId = match[1];
            console.log('Найден ID видео Rutube:', videoId);
            return {
                embedUrl: `https://rutube.ru/play/embed/${videoId}`,
                videoId: videoId,
                platform: 'rutube',
                name: 'Rutube',
                color: '#34A1F0',
                icon: '🎬',
                canEmbed: true
            };
        }
    }
    
    if (url.includes('rutube.ru')) {
        console.warn('Не удалось извлечь ID из ссылки Rutube:', url);
        return {
            embedUrl: null,
            videoId: null,
            platform: 'rutube',
            name: 'Rutube',
            color: '#34A1F0',
            icon: '🎬',
            canEmbed: false
        };
    }
    
    return null;
}

/**
 * Загрузка рекомендаций из базы данных
 */
async function loadRecommendationsFromDB(emotionCode) {
    try {
        const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Данные из базы данных:', data);
        
        if (data.materials) {
            window.currentEmotionMaterials = data.materials;
        } else if (data.material) {
            window.currentEmotionMaterials = data.material;
        } else if (data.music || data.video || data.images || data.exercises || data.articles) {
            window.currentEmotionMaterials = data;
        } else {
            console.warn('Неизвестная структура данных:', data);
            window.currentEmotionMaterials = detectMaterialsStructure(data);
        }
        
        console.log('Обработанные материалы из БД:', window.currentEmotionMaterials);
        
    } catch (error) {
        console.error('Ошибка при загрузке из базы данных:', error);
        displayError('Не удалось загрузить материалы из базы данных');
    }
}

/**
 * Пытается определить структуру материалов из полученных данных
 */
function detectMaterialsStructure(data) {
    const structured = {
        music: [],
        video: [],
        images: [],
        exercises: [],
        articles: []
    };
    
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
                // Определяем по URL
                if (item.url || item.изображения) {
                    const url = item.url || item.изображения;
                    
                    if (url.includes('rutube.ru')) {
                        structured.video.push(item);
                    } else if (url.includes('vk.com') || url.includes('vk.ru')) {
                        if (url.includes('video')) {
                            structured.video.push(item);
                        } else {
                            structured.music.push(item);
                        }
                    } else if (url.match(/\.(mp3|wav|ogg)$/i)) {
                        structured.music.push(item);
                    } else if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) || url.includes('i.pinimg.com')) {
                        structured.images.push(item);
                    } else {
                        structured.articles.push(item);
                    }
                } else {
                    structured.articles.push(item);
                }
            }
        });
    } else {
        return data;
    }
    
    return structured;
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
    
    const tabMapping = {
        'music': 'music',
        'video': 'video',
        'images': 'images',
        'exercises': 'exercises',
        'articles': 'articles'
    };
    
    const dataField = tabMapping[tabId];
    items = materials[dataField] || [];
    
    console.log(`Рендерим вкладку ${tabId}, элементов:`, items.length);
    
    let html = `<h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">${getIconForTab(tabId)} ${getTitleForTab(tabId)}</h2>`;
    
    if (items && items.length > 0) {
        html += await renderTabContent(tabId, items);
    } else {
        html += getEmptyStateHTML(tabId);
    }
    
    container.innerHTML = html;
}

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

function getTitleForTab(tabId) {
    const titles = {
        'music': 'Музыка',
        'video': 'Видео',
        'images': 'Фотографии',
        'exercises': 'Упражнения',
        'articles': 'Статьи'
    };
    return titles[tabId] || tabId;
}

async function renderTabContent(tabId, items) {
    switch(tabId) {
        case 'images':
            return await renderImages(items);
        case 'music':
            return renderMusic(items);
        case 'video':
            return renderRutubeVideos(items);
        case 'exercises':
            return renderExercises(items);
        case 'articles':
            return renderArticles(items);
        default:
            return renderDefault(items);
    }
}

/**
 * Рендеринг фотографий с поддержкой Pinterest
 */
async function renderImages(items) {
    let html = '<div class="images-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding: 20px 0;">';
    
    console.log('Загружаем изображения из БД:', items);
    
    // Предзагружаем изображения
    const loadedItems = await preloadImages(items);
    
    console.log('Загруженные изображения:', loadedItems);
    
    if (loadedItems.length === 0) {
        return '<div class="empty-gallery" style="padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 24px; color: #999;"><p style="font-size: 64px; margin: 0 0 20px 0; opacity: 0.5;">🖼️</p><p style="font-size: 18px; color: #666;">Нет доступных фотографий</p></div>';
    }
    
    for (const item of loadedItems) {
        const imageUrl = item.loadedUrl;
        const title = item.title || item.name || item.название || 'Фотография';
        const description = item.description || item.описание || '';
        const author = item.author || item.photographer || item.автор || '';
        
        // Определяем, Pinterest ли это
        const isPinterest = imageUrl.includes('i.pinimg.com');
        
        html += `
            <div class="image-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s ease; cursor: pointer;" 
                 onclick="window.open('${imageUrl}', '_blank')"
                 onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.15)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';">
                
                <!-- Контейнер для изображения -->
                <div style="position: relative; width: 100%; height: 220px; background: #f5f5f5; overflow: hidden;">
                    <img src="${imageUrl}" 
                         alt="${title}" 
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;"
                         onerror="this.onerror=null; 
                                  this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f0f0f0;color:#999;\'><span style=\'font-size:48px;\'>🖼️</span><span style=\'margin-top:10px;\'>Фото не доступно</span></div>';"
                         onload="this.style.opacity='1';">
                </div>
                
                <!-- Информация о фотографии -->
                <div style="padding: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px; font-weight: 600; line-height: 1.3;">${title}</h4>
                    ${author ? `<div style="margin: 0 0 8px 0; color: #666; font-size: 14px;">📷 ${author}</div>` : ''}
                    ${description ? `<p style="margin: 0 0 12px 0; color: #666; font-size: 14px; line-height: 1.5;">${description}</p>` : ''}
                    
                    <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <span style="background: #4CAF5020; color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                            🖼️ Фотография
                        </span>
                        ${isPinterest ? `
                            <span style="background: #E6002320; color: #E60023; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                                📌 Pinterest
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    
    return html;
}

/**
 * Рендеринг музыки с автоматическим извлечением информации из ссылки
 */
function renderMusic(items) {
    let html = '<div class="music-list">';
    
    items.forEach((item) => {
        // Ищем URL в разных полях
        const audioUrl = item.url || item.audio_url || item.audioUrl || item.file_url || item.fileUrl || item.link;
        
        if (!audioUrl) {
            console.warn('Нет URL для музыкального элемента:', item);
            return;
        }
        
        // Пытаемся извлечь информацию из ссылки VK
        const vkParsedInfo = parseVKUrl(audioUrl);
        
        // Проверяем, является ли ссылка VK
        const isVK = audioUrl.includes('vk.com') || audioUrl.includes('vk.ru');
        
        // Для VK ссылок - красивая карточка с информацией из ссылки
        if (isVK) {
            const vkInfo = getVKLinkInfo(audioUrl);
            
            // Используем информацию из парсинга ссылки
            const trackTitle = vkParsedInfo?.title || 'Трек в VK Музыке';
            const artist = vkParsedInfo?.artist || '';
            
            html += `
                <div class="music-item vk-music" style="margin-bottom: 25px; padding: 30px; background: linear-gradient(135deg, #0077FF08 0%, #0077FF15 100%); border: 1px solid #0077FF30; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,119,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 25px; flex-wrap: wrap;">
                        <!-- VK Иконка -->
                        <div style="background: #0077FF; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,119,255,0.3);">
                            <span style="font-size: 40px; color: white;">${vkInfo?.icon || '🎵'}</span>
                        </div>
                        
                        <!-- Информация о треке -->
                        <div style="flex: 2; min-width: 300px;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                <span style="background: #0077FF20; color: #0077FF; padding: 5px 15px; border-radius: 30px; font-size: 14px; font-weight: 500;">
                                    VK Музыка
                                </span>
                                <span style="color: #999; font-size: 14px;">
                                    ${vkInfo?.type === 'playlist' ? 'Плейлист' : 
                                      vkInfo?.type === 'album' ? 'Альбом' : 
                                      vkInfo?.type === 'artist' ? 'Артист' : 'Трек'}
                                </span>
                            </div>
                            
                            <!-- Название трека -->
                            <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 28px; font-weight: 700; line-height: 1.3;">
                                ${trackTitle}
                            </h3>
                            
                            <!-- Исполнитель (если удалось извлечь) -->
                            ${artist ? `
                                <div style="margin: 0 0 20px 0; color: #0077FF; font-size: 22px; font-weight: 600;">
                                    ${artist}
                                </div>
                            ` : ''}
                          
                            
                            <!-- Кнопка перехода в VK -->
                            <a href="${audioUrl}" target="_blank" 
                               style="display: inline-flex; align-items: center; justify-content: center; gap: 12px; 
                                      background: #0077FF; 
                                      color: white; 
                                      text-decoration: none; 
                                      padding: 16px 32px; 
                                      border-radius: 50px; 
                                      font-weight: 600; 
                                      font-size: 16px;
                                      letter-spacing: 0.5px;
                                      transition: all 0.3s ease;
                                      box-shadow: 0 8px 20px rgba(0,119,255,0.3);
                                      border: 1px solid rgba(255,255,255,0.2);
                                      width: fit-content;"
                               onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 15px 30px rgba(0,119,255,0.4)'; this.style.background='#0066DD';"
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(0,119,255,0.3)'; this.style.background='#0077FF';">
                                <span style="font-size: 24px;">🎧</span>
                                <span>Слушать в VK Музыке</span>
                                <span style="font-size: 20px;">→</span>
                            </a>
                            
                            <!-- Дополнительная информация -->
                            <div style="margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
                                <span style="color: #999; font-size: 13px; display: flex; align-items: center; gap: 5px;">
                                    <span style="color: #0077FF;">●</span> Требуется авторизация VK
                                </span>
                                <span style="color: #999; font-size: 13px; display: flex; align-items: center; gap: 5px;">
                                    <span style="color: #0077FF;">●</span> Доступно в приложении VK
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } 
        // Для локальных аудиофайлов
        else if (audioUrl.match(/\.(mp3|wav|ogg|m4a)$/i)) {
            const fullAudioUrl = audioUrl.startsWith('http') ? audioUrl : `${API_URL}${audioUrl}`;
            html += `
                <div class="music-item" style="margin-bottom: 20px; padding: 25px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                        <div style="font-size: 48px; background: #4CAF5020; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">🎵</div>
                        <div style="flex: 1; min-width: 250px;">
                            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 24px; font-weight: 600;">${item.title || 'Аудиозапись'}</h3>
                            ${item.artist ? `<div style="margin: 0 0 12px 0; color: #4CAF50; font-size: 18px; font-weight: 500;">${item.artist}</div>` : ''}
                            <audio controls style="width: 100%; margin-top: 10px;">
                                <source src="${fullAudioUrl}" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        </div>
                    </div>
                </div>
            `;
        }
        // Для других внешних ссылок
        else {
            html += `
                <div class="music-item external-service" style="margin-bottom: 20px; padding: 25px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 16px;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="font-size: 48px;">🔗</div>
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 24px; font-weight: 600;">${item.title || 'Внешний ресурс'}</h3>
                            ${item.artist ? `<div style="margin: 0 0 12px 0; color: #6c757d; font-size: 18px;">${item.artist}</div>` : ''}
                            ${item.description ? `<p style="margin: 0 0 15px 0; color: #666;">${item.description}</p>` : ''}
                            <a href="${audioUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #6c757d; color: white; text-decoration: none; border-radius: 30px; font-weight: 500;">
                                Перейти к источнику →
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг видео только с Rutube (без отображения длительности)
 */
function renderRutubeVideos(items) {
    let html = '<div class="video-list rutube-videos">';
    let hasValidVideos = false;
    
    items.forEach((item) => {
        const videoUrl = item.url || item.video_url || item.videoUrl || item.embed_url || item.embedUrl;
        
        if (!videoUrl) {
            console.warn('Нет URL для видео элемента:', item);
            return;
        }
        
        // Получаем информацию о видео Rutube
        const rutubeInfo = getRutubeEmbedUrl(videoUrl);
        
        // Показываем только видео с Rutube
        if (rutubeInfo) {
            hasValidVideos = true;
            
            // Получаем название видео и автора
            const videoTitle = item.title || item.name || 'Видео на Rutube';
            const videoAuthor = item.author || item.artist || item.channel || '';
            
            // Если есть embed URL - показываем плеер
            if (rutubeInfo.canEmbed && rutubeInfo.embedUrl) {
                html += `
                    <div class="video-item rutube-video" style="margin-bottom: 40px; padding: 25px; background: linear-gradient(135deg, #34A1F008 0%, #34A1F015 100%); border: 2px solid #34A1F030; border-radius: 24px; box-shadow: 0 15px 30px rgba(52,161,240,0.15);">
                        <!-- Заголовок видео -->
                        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #34A1F030;">
                            <div style="background: #34A1F0; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 15px rgba(52,161,240,0.3);">
                                <span style="font-size: 30px; color: white;">🎬</span>
                            </div>
                            <div style="flex: 1;">
                                <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 26px; font-weight: 700; line-height: 1.3;">${videoTitle}</h3>
                                <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                                    ${videoAuthor ? `<span style="color: #34A1F0; font-size: 18px; font-weight: 500;">${videoAuthor}</span>` : ''}
                                    <span style="background: #34A1F020; color: #34A1F0; padding: 4px 12px; border-radius: 30px; font-size: 13px; font-weight: 500;">
                                        Rutube
                                    </span>
                                </div>
                                ${item.description ? `<p style="margin: 15px 0 0 0; color: #666; line-height: 1.6;">${item.description}</p>` : ''}
                            </div>
                        </div>
                        
                        <!-- Rutube плеер -->
                        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; margin-bottom: 20px; background: #000; box-shadow: 0 10px 25px rgba(52,161,240,0.3);">
                            <iframe 
                                src="${rutubeInfo.embedUrl}" 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 16px;"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen>
                            </iframe>
                        </div>
                        
                        <!-- Информация и ссылки (без длительности) -->
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; padding: 0 10px;">
                            <div style="display: flex; gap: 15px; align-items: center;">
                                <span style="color: #34A1F0; font-size: 14px; background: #34A1F010; padding: 4px 12px; border-radius: 20px;">
                                    🆔 ID: ${rutubeInfo.videoId ? rutubeInfo.videoId.substring(0, 8) + '...' : 'загрузка'}
                                </span>
                            </div>
                            <a href="${videoUrl}" target="_blank" 
                               style="display: inline-flex; align-items: center; gap: 8px; background: #34A1F0; color: white; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 15px; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(52,161,240,0.3);"
                               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 18px rgba(52,161,240,0.4)'; this.style.background='#2A8CD0';"
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(52,161,240,0.3)'; this.style.background='#34A1F0';">
                                <span>Смотреть на Rutube</span>
                                <span style="font-size: 18px;">→</span>
                            </a>
                        </div>
                    </div>
                `;
            } else {
                // Если не удалось получить embed URL
                html += `
                    <div class="video-item rutube-video" style="margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, #34A1F008 0%, #34A1F015 100%); border: 2px solid #34A1F030; border-radius: 24px; text-align: center;">
                        <div style="font-size: 64px; margin-bottom: 20px;">🎬</div>
                        <h3 style="margin: 0 0 15px 0; color: #1A1A1A; font-size: 24px; font-weight: 600;">${videoTitle}</h3>
                        ${videoAuthor ? `<p style="margin: 0 0 10px 0; color: #34A1F0; font-size: 18px;">${videoAuthor}</p>` : ''}
                        <p style="margin: 0 0 25px 0; color: #666;">Это видео доступно для просмотра только на Rutube</p>
                        <a href="${videoUrl}" target="_blank" 
                           style="display: inline-block; padding: 14px 32px; background: #34A1F0; color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">
                            Перейти к видео на Rutube →
                        </a>
                    </div>
                `;
            }
        }
    });
    
    if (!hasValidVideos) {
        html += `
            <div style="padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 24px;">
                <p style="font-size: 64px; margin: 0 0 20px 0; opacity: 0.5;">🎬</p>
                <p style="font-size: 18px; color: #666;">Нет видео с Rutube для этой эмоции</p>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

function renderExercises(items) {
    let html = '<div class="exercises-list">';
    
    items.forEach((item) => {
        html += `
            <div class="exercise-item" style="margin-bottom: 20px; padding: 25px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 24px; font-weight: 600;">${item.title || item.name || 'Упражнение'}</h3>
                ${item.subtitle ? `<div style="margin: 0 0 10px 0; color: #666; font-weight: 500;">${item.subtitle}</div>` : ''}
                ${item.description ? `<p style="margin: 0 0 15px 0; color: #555;">${item.description}</p>` : ''}
                
                ${item.body || item.instructions || item.text || item.content ? `
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-top: 15px;">
                        <pre style="margin: 0; white-space: pre-wrap; font-family: inherit; color: #333; line-height: 1.6;">${item.body || item.instructions || item.text || item.content}</pre>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderArticles(items) {
    let html = '<div class="articles-list">';
    
    items.forEach((item) => {
        const content = item.displayContent || item.text || item.body || item.content || item.description;
        
        html += `
            <div class="article-item" style="margin-bottom: 25px; padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 28px; font-weight: 700; border-bottom: 2px solid #4CAF50; padding-bottom: 12px;">${item.title || item.name || 'Статья'}</h3>
                ${item.author ? `<div style="margin: 0 0 15px 0; color: #666; font-style: italic; font-size: 16px;">Автор: ${item.author}</div>` : ''}
                
                <div style="line-height: 1.8; color: #444; font-size: 16px;">
                    ${content ? content.split('\n').map(paragraph => 
                        paragraph.trim() ? `<p style="margin-bottom: 20px;">${paragraph}</p>` : ''
                    ).join('') : '<p style="color: #999;">Содержание не доступно</p>'}
                </div>
                
                ${item.external_url || item.link || item.url ? `
                    <a href="${item.external_url || item.link || item.url}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 30px; font-weight: 500;">
                        Читать полностью →
                    </a>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderDefault(items) {
    let html = '<div class="default-list">';
    
    items.forEach((item) => {
        html += `
            <div class="default-item" style="margin-bottom: 15px; padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px;">
                <pre style="margin: 0; white-space: pre-wrap; font-size: 14px;">${JSON.stringify(item, null, 2)}</pre>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function getEmptyStateHTML(tabId) {
    const messages = {
        'music': '🎵 В базе данных нет музыкальных материалов для этой эмоции',
        'video': '🎬 В базе данных нет видео с Rutube для этой эмоции',
        'images': '🖼️ В базе данных нет фотографий для этой эмоции',
        'exercises': '📖 В базе данных нет упражнений для этой эмоции',
        'articles': '📄 В базе данных нет статей для этой эмоции'
    };
    
    return `
        <div style="padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 24px; color: #999;">
            <p style="font-size: 80px; margin: 0 0 25px 0; opacity: 0.5;">${getIconForTab(tabId)}</p>
            <p style="font-size: 18px; font-style: italic; margin: 0; color: #666;">${messages[tabId] || 'Нет доступных материалов в базе данных'}</p>
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
    
    const container = document.querySelector('.container');
    if (container) {
        const backButton = document.createElement('button');
        backButton.className = 'back-to-main';
        backButton.innerHTML = `
            <span style="font-size: 20px;">←</span>
            <span>Вернуться на главную</span>
        `;
        backButton.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin: 30px 0 20px 0;
            padding: 12px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        `;
        
        backButton.addEventListener('mouseover', () => {
            backButton.style.transform = 'translateY(-3px)';
            backButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
        });
        
        backButton.addEventListener('mouseout', () => {
            backButton.style.transform = 'translateY(0)';
            backButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });
        
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        container.appendChild(backButton);
    }
}

// Добавляем CSS
const style = document.createElement('style');
style.textContent = `
    .image-item:hover, .music-item:hover, .exercise-item:hover, .article-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        transition: all 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .tab-content-container {
        animation: fadeIn 0.4s ease-out;
    }
    
    .vk-music {
        transition: all 0.3s ease;
    }
    
    .vk-music:hover {
        transform: translateY(-3px);
        box-shadow: 0 20px 35px rgba(0,119,255,0.15) !important;
    }
    
    .rutube-video {
        transition: all 0.3s ease;
    }
    
    .rutube-video:hover {
        transform: translateY(-3px);
        box-shadow: 0 25px 40px rgba(52,161,240,0.2) !important;
    }
    
    audio {
        width: 100%;
        border-radius: 40px;
        height: 50px;
    }
    
    audio::-webkit-media-controls-panel {
        background-color: #f0f0f0;
    }
    
    .back-to-main {
        animation: fadeIn 0.5s ease-out;
    }
    
    .rutube-videos iframe {
        transition: opacity 0.3s;
    }
    
    .rutube-videos iframe:hover {
        opacity: 0.95;
    }
    
    .images-gallery {
        animation: fadeIn 0.5s ease-out;
    }
`;
document.head.appendChild(style);

/**
 * ВРЕМЕННАЯ ОТЛАДОЧНАЯ ФУНКЦИЯ
 * Покажет, какие данные реально приходят из БД
 */
async function renderImages(items) {
    let html = '<div style="padding: 20px; background: #f0f0f0;">';
    
    console.log('🔍 ОТЛАДКА ИЗОБРАЖЕНИЙ:');
    console.log('Получены данные из БД:', JSON.stringify(items, null, 2));
    console.log('Количество элементов:', items.length);
    
    if (items.length === 0) {
        return '<p>Нет изображений в БД</p>';
    }
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Проверяем все возможные поля, где может быть ссылка
        const possibleUrls = [
            { field: 'изображения', value: item.изображения },
            { field: 'url', value: item.url },
            { field: 'src', value: item.src },
            { field: 'path', value: item.path },
            { field: 'image_url', value: item.image_url },
            { field: 'imageUrl', value: item.imageUrl }
        ];
        
        // Находим первый непустой URL
        let imageUrl = null;
        let usedField = null;
        for (const p of possibleUrls) {
            if (p.value) {
                imageUrl = p.value;
                usedField = p.field;
                break;
            }
        }
        
        console.log(`\n📌 Элемент ${i + 1}:`);
        console.log('  Все поля объекта:', Object.keys(item));
        console.log('  Значение поля "изображения":', item.изображения);
        console.log('  Используемое поле:', usedField);
        console.log('  Найденный URL:', imageUrl);
        
        html += `
            <div style="margin-bottom: 30px; padding: 20px; border: 2px solid #333; border-radius: 10px; background: white;">
                <h3 style="margin-top: 0;">Элемент #${i + 1}</h3>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                    <p><strong>Поле "изображения":</strong> ${item.изображения || '❌ НЕ НАЙДЕНО'}</p>
                    <p><strong>Поле "название":</strong> ${item.название || 'Нет'}</p>
                    <p><strong>Поле "описание":</strong> ${item.описание || 'Нет'}</p>
                    <p><strong>Поле "автор":</strong> ${item.автор || 'Нет'}</p>
                </div>
                
                <p><strong>URL для загрузки:</strong> ${imageUrl || '❌ НЕТ URL'}</p>
                
                ${imageUrl ? `
                    <div style="margin-top: 15px;">
                        <p><strong>Попытка загрузить изображение:</strong></p>
                        <img src="${imageUrl}" 
                             style="max-width: 300px; max-height: 200px; border: 3px solid #4CAF50;"
                             onload="console.log('✅ Изображение ${i + 1} загружено'); this.style.border='3px solid green';"
                             onerror="console.error('❌ Ошибка загрузки изображения ${i + 1}'); this.style.border='3px solid red'; this.parentElement.innerHTML+='<p style=\'color:red;\'>Ошибка загрузки!</p>'; this.style.display='none';">
                        
                        <p><a href="${imageUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background: #2196F3; color: white; text-decoration: none; border-radius: 4px;">🔗 Открыть ссылку напрямую</a></p>
                    </div>
                ` : '<p style="color:red;">Нет ссылки для загрузки</p>'}
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}