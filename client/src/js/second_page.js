
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

 import { API_URL } from "./const/const.js"

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
        
        // Создаем контейнер для контента, если его нет
        createContentContainer();
        initTabs();
        
    } catch (error) {
        console.error('Ошибка:', error);
        displayError('Ошибка загрузки данных с сервера');
    }
});

function createContentContainer() {
    // Проверяем, существует ли уже контейнер для контента
    let contentContainer = document.querySelector('.tab-content-container');
    
    if (!contentContainer) {
        contentContainer = document.createElement('div');
        contentContainer.className = 'tab-content-container';
        
        // Вставляем после блока с вкладками
        const tabsContainer = document.querySelector('.tabs');
        const container = document.querySelector('.container');
        
        if (tabsContainer && container) {
            container.insertBefore(contentContainer, tabsContainer.nextSibling);
        }
    }
    
    return contentContainer;
}

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
        infoBox.style.borderLeft = `4px solid ${emotionData.color}`;
        infoBox.style.backgroundColor = `${emotionData.color}15`;
    }
    
    if (emotionData.effect) {
        document.body.classList.add(`emotion-${emotionData.effect}`);
    }
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    if (tabs.length === 0) return;
    
    const contentContainer = document.querySelector('.tab-content-container') || createContentContainer();
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            showTabContent(tabId, contentContainer);
        });
    });
    
    // Активируем первую вкладку по умолчанию
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
            title = 'Изображения';
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
        default:
            title = 'Материалы';
            items = [];
    }
    
    let html = `<h2 class="tab-title">${title}</h2>`;
    
    if (items && items.length > 0) {
        html += '<div class="media-grid">';
        items.forEach((item, index) => {
            html += '<div class="media-card">';
            
            // Отображение в зависимости от типа контента
            if (tabId === 'music') {
                html += renderMusicItem(item, index);
            } 
            else if (tabId === 'video') {
                html += renderVideoItem(item, index);
            }
            else if (tabId === 'images') {
                html += renderImageItem(item, index);
            }
            else {
                html += renderTextItem(item, tabId);
            }
            
            html += '</div>';
        });
        html += '</div>';
    } else {
        html += '<div class="no-materials">';
        html += '<p>Нет доступных материалов</p>';
        html += '</div>';
    }
    
    container.innerHTML = html;
    
    // Добавляем обработчики для видео
    addVideoHandlers();
}

function renderMusicItem(item, index) {
    return `
        <div class="media-player audio-player">
            <div class="media-icon">🎵</div>
            <div class="media-info">
                <strong>${item.title || 'Аудио материал'}</strong>
                ${item.subtitle ? `<br><small>${item.subtitle}</small>` : ''}
                ${item.author ? `<br><small class="author">${item.author}</small>` : ''}
            </div>
            ${item.audioUrl ? `
                <audio controls class="audio-control" data-id="audio-${index}">
                    <source src="${item.audioUrl}" type="audio/mpeg">
                    Ваш браузер не поддерживает аудио элемент.
                </audio>
            ` : `
                <div class="placeholder-player">
                    <span>Аудио временно недоступно</span>
                </div>
            `}
        </div>
    `;
}

function renderVideoItem(item, index) {
    return `
        <div class="media-player video-player">
            ${item.videoUrl ? `
                <video controls preload="metadata" data-id="video-${index}" poster="${item.thumbnail || ''}">
                    <source src="${item.videoUrl}" type="video/mp4">
                    Ваш браузер не поддерживает видео элемент.
                </video>
            ` : `
                <div class="video-placeholder">
                    <span class="placeholder-icon">🎬</span>
                </div>
            `}
            <div class="media-info">
                <strong>${item.title || 'Видео материал'}</strong>
                ${item.subtitle ? `<br><small>${item.subtitle}</small>` : ''}
                ${item.duration ? `<br><small class="duration">⏱️ ${item.duration}</small>` : ''}
            </div>
        </div>
    `;
}

function renderImageItem(item, index) {
    return `
        <div class="media-player image-viewer">
            ${item.imageUrl ? `
                <img src="${item.imageUrl}" 
                     alt="${item.title || 'Изображение'}" 
                     class="media-image" 
                     onclick="openImageModal('${item.imageUrl}', '${item.title || ''}')"
                     loading="lazy">
            ` : `
                <div class="image-placeholder">
                    <span class="placeholder-icon">🖼️</span>
                </div>
            `}
            <div class="media-info">
                <strong>${item.title || 'Изображение'}</strong>
                ${item.subtitle ? `<br><small>${item.subtitle}</small>` : ''}
            </div>
        </div>
    `;
}

function renderTextItem(item, type) {
    return `
        <div class="media-info text-item">
            ${item.title ? `<h3 class="item-title">${item.title}</h3>` : ''}
            ${item.subtitle ? `<p class="item-subtitle">${item.subtitle}</p>` : ''}
            ${item.body ? `<p class="item-body">${item.body}</p>` : ''}
            ${item.duration ? `<p class="item-meta">⏱️ ${item.duration}</p>` : ''}
            ${item.url ? `
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="media-link">
                    Перейти к материалу →
                </a>
            ` : ''}
        </div>
    `;
}

function addVideoHandlers() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('play', function() {
            // Останавливаем другие видео при воспроизведении этого
            videos.forEach(v => {
                if (v !== video && !v.paused) {
                    v.pause();
                }
            });
        });
    });
}

// Функция для открытия изображения в модальном окне
window.openImageModal = function(imageUrl, title) {
    // Удаляем существующее модальное окно, если оно есть
    const existingModal = document.querySelector('.image-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                ${title ? `<h3 class="modal-title">${title}</h3>` : ''}
                <img src="${imageUrl}" alt="${title || 'Изображение'}">
            </div>
        </div>
    `;
    
    // Закрытие по клику на фон или кнопку закрытия
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal') || e.target.classList.contains('modal-overlay')) {
            document.body.removeChild(modal);
        }
    });
    
    // Закрытие по ESC
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    document.body.appendChild(modal);
    
    // Блокируем скролл body
    document.body.style.overflow = 'hidden';
    
    // Возвращаем скролл при закрытии
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (!document.querySelector('.image-modal')) {
                document.body.style.overflow = '';
            }
        });
    });
    
    observer.observe(document.body, { childList: true });
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