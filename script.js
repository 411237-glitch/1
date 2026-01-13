const subjectColors = {
    '國文': '#ff9999',
    '數學': '#99ff99',
    '英文': '#9999ff',
    '地理': '#ffff99',
    '歷史': '#ff99ff',
    '公民': '#99ffff',
    '地科': '#ffcc99',
    '生物': '#ccff99',
    '化學': '#cc99ff',
    '物理': '#ffcccc',
    '其他': '#cccccc'
};

const mushrooms = [
    { name: '金針菇', rarity: 'common', probability: 10, points: 1, desc: '極度普遍，適合火鍋與湯品。' },
    { name: '香菇', rarity: 'common', probability: 10, points: 1, desc: '中式料理靈魂，分為新鮮與乾貨（乾貨香氣更濃）。' },
    { name: '杏鮑菇', rarity: 'common', probability: 10, points: 1, desc: '肉質肥厚，口感類似鮑魚，適合素食者替代肉類。' },
    { name: '鴻喜菇', rarity: 'common', probability: 10, points: 1, desc: '質地細緻，常用於快炒或日式料理。' },
    { name: '木耳', rarity: 'common', probability: 10, points: 1, desc: '雖然是真菌，但口感脆爽，分為黑木耳與白木耳（銀耳）。' },
    { name: '猴頭菇', rarity: 'rare', probability: 7.5, points: 3, desc: '毛茸茸的外觀像猴頭，口感極像肉類，是素食料理中的高級食材，有「山珍」之美譽。' },
    { name: '舞菇', rarity: 'rare', probability: 7.5, points: 3, desc: '香氣獨特，據說發現者會高興得手舞足蹈而得名，在日本極受歡迎。' },
    { name: '竹笙', rarity: 'rare', probability: 7.5, points: 3, desc: '寄生在枯竹根部，網狀外觀優美，常用於高級燉湯，現在多為人工養殖，但野生仍屬少見。' },
    { name: '雞油菌', rarity: 'rare', probability: 7.5, points: 3, desc: '顏色金黃，帶有淡淡的杏桃果香，常見於法式料理，目前大多仍依賴野生採集。' },
    { name: '松茸', rarity: 'epic', probability: 5, points: 7, desc: '日本飲食文化中的頂級食材。無法人工完全栽培，只能在特定的紅松林中共生。香氣濃烈獨特，秋季限定。' },
    { name: '牛肝菌', rarity: 'epic', probability: 5, points: 7, desc: '義大利與法國料理的寵兒。肉質肥厚，乾燥後的香氣極具爆發力，被稱為世界四大名菌之一。' },
    { name: '羊肚菌', rarity: 'epic', probability: 5, points: 7, desc: '外觀像蜂巢或羊肚。生長環境挑剔（常在森林火災後的土地生長），口感脆嫩，在法式料理中地位極高。' },
    { name: '虎掌菇', rarity: 'epic', probability: 5, points: 7, desc: '生長在高山懸崖或嚴苛環境，產量稀少，香氣濃郁，是中國歷代的宮廷貢品。' },
    { name: '黑松露', rarity: 'legendary', probability: 2.5, points: 15, desc: '主要產於法國，生長在地底，需要透過松露獵犬尋找。氣味複雜深沉，被譽為「餐桌上的黑鑽石」。' },
    { name: '白松露', rarity: 'legendary', probability: 2.5, points: 15, desc: '比黑松露更稀有，主要產於義大利阿爾巴地區。無法人工種植，產期極短。其香氣帶有蒜頭、瓦斯與費洛蒙的奇特混合味，價格是世界上最昂貴的食材之一。' },
    { name: '野生冬蟲夏草', rarity: 'legendary', probability: 2.5, points: 15, desc: '這是一種真菌寄生於蝙蝠蛾幼蟲的複合體。真正產於青藏高原高海拔的野生蟲草極度稀缺，價格往往超越同重量的黃金。' },
    { name: '巨型蟻巢傘', rarity: 'legendary', probability: 2.5, points: 15, desc: '世界上最大的食用真菌（傘蓋可達1公尺寬），生長在非洲的白蟻丘上，極難尋獲且難以保存。' }
];

let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
let points = parseInt(localStorage.getItem('points')) || 0;
let collection = JSON.parse(localStorage.getItem('collection')) || {};
let selectedDate = null;
let currentWeekStart = new Date();
let deleteCallback = null;

document.addEventListener('DOMContentLoaded', () => {
    initCalendarControls();
    generateCalendar();
    updatePointsDisplay();
    updateCollectionDisplay();

    document.getElementById('add-task-form').addEventListener('submit', addTask);
    document.getElementById('lottery-btn').addEventListener('click', lottery);
    document.getElementById('view-pool-btn').addEventListener('click', viewPool);
    document.getElementById('close-detail').addEventListener('click', () => {
        document.getElementById('mushroom-detail').style.display = 'none';
    });
    document.getElementById('confirm-yes').addEventListener('click', () => {
        if (deleteCallback) deleteCallback();
        hideConfirmDialog();
    });
    document.getElementById('confirm-no').addEventListener('click', hideConfirmDialog);
});

function initCalendarControls() {
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
    const currentYear = currentWeekStart.getFullYear();
    const currentMonth = currentWeekStart.getMonth();

    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        if (y === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }

    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        if (index === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    });

    yearSelect.addEventListener('change', () => {
        currentWeekStart.setFullYear(parseInt(yearSelect.value));
        generateCalendar();
    });
    monthSelect.addEventListener('change', () => {
        currentWeekStart.setMonth(parseInt(monthSelect.value));
        generateCalendar();
    });

    document.getElementById('prev-week').addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateControls();
        generateCalendar();
    });
    document.getElementById('next-week').addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateControls();
        generateCalendar();
    });
}

function updateControls() {
    document.getElementById('year-select').value = currentWeekStart.getFullYear();
    document.getElementById('month-select').value = currentWeekStart.getMonth();
}

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const days = ['日', '一', '二', '三', '四', '五', '六'];
    days.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day day-header';
        header.textContent = day;
        calendar.appendChild(header);
    });

    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);

        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = date.getDate();

        if (date.toDateString() === new Date().toDateString()) {
            dayDiv.classList.add('today');
        }

        const dateKey = date.toISOString().split('T')[0];
        if (tasks[dateKey] && tasks[dateKey].length > 0) {
            renderTaskBars(dayDiv, dateKey);
        }

        dayDiv.addEventListener('click', () => selectDate(dateKey, dayDiv));
        calendar.appendChild(dayDiv);
    }
}

function renderTaskBars(dayDiv, dateKey) {
    const taskList = tasks[dateKey];
    const totalPages = taskList.reduce((sum, task) => sum + calculatePages(task.pages), 0);
    const subjectPages = {};

    taskList.forEach(task => {
        const pages = calculatePages(task.pages);
        if (!subjectPages[task.subject]) subjectPages[task.subject] = 0;
        subjectPages[task.subject] += pages;
    });

    for (const [subject, pages] of Object.entries(subjectPages)) {
        const percentage = (pages / totalPages) * 100;
        const bar = document.createElement('div');
        bar.className = 'task-bar';
        bar.style.backgroundColor = subjectColors[subject] || '#cccccc';
        bar.style.width = `${percentage}%`;
        dayDiv.appendChild(bar);
    }
}

function calculatePages(pagesStr) {
    if (pagesStr.includes('~')) {
        const [start, end] = pagesStr.split('~').map(Number);
        return end - start + 1;
    }
    return 1;
}

function selectDate(dateKey, dayDiv) {
    selectedDate = dateKey;
    document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
    dayDiv.classList.add('selected');

    document.getElementById('selected-date').textContent = dateKey;
    document.getElementById('task-form').style.display = 'block';
    displayTasks(dateKey);
}

function addTask(e) {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const pages = document.getElementById('pages').value;

    if (!tasks[selectedDate]) {
        tasks[selectedDate] = [];
    }

    tasks[selectedDate].push({ subject, pages, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('add-task-form').reset();
    displayTasks(selectedDate);
    generateCalendar();
}

function displayTasks(dateKey) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    if (!tasks[dateKey]) return;

    tasks[dateKey].forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        if (task.completed) taskDiv.classList.add('completed');

        taskDiv.innerHTML = `
            <span>${task.subject}: ${task.pages}</span>
            <button onclick="completeTask('${dateKey}', ${index})" ${task.completed ? 'disabled' : ''}>完成</button>
            <button onclick="deleteTask('${dateKey}', ${index})">刪除</button>
        `;
        taskList.appendChild(taskDiv);
    });
}

function completeTask(dateKey, index) {
    const task = tasks[dateKey][index];
    const pages = calculatePages(task.pages);
    points += pages; // 根據頁數獲得點數
    task.completed = true;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('points', points);
    updatePointsDisplay();
    displayTasks(dateKey);
    generateCalendar();
}

function deleteTask(dateKey, index) {
    document.getElementById('confirm-message').textContent = '確定要刪除這個作業嗎？';
    deleteCallback = () => {
        tasks[dateKey].splice(index, 1);
        if (tasks[dateKey].length === 0) {
            delete tasks[dateKey];
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks(dateKey);
        generateCalendar();
    };
    showConfirmDialog();
}

function showConfirmDialog() {
    document.getElementById('confirm-dialog').style.display = 'block';
}

function hideConfirmDialog() {
    document.getElementById('confirm-dialog').style.display = 'none';
    deleteCallback = null;
}

function updatePointsDisplay() {
    document.getElementById('points').textContent = points;
}

function lottery() {
    if (points < 1) {
        alert('隨機孢子不足！');
        return;
    }

    points -= 1;
    localStorage.setItem('points', points);
    updatePointsDisplay();

    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedMushroom = null;

    for (const mushroom of mushrooms) {
        cumulative += mushroom.probability;
        if (random <= cumulative) {
            selectedMushroom = mushroom;
            break;
        }
    }

    if (collection[selectedMushroom.name]) {
        // 重複，換點數
        points += selectedMushroom.points;
        localStorage.setItem('points', points);
        updatePointsDisplay();
        document.getElementById('lottery-result').textContent = `種植到重複的${selectedMushroom.name}，獲得${selectedMushroom.points}隨機孢子！`;
    } else {
        collection[selectedMushroom.name] = 1;
        localStorage.setItem('collection', JSON.stringify(collection));
        updateCollectionDisplay();
        document.getElementById('lottery-result').textContent = `恭喜種植到${selectedMushroom.name}！`;
    }
}

function viewPool() {
    const poolDisplay = document.getElementById('pool-display');
    poolDisplay.innerHTML = '<h3>獎池項目</h3>';
    mushrooms.forEach(mushroom => {
        const item = document.createElement('div');
        item.textContent = `${mushroom.name} (${mushroom.rarity}): 機率 ${mushroom.probability}%, 兌換 ${mushroom.points} 隨機孢子`;
        poolDisplay.appendChild(item);
    });
    poolDisplay.style.display = poolDisplay.style.display === 'none' ? 'block' : 'none';
}

function updateCollectionDisplay() {
    const mushroomList = document.getElementById('mushroom-list');
    mushroomList.innerHTML = '';

    for (const [name, count] of Object.entries(collection)) {
        const mushroomDiv = document.createElement('div');
        mushroomDiv.className = 'mushroom';
        mushroomDiv.textContent = count > 1 ? `${name} x${count}` : name;
        mushroomDiv.addEventListener('click', () => showMushroomDetail(name));
        mushroomList.appendChild(mushroomDiv);
    }
}

function showMushroomDetail(name) {
    const mushroom = mushrooms.find(m => m.name === name);
    if (mushroom) {
        document.getElementById('detail-name').textContent = mushroom.name;
        document.getElementById('detail-desc').textContent = mushroom.desc;
        document.getElementById('mushroom-detail').style.display = 'block';
    }
}