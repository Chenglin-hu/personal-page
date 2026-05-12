// ========== 页面加载动画 ==========
document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.card');
    card.classList.add('loading');
    setTimeout(() => {
        card.classList.add('loaded');
    }, 100);

    // 初始化所有功能
    initThemeToggle();
    initSignature();
    initSkillTags();
    initMoreBtn();
    initMessageBoard();
    initVisitCounter();
    initSnowEffect();
    initMusicPlayer();
    loadMessages();
});

// ========== 深色模式切换 ==========
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // 从 localStorage 读取主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // 添加切换动画
        themeToggle.style.transform = 'scale(1.2) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ========== 按钮交互：显示/隐藏详细信息 ==========
function initMoreBtn() {
    const moreBtn = document.getElementById('moreBtn');
    const extraInfo = document.getElementById('extraInfo');

    moreBtn.addEventListener('click', function() {
        if (extraInfo.classList.contains('show')) {
            extraInfo.classList.remove('show');
            moreBtn.innerHTML = '📖 了解更多';
        } else {
            extraInfo.classList.add('show');
            moreBtn.innerHTML = '🔼 收回';
            
            // 滚动到详细信息
            setTimeout(() => {
                extraInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });
}

// ========== 个性签名自动轮播 ==========
function initSignature() {
    const signature = document.getElementById('signature');
    const signatures = [
        '『根深者，必成参天』',
        '『代码改变世界』',
        '『Stay hungry, stay foolish』',
        '『保持热爱，奔赴山海』',
        '『道阻且长，行则将至』'
    ];
    let currentIndex = 0;

    function switchSignature() {
        signature.classList.add('fade');
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % signatures.length;
            signature.textContent = signatures[currentIndex];
            signature.classList.remove('fade');
        }, 400);
    }

    setInterval(switchSignature, 4000);
}

// ========== 技能标签泡泡弹窗 ==========
function initSkillTags() {
    const skillPopup = document.getElementById('skillPopup');
    const skillTags = document.querySelectorAll('.skill-tag');

    const explanations = {
        '🎭 INFJ': '提倡者型人格，安静而坚定，富有理想主义',
        '🎵 音乐': '喜欢各种风格的音乐，从古典到电子',
        '🚶 散步': '享受漫步时的放空与观察，思考人生',
        '🍜 美食': '探索美味，认为吃是最高级的治愈',
        '✍️ 文字': '用文字记录生活，书写内心想法',
        '💻 HTML/CSS': '构建网页的基石，热爱创造美好界面',
        '⚡ JavaScript': '让网页活起来的魔法语言',
        '⚛️ React': '现代前端框架，组件化开发',
        '🟢 Node.js': '用 JavaScript 写后端，全栈开发'
    };

    let popupVisible = false;

    function showPopup(tag, text) {
        skillPopup.querySelector('.bubble-text').textContent = text;
        skillPopup.classList.remove('pop-out');
        skillPopup.style.opacity = '0';
        skillPopup.style.pointerEvents = 'none';
        
        const card = document.querySelector('.card');
        const tagRect = tag.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const popupWidth = skillPopup.offsetWidth;
        const popupHeight = skillPopup.offsetHeight;
        
        let popupCenterX = tagRect.left - cardRect.left + tagRect.width / 2;
        let left = popupCenterX - popupWidth / 2;
        let popupTop = (tagRect.top - cardRect.top) - popupHeight - 12;
        
        const minLeft = 5;
        const maxLeft = cardRect.width - popupWidth - 5;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;
        
        if (popupTop < 5) {
            popupTop = (tagRect.bottom - cardRect.top) + 12;
        }
        
        skillPopup.style.left = left + 'px';
        skillPopup.style.top = popupTop + 'px';
        
        skillPopup.classList.remove('show');
        void skillPopup.offsetWidth;
        skillPopup.classList.add('show');
        
        popupVisible = true;
    }

    function popBubble() {
        if (!popupVisible) return;
        skillPopup.classList.add('pop-out');
        skillPopup.addEventListener('animationend', function onAnimEnd(e) {
            if (e.animationName === 'popOut') {
                skillPopup.classList.remove('show', 'pop-out');
                skillPopup.style.opacity = '0';
                skillPopup.style.pointerEvents = 'none';
                popupVisible = false;
                skillPopup.removeEventListener('animationend', onAnimEnd);
            }
        });
    }

    function hidePopupQuick() {
        skillPopup.classList.remove('show', 'pop-out');
        skillPopup.style.opacity = '0';
        skillPopup.style.pointerEvents = 'none';
        popupVisible = false;
    }

    skillTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.stopPropagation();
            const tagText = this.textContent.trim();
            const explanation = explanations[tagText] || '暂无说明';
            showPopup(this, explanation);
        });

        // 悬停提示
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        tag.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    skillPopup.addEventListener('click', function(e) {
        e.stopPropagation();
        popBubble();
    });

    document.addEventListener('click', function(e) {
        if (popupVisible && !e.target.classList.contains('skill-tag') && e.target !== skillPopup) {
            hidePopupQuick();
        }
    });
}

// ========== 留言板功能 ==========
function initMessageBoard() {
    const sendMessageBtn = document.getElementById('sendMessage');
    const clearBtn = document.getElementById('clearBtn');
    const messageName = document.getElementById('messageName');
    const messageText = document.getElementById('messageText');
    const messageList = document.getElementById('messageList');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 发送留言
    sendMessageBtn.addEventListener('click', function() {
        const name = messageName.value.trim() || '匿名访客';
        const text = messageText.value.trim();

        if (!text) {
            showMessage('说点什么吧～', 'warning');
            messageText.focus();
            return;
        }

        if (text.length > 200) {
            showMessage('留言太长啦，请控制在 200 字以内', 'warning');
            return;
        }

        const message = {
            id: Date.now(),
            name: name,
            text: text,
            time: new Date().toISOString()
        };

        saveMessage(message);
        addMessageToList(message);
        
        messageText.value = '';
        messageName.value = '';
        showMessage('留言发送成功！✨', 'success');
    });

    // 清空留言
    clearBtn.addEventListener('click', function() {
        if (confirm('确定要清空所有留言吗？此操作不可恢复！')) {
            localStorage.removeItem('messages');
            messageList.innerHTML = '<div class="empty-message">暂无留言，快来成为第一个留言的人吧！💌</div>';
            showMessage('已清空所有留言', 'success');
        }
    });

    // 筛选功能
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const messages = getMessages();
            
            if (filter === 'latest') {
                const sorted = messages.sort((a, b) => new Date(b.time) - new Date(a.time));
                renderMessages(sorted);
            } else {
                renderMessages(messages);
            }
        });
    });

    // 支持 Enter 发送（Ctrl+Enter 换行）
    messageText.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.ctrlKey) {
            e.preventDefault();
            sendMessageBtn.click();
        }
    });
}

function getMessages() {
    const messages = localStorage.getItem('messages');
    return messages ? JSON.parse(messages) : [];
}

function saveMessage(message) {
    const messages = getMessages();
    messages.unshift(message);
    localStorage.setItem('messages', JSON.stringify(messages));
}

function loadMessages() {
    const messageList = document.getElementById('messageList');
    const messages = getMessages();

    if (messages.length === 0) {
        messageList.innerHTML = '<div class="empty-message">暂无留言，快来成为第一个留言的人吧！💌</div>';
        return;
    }

    renderMessages(messages);
}

function renderMessages(messages) {
    const messageList = document.getElementById('messageList');
    
    if (messages.length === 0) {
        messageList.innerHTML = '<div class="empty-message">暂无留言</div>';
        return;
    }

    messageList.innerHTML = messages.map(msg => {
        const date = new Date(msg.time);
        const timeStr = formatTime(date);
        
        return `
            <div class="message-item" data-id="${msg.id}">
                <div class="message-content">
                    <div class="message-author">${escapeHtml(msg.name)}</div>
                    <div class="message-text">${escapeHtml(msg.text)}</div>
                    <div class="message-meta">
                        <span>${timeStr}</span>
                    </div>
                </div>
                <button class="message-delete" onclick="deleteMessage(${msg.id})">删除</button>
            </div>
        `;
    }).join('');
}

function addMessageToList(message) {
    const messageList = document.getElementById('messageList');
    const emptyMsg = messageList.querySelector('.empty-message');
    if (emptyMsg) {
        emptyMsg.remove();
    }

    const date = new Date(message.time);
    const timeStr = formatTime(date);

    const messageHTML = `
        <div class="message-item" data-id="${message.id}">
            <div class="message-content">
                <div class="message-author">${escapeHtml(message.name)}</div>
                <div class="message-text">${escapeHtml(message.text)}</div>
                <div class="message-meta">
                    <span>${timeStr}</span>
                </div>
            </div>
            <button class="message-delete" onclick="deleteMessage(${message.id})">删除</button>
        </div>
    `;

    messageList.insertAdjacentHTML('afterbegin', messageHTML);
}

function deleteMessage(id) {
    if (confirm('确定要删除这条留言吗？')) {
        let messages = getMessages();
        messages = messages.filter(m => m.id !== id);
        localStorage.setItem('messages', JSON.stringify(messages));
        loadMessages();
        showMessage('留言已删除', 'success');
    }
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showMessage(text, type = 'info') {
    // 创建提示框
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#48bb78' : type === 'warning' ? '#ed8936' : '#4299e1'};
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideDown 0.3s ease;
    `;
    toast.textContent = text;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ========== 访问计数器 ==========
function initVisitCounter() {
    const visitCountEl = document.getElementById('visitCount');
    
    // 从 localStorage 读取访问次数
    let count = localStorage.getItem('visitCount');
    
    if (!count) {
        count = Math.floor(Math.random() * 100) + 50; // 初始随机值
    } else {
        count = parseInt(count) + 1;
    }
    
    localStorage.setItem('visitCount', count);
    
    // 动画显示
    animateValue(visitCountEl, 0, count, 1500);
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ========== 雪花效果 ==========
function initSnowEffect() {
    const snowContainer = document.getElementById('snowContainer');
    const snowflakes = ['❄️', '❅', '❆', '✻', '✼', '❉'];
    
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        // 随机位置和大小
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
        snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
        snowflake.style.opacity = Math.random() * 0.5 + 0.3;
        
        snowContainer.appendChild(snowflake);
        
        // 动画结束后移除
        setTimeout(() => {
            snowflake.remove();
        }, 8000);
    }

    // 每 300ms 创建一个雪花
    setInterval(createSnowflake, 300);
    
    // 初始创建一些雪花
    for (let i = 0; i < 10; i++) {
        setTimeout(createSnowflake, i * 100);
    }
}

// ========== 音乐播放器 ==========
function initMusicPlayer() {
    const playBtn = document.getElementById('playBtn');
    const musicStatus = document.querySelector('.music-status');
    const musicIcon = document.querySelector('.music-icon');
    
    let isPlaying = false;
    let audio = null;

    playBtn.addEventListener('click', function() {
        if (!audio) {
            // 创建一个简单的音频（这里使用在线音乐 URL，实际使用时可替换）
            audio = new Audio('https://prod-1.storage.jamendo.com/?trackid=1834959&format=mp31&from=FPu0Y1kW323%2FxaO8HG2k4Q%3D%3D%7Cu6R8YpBLdPv1lD0jcqV%2Ffg%3D%3D');
            audio.loop = true;
            
            audio.addEventListener('ended', () => {
                isPlaying = false;
                playBtn.textContent = '▶️';
                musicStatus.textContent = '点击播放';
                musicIcon.style.animation = '';
            });
            
            audio.addEventListener('error', () => {
                musicStatus.textContent = '播放失败';
            });
        }

        if (isPlaying) {
            audio.pause();
            playBtn.textContent = '▶️';
            musicStatus.textContent = '已暂停';
            musicIcon.style.animation = '';
        } else {
            audio.play().catch(e => {
                console.log('播放失败:', e);
                musicStatus.textContent = '无法播放';
            });
            playBtn.textContent = '⏸️';
            musicStatus.textContent = '播放中...';
            musicIcon.style.animation = 'bounce 1s ease infinite';
        }
        
        isPlaying = !isPlaying;
    });
}

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', function(e) {
    // T - 切换主题
    if (e.key === 't' && !e.ctrlKey && !e.target.matches('input, textarea')) {
        document.getElementById('themeToggle').click();
    }
    
    // M - 切换音乐
    if (e.key === 'm' && !e.ctrlKey) {
        document.getElementById('playBtn').click();
    }
    
    // Escape - 关闭弹窗
    if (e.key === 'Escape') {
        const popup = document.getElementById('skillPopup');
        if (popup.classList.contains('show')) {
            popup.classList.remove('show');
        }
    }
});



// ========== 控制台彩蛋 ==========
console.log('%c🌲 欢迎访问程檩的个人主页！', 'font-size: 20px; color: #569688; font-weight: bold;');
console.log('%c💻 使用快捷键 T 切换主题，M 播放音乐', 'font-size: 14px; color: #4a5568;');
console.log('%c✨ 点击技能标签可以查看详细说明哦～', 'font-size: 14px; color: #4a5568;');
