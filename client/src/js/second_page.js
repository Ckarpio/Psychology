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
        console.log('🔍 Загружаем эмоции...');
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
 * Функция для извлечения ID изображения из ссылки Pinterest
 */
function extractPinterestImageUrl(url) {
    if (!url) return null;
    
    console.log('🔄 Обрабатываем ссылку Pinterest:', url);
    
    // Если это уже прямая ссылка на изображение
    if (url.includes('i.pinimg.com') && (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg') || url.includes('.webp'))) {
        console.log('✅ Уже прямая ссылка на изображение');
        return url;
    }
    
    // Паттерн: pinterest.com/pin/1234567890/
    const pinMatch = url.match(/pinterest\.com\/pin\/(\d+)/i) || 
                     url.match(/pin\/(\d+)/i);
    
    if (pinMatch) {
        const pinId = pinMatch[1];
        console.log('📌 Найден ID пина:', pinId);
        // Формируем прямую ссылку на изображение
        const folder = Math.abs(parseInt(pinId) % 1000).toString().padStart(3, '0');
        return `https://i.pinimg.com/originals/${folder}/${pinId}.jpg`;
    }
    
    // Паттерн: pin.it/XXXXX
    if (url.includes('pin.it/')) {
        console.warn('⚠️ Короткая ссылка pin.it. Рекомендуется использовать прямую ссылку на изображение.');
        return url;
    }
    
    return url;
}

/**
 * Загрузка рекомендаций из базы данных
 */
async function loadRecommendationsFromDB(emotionCode) {
    try {
        console.log('📦 Загружаем рекомендации для эмоции:', emotionCode);
        const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 ПОЛНЫЕ ДАННЫЕ ИЗ БД:', JSON.stringify(data, null, 2));
        
        // Сохраняем данные
        window.currentEmotionMaterials = data;
        
        // Проверяем наличие изображений
        if (data.images) {
            console.log('🖼️ Найдены изображения:', data.images.length);
            console.log('🖼️ Первое изображение:', data.images[0]);
        } else if (data.materials && data.materials.images) {
            console.log('🖼️ Найдены изображения в materials:', data.materials.images.length);
            window.currentEmotionMaterials = data.materials;
        } else {
            console.warn('⚠️ В данных нет поля images');
            console.log('📦 Доступные поля:', Object.keys(data));
        }
        
    } catch (error) {
        console.error('❌ Ошибка при загрузке из базы данных:', error);
        displayError('Не удалось загрузить материалы из базы данных');
    }
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
    
    // Проверяем структуру данных
    if (materials.images) {
        items = materials.images;
    } else if (materials.materials && materials.materials.images) {
        items = materials.materials.images;
    }
    
    console.log(`🎨 Рендерим вкладку ${tabId}, элементов:`, items.length);
    console.log(`🎨 Данные для вкладки ${tabId}:`, items);
    
    let html = `<h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">${getIconForTab(tabId)} ${getTitleForTab(tabId)}</h2>`;
    
    if (items && items.length > 0) {
        html += await renderImages(items);
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
        'exercises': '📋',
        'articles': '💡'
    };
    return icons[tabId] || '📁';
}

function getTitleForTab(tabId) {
    const titles = {
        'music': 'Музыка',
        'video': 'Видео',
        'images': 'Фотографии',
        'exercises': 'Упражнения',
        'articles': 'Советы и статьи'
    };
    return titles[tabId] || tabId;
}

/**
 * Рендеринг фотографий с подробной отладкой
 */
async function renderImages(items) {
    console.log('🖼️ Рендерим изображения, получено элементов:', items.length);
    console.log('🖼️ Данные изображений:', JSON.stringify(items, null, 2));
    
    let html = '<div class="images-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding: 20px 0;">';
    
    let hasImages = false;
    let processedCount = 0;
    
    for (const item of items) {
        processedCount++;
        console.log(`🖼️ Обрабатываем элемент ${processedCount}:`, item);
        
        // Проверяем все возможные поля для URL
        const possibleUrlFields = [
            item.изображения,
            item.url,
            item.image_url,
            item.imageUrl,
            item.src,
            item.path
        ];
        
        // Находим первый непустой URL
        let originalUrl = null;
        for (const field of possibleUrlFields) {
            if (field) {
                originalUrl = field;
                console.log(`✅ Найден URL в поле: ${field}`);
                break;
            }
        }
        
        if (!originalUrl) {
            console.warn('⚠️ Нет URL для изображения, все поля объекта:', Object.keys(item));
            continue;
        }
        
        console.log('🖼️ Оригинальный URL:', originalUrl);
        
        // Извлекаем прямую ссылку на изображение Pinterest
        let imageUrl = extractPinterestImageUrl(originalUrl);
        
        // Если не удалось извлечь, используем оригинал
        if (!imageUrl) {
            imageUrl = originalUrl;
        }
        
        console.log('🖼️ Итоговый URL для отображения:', imageUrl);
        
        hasImages = true;
        const title = item.название || item.title || item.name || 'Фотография';
        const description = item.описание || item.description || '';
        const author = item.автор || item.author || '';
        
        // Определяем источник
        const isPinterest = imageUrl.includes('i.pinimg.com');
        const isPinIt = originalUrl.includes('pin.it');
        
        html += `
            <div class="image-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s ease; cursor: pointer;" 
                 onclick="window.open('${imageUrl}', '_blank')"
                 onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.15)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';">
                
                <div style="position: relative; width: 100%; height: 220px; background: #f5f5f5; overflow: hidden;">
                    <img src="${imageUrl}" 
                         alt="${title}" 
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;"
                         onerror="this.onerror=null; 
                                  this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f0f0f0;color:#999;\'><span style=\'font-size:48px;\'>🖼️</span><span style=\'margin-top:10px;\'>Фото не доступно</span><span style=\'font-size:12px; margin-top:5px; padding:0 10px; word-break:break-all;\'>${originalUrl.substring(0, 50)}...</span></div>';">
                </div>
                
                <div style="padding: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px; font-weight: 600; line-height: 1.3;">${title}</h4>
                    ${author ? `<div style="margin: 0 0 8px 0; color: #666; font-size: 14px;">📷 ${author}</div>` : ''}
                    ${description ? `<p style="margin: 0 0 12px 0; color: #666; font-size: 14px; line-height: 1.5;">${description}</p>` : ''}
                    
                    <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <span style="background: #4CAF5020; color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                            🖼️ Фото
                        </span>
                        ${isPinterest ? `
                            <span style="background: #E6002320; color: #E60023; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                                📌 Pinterest
                            </span>
                        ` : ''}
                        ${isPinIt ? `
                            <span style="background: #FF990020; color: #FF9900; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                                🔗 pin.it
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    if (!hasImages) {
        console.warn('🖼️ Нет изображений для отображения');
        return '<div style="padding: 80px 20px; text-align: center; color: #666;"><p style="font-size: 64px;">🖼️</p><p>Нет доступных фотографий</p></div>';
    }
    
    html += '</div>';
    console.log('🖼️ Рендеринг завершен, обработано изображений:', processedCount);
    return html;
}

// Остальные функции (renderMusic, renderRutubeVideos, renderExercises, renderArticles) 
// остаются без изменений из предыдущего кода

function renderMusic(items) {
    let html = '<div class="music-list">';
    
    items.forEach((item) => {
        const audioUrl = item.url || item.audio_url || item.audioUrl || item.file_url || item.fileUrl || item.link;
        
        if (!audioUrl) {
            console.warn('Нет URL для музыкального элемента:', item);
            return;
        }
        
        const vkParsedInfo = parseVKUrl(audioUrl);
        const isVK = audioUrl.includes('vk.com') || audioUrl.includes('vk.ru');
        
        if (isVK) {
            const vkInfo = getVKLinkInfo(audioUrl);
            const trackTitle = vkParsedInfo?.title || item.title || 'Трек в VK Музыке';
            const artist = vkParsedInfo?.artist || item.artist || '';
            
            html += `
                <div class="music-item vk-music" style="margin-bottom: 25px; padding: 30px; background: linear-gradient(135deg, #0077FF08 0%, #0077FF15 100%); border: 1px solid #0077FF30; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,119,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 25px; flex-wrap: wrap;">
                        <div style="background: #0077FF; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,119,255,0.3);">
                            <span style="font-size: 40px; color: white;">${vkInfo?.icon || '🎵'}</span>
                        </div>
                        
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
                            
                            <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 28px; font-weight: 700; line-height: 1.3;">${trackTitle}</h3>
                            
                            ${artist ? `<div style="margin: 0 0 20px 0; color: #0077FF; font-size: 22px; font-weight: 600;">${artist}</div>` : ''}
                            
                            <a href="${audioUrl}" target="_blank" 
                               style="display: inline-flex; align-items: center; justify-content: center; gap: 12px; 
                                      background: #0077FF; color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600;"
                               onmouseover="this.style.background='#0066DD';"
                               onmouseout="this.style.background='#0077FF';">
                                <span style="font-size: 24px;">🎧</span>
                                <span>Слушать в VK Музыке</span>
                                <span style="font-size: 20px;">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } else if (audioUrl.match(/\.(mp3|wav|ogg|m4a)$/i)) {
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
        } else {
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

function renderRutubeVideos(items) {
    let html = '<div class="video-list rutube-videos">';
    let hasValidVideos = false;
    
    items.forEach((item) => {
        const videoUrl = item.url || item.video_url || item.videoUrl || item.embed_url || item.embedUrl;
        
        if (!videoUrl) return;
        
        const rutubeInfo = getRutubeEmbedUrl(videoUrl);
        
        if (rutubeInfo && rutubeInfo.canEmbed) {
            hasValidVideos = true;
            const videoTitle = item.title || item.name || 'Видео на Rutube';
            const videoAuthor = item.author || item.artist || '';
            
            html += `
                <div class="video-item rutube-video" style="margin-bottom: 40px; padding: 25px; background: linear-gradient(135deg, #34A1F008 0%, #34A1F015 100%); border: 2px solid #34A1F030; border-radius: 24px;">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #34A1F030;">
                        <div style="background: #34A1F0; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 30px; color: white;">🎬</span>
                        </div>
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 26px; font-weight: 700;">${videoTitle}</h3>
                            ${videoAuthor ? `<div style="color: #34A1F0; font-size: 18px;">${videoAuthor}</div>` : ''}
                            ${item.description ? `<p style="margin: 15px 0 0 0; color: #666;">${item.description}</p>` : ''}
                        </div>
                    </div>
                    
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; margin-bottom: 20px; background: #000;">
                        <iframe src="${rutubeInfo.embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                    </div>
                    
                    <a href="${videoUrl}" target="_blank" 
                       style="display: inline-flex; align-items: center; gap: 8px; background: #34A1F0; color: white; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 600;">
                        <span>Смотреть на Rutube</span>
                        <span>→</span>
                    </a>
                </div>
            `;
        }
    });
    
    if (!hasValidVideos) {
        html += '<div style="padding: 80px 20px; text-align: center; color: #666;">🎬 Нет видео с Rutube</div>';
    }
    
    html += '</div>';
    return html;
}

function renderExercises(items) {
    let html = '<div class="exercises-list">';
    
    items.forEach((item) => {
        const exerciseText = item.exercise || item.text || item.body || item.content || item.instructions || item.description;
        const title = item.title || item.name || item.название || 'Упражнение';
        const author = item.author || item.автор || '';
        
        if (!exerciseText) return;
        
        html += `
            <div class="exercise-item" style="margin-bottom: 25px; padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="background: #4CAF50; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px; color: white;">🏋️</span>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #333; font-size: 24px; font-weight: 600;">${title}</h3>
                        ${author ? `<div style="color: #4CAF50;">${author}</div>` : ''}
                    </div>
                </div>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border-left: 4px solid #4CAF50;">
                    <div style="line-height: 1.8; color: #444; font-size: 16px; white-space: pre-wrap;">
                        ${exerciseText.split('\n').map(p => p.trim() ? `<p style="margin-bottom: 15px;">${p}</p>` : '').join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderArticles(items) {
    let html = '<div class="articles-list">';
    
    items.forEach((item) => {
        const articleText = item.article || item.text || item.body || item.content || item.description;
        const title = item.title || item.name || item.название || 'Статья';
        const author = item.author || item.автор || '';
        
        if (!articleText) return;
        
        html += `
            <div class="article-item" style="margin-bottom: 25px; padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="background: #2196F3; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px; color: white;">💡</span>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #333; font-size: 26px; font-weight: 700;">${title}</h3>
                        ${author ? `<div style="color: #2196F3;">${author}</div>` : ''}
                    </div>
                </div>
                
                <div style="background: #ffffff; padding: 20px; border-radius: 12px; border-left: 4px solid #2196F3; line-height: 1.8; color: #444; font-size: 16px; white-space: pre-wrap;">
                    ${articleText.split('\n').map(p => p.trim() ? `<p style="margin-bottom: 15px;">${p}</p>` : '').join('')}
                </div>
                
                ${item.external_url || item.link || item.url ? `
                    <div style="margin-top: 20px; text-align: right;">
                        <a href="${item.external_url || item.link || item.url}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #2196F3; color: white; text-decoration: none; border-radius: 30px;">
                            Читать источник →
                        </a>
                    </div>
                ` : ''}
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
        'exercises': '📋 В базе данных нет упражнений для этой эмоции',
        'articles': '💡 В базе данных нет советов и статей для этой эмоции'
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
`;
document.head.appendChild(style);