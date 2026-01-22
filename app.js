// 天干地支配置
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHI_CHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHI_CHEN_TIME = [
    '23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00',
    '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00',
    '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'
];

// 截路空亡口诀
const JIE_LU_KONG_WANG = {
    '甲': ['申', '酉'],
    '己': ['申', '酉'],
    '乙': ['午', '未'],
    '庚': ['午', '未'],
    '丙': ['辰', '巳'],
    '辛': ['辰', '巳'],
    '丁': ['寅', '卯'],
    '壬': ['寅', '卯'],
    '戊': ['子', '丑'],
    '癸': ['子', '丑']
};

// 十二建星
const JIAN_XING = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];

// 十二建星方位映射
const JIAN_XING_FANG_WEI = {
    '建': { bagua: '兑', direction: '正西' },
    '除': { bagua: '兑', direction: '正西' },
    '破': { bagua: '乾', direction: '西北' },
    '成': { bagua: '乾', direction: '西北' },
    '开': { bagua: '离', direction: '正南' },
    '闭': { bagua: '离', direction: '正南' },
    '危': { bagua: '坎', direction: '正北' },
    '定': { bagua: '坤', direction: '西南' },
    '执': { bagua: '巽', direction: '东南' },
    '满': { bagua: '艮', direction: '东北' },
    '平': { bagua: '震', direction: '正东' },
    '收': { bagua: '震', direction: '正东' }
};

// 时辰定位口诀
const SHI_CHEN_DING_WEI = {
    '子': '去有木质家具、绿植的地方，比如书架旁、阳台花盆边',
    '丑': '去有木质家具、绿植的地方，比如书架旁、阳台花盆边',
    '寅': '找高处或有坡度的地方，比如衣柜顶层、楼梯转角',
    '卯': '找高处或有坡度的地方，比如衣柜顶层、楼梯转角',
    '辰': '先问家人朋友，说不定是他们帮忙收起来了',
    '巳': '先问家人朋友，说不定是他们帮忙收起来了',
    '午': '在桌子、柜子、抽屉等平面处找',
    '未': '在桌子、柜子、抽屉等平面处找',
    '申': '顺着当天走过的路往回找，可能掉在路边或被人捡到',
    '酉': '顺着当天走过的路往回找，可能掉在路边或被人捡到',
    '戌': '找悬空的"半腰"位置，比如裤脚卷边、书包侧袋',
    '亥': '找悬空的"半腰"位置，比如裤脚卷边、书包侧袋'
};

// 计算天干地支
function getGanZhi(date) {
    // 1900年1月31日为甲子日，以此为基准计算
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(date);
    const daysDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    
    // 计算天干
    const ganIndex = (daysDiff % 10 + 10) % 10;
    const gan = TIAN_GAN[ganIndex];
    
    // 计算地支
    const zhiIndex = (daysDiff % 12 + 12) % 12;
    const zhi = DI_ZHI[zhiIndex];
    
    return { gan, zhi, ganIndex, zhiIndex };
}

// 计算十二建星
function getJianXing(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 简化算法：根据农历月份和日期计算建星
    // 这里使用一个简化的算法，实际应该根据农历计算
    // 使用公历日期的一个近似算法
    const lunarMonth = month; // 简化处理，实际需要转换为农历
    const lunarDay = day;
    
    // 建星的计算规则（简化版）
    // 实际应该根据农历月份和节气计算，这里用公历近似
    const baseIndex = ((lunarMonth - 1) * 30 + lunarDay - 1) % 12;
    const jianXingIndex = (baseIndex + (year % 12)) % 12;
    
    return JIAN_XING[jianXingIndex];
}

// 更准确的十二建星计算（基于农历）
function getJianXingAccurate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    try {
        // 使用solarlunar库转换为农历
        let lunarData;
        if (typeof solar2lunar !== 'undefined') {
            // solarlunar库 - 返回格式: {lYear, lMonth, lDay, ...}
            lunarData = solar2lunar(year, month, day);
        } else if (typeof solarlunar !== 'undefined' && solarlunar.solar2lunar) {
            // solarlunar库的另一种调用方式
            lunarData = solarlunar.solar2lunar(year, month, day);
        } else {
            // 如果库未加载，使用简化算法
            return getJianXingSimple(date);
        }
        
        if (!lunarData || !lunarData.lMonth || !lunarData.lDay) {
            return getJianXingSimple(date);
        }
        
        const lunarMonth = lunarData.lMonth;
        const lunarDay = lunarData.lDay;
        
        // 十二建星的计算规则：
        // 1. 每月对应特定的地支：正月建寅、二月建卯、三月建辰...
        // 2. 从立春后第一个对应地支的日期起"建"
        // 3. 按"建除满平定执破危成收开闭"顺序循环
        
        // 月建地支对应表（农历月份 -> 地支索引）
        const monthZhiMap = {
            1: 2,   // 正月建寅 (索引2)
            2: 3,   // 二月建卯 (索引3)
            3: 4,   // 三月建辰 (索引4)
            4: 5,   // 四月建巳 (索引5)
            5: 6,   // 五月建午 (索引6)
            6: 7,   // 六月建未 (索引7)
            7: 8,   // 七月建申 (索引8)
            8: 9,   // 八月建酉 (索引9)
            9: 10,  // 九月建戌 (索引10)
            10: 11, // 十月建亥 (索引11)
            11: 0,  // 十一月建子 (索引0)
            12: 1   // 十二月建丑 (索引1)
        };
        
        // 获取当前月份对应的地支索引
        const monthZhiIndex = monthZhiMap[lunarMonth] || 0;
        
        // 计算从月初到当前日期的天数
        // 简化处理：假设每月从建日开始，按顺序循环
        // 实际应该找到立春后第一个对应地支的日期，这里用农历日期作为近似
        const dayInCycle = (lunarDay - 1) % 12;
        
        // 根据月份地支和日期计算建星
        // 建星从建日开始，按顺序循环
        return JIAN_XING[dayInCycle];
        
    } catch (e) {
        console.warn('农历转换失败，使用简化算法:', e);
        return getJianXingSimple(date);
    }
}

// 简化版十二建星计算（备用方案）
function getJianXingSimple(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 计算从年初到当前日期的天数
    const startOfYear = new Date(year, 0, 1);
    const daysFromYearStart = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    
    // 建星循环，每12天一个周期
    const cycle = (daysFromYearStart - 1) % 12;
    
    return JIAN_XING[cycle];
}

// 第一步：截路空亡判断
function checkJieLuKongWang(gan, shiChenZhi) {
    const kongWangZhi = JIE_LU_KONG_WANG[gan];
    if (!kongWangZhi) {
        return { canFind: true, message: '未匹配到天干，建议尝试寻找' };
    }
    
    const isKongWang = kongWangZhi.includes(shiChenZhi);
    
    if (isKongWang) {
        return {
            canFind: false,
            message: `❌ 落空！根据口诀"${getKongWangKouJue(gan)}"，${gan}日${shiChenZhi}时落空，找回来的概率很低。`,
            status: 'danger'
        };
    } else {
        return {
            canFind: true,
            message: `✅ 未落空！根据口诀"${getKongWangKouJue(gan)}"，${gan}日${shiChenZhi}时未落空，可以尝试寻找。`,
            status: 'success'
        };
    }
}

function getKongWangKouJue(gan) {
    const kouJueMap = {
        '甲': '甲己申酉最为愁',
        '己': '甲己申酉最为愁',
        '乙': '乙庚午未不须求',
        '庚': '乙庚午未不须求',
        '丙': '丙辛之日空辰巳',
        '辛': '丙辛之日空辰巳',
        '丁': '丁壬寅卯一场空',
        '壬': '丁壬寅卯一场空',
        '戊': '戊癸子丑何劳问',
        '癸': '戊癸子丑何劳问'
    };
    return kouJueMap[gan] || '';
}

// 第二步：十二建星判断距离
function checkDistance(jianXing) {
    const distanceMap = {
        '满': { distance: '自归家', message: '🎉 满日：不用找，东西会自己出现！', status: 'success' },
        '成': { distance: '自归家', message: '🎉 成日：不用找，东西会自己出现！', status: 'success' },
        '定': { distance: '自归家', message: '🎉 定日：不用找，东西会自己出现！', status: 'success' },
        '执': { distance: '自归家', message: '🎉 执日：不用找，东西会自己出现！', status: 'success' },
        '危': { distance: '在近处', message: '📍 危日：在近处，比如家中、办公室周围', status: 'info' },
        '收': { distance: '在近处', message: '📍 收日：在近处，比如家中、办公室周围', status: 'info' },
        '开': { distance: '在远处', message: '🚶 开日：在远处，可能要去常去的街道、车站找', status: 'warning' },
        '除': { distance: '在远处', message: '🚶 除日：在远处，可能要去常去的街道、车站找', status: 'warning' },
        '建': { distance: '莫寻他', message: '⚠️ 建日：找回来的概率极低', status: 'danger' },
        '平': { distance: '莫寻他', message: '⚠️ 平日：找回来的概率极低', status: 'danger' },
        '破': { distance: '莫寻他', message: '⚠️ 破日：找回来的概率极低', status: 'danger' },
        '闭': { distance: '莫寻他', message: '⚠️ 闭日：找回来的概率极低', status: 'danger' }
    };
    
    return distanceMap[jianXing] || { distance: '未知', message: '无法判断距离', status: 'warning' };
}

// 第三步：方位判断
function getDirection(jianXing) {
    const fangWei = JIAN_XING_FANG_WEI[jianXing];
    if (!fangWei) {
        return { bagua: '未知', direction: '未知', message: '无法判断方位' };
    }
    
    return {
        bagua: fangWei.bagua,
        direction: fangWei.direction,
        message: `🧭 ${jianXing}日对应${fangWei.bagua}卦，方位：${fangWei.direction}`
    };
}

// 第四步：时辰定位
function getLocation(shiChenZhi) {
    const location = SHI_CHEN_DING_WEI[shiChenZhi];
    if (!location) {
        return '无法判断具体位置';
    }
    
    return `🔍 ${shiChenZhi}时：${location}`;
}

// 主函数：处理用户输入
function handleSearch() {
    const dateInput = document.getElementById('date').value;
    const timeSelect = document.getElementById('time').value;
    
    if (!dateInput || timeSelect === '') {
        alert('请填写完整的日期和时辰信息！');
        return;
    }
    
    const date = new Date(dateInput);
    const shiChenIndex = parseInt(timeSelect);
    const shiChenZhi = SHI_CHEN[shiChenIndex];
    
    // 计算天干地支
    const { gan, zhi } = getGanZhi(date);
    
    // 计算十二建星
    const jianXing = getJianXingAccurate(date);
    
    // 第一步：截路空亡判断
    const step1 = checkJieLuKongWang(gan, shiChenZhi);
    
    // 第二步：距离判断
    const step2 = checkDistance(jianXing);
    
    // 第三步：方位判断
    const step3 = getDirection(jianXing);
    
    // 第四步：具体位置
    const step4 = getLocation(shiChenZhi);
    
    // 显示结果
    displayResults(step1, step2, step3, step4, gan, zhi, jianXing, shiChenZhi, date);
}

// 获取农历信息（用于显示）
function getLunarInfo(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    try {
        let lunarData;
        if (typeof solar2lunar !== 'undefined') {
            lunarData = solar2lunar(year, month, day);
            if (lunarData && lunarData.lMonth && lunarData.lDay) {
                return `农历${lunarData.lMonth}月${lunarData.lDay}日`;
            }
        } else if (typeof LunarCalendar !== 'undefined') {
            lunarData = LunarCalendar.solarToLunar(year, month, day);
            if (lunarData && lunarData.lMonth && lunarData.lDay) {
                return `农历${lunarData.lMonth}月${lunarData.lDay}日`;
            }
        }
    } catch (e) {
        // 忽略错误
    }
    return '';
}

// 显示结果
function displayResults(step1, step2, step3, step4, gan, zhi, jianXing, shiChenZhi, date) {
    const resultSection = document.getElementById('result');
    resultSection.style.display = 'block';
    
    const lunarInfo = getLunarInfo(date);
    const dateInfo = lunarInfo ? `${gan}${zhi}日（${lunarInfo}）` : `${gan}${zhi}日`;
    
    // 第一步结果
    const step1El = document.getElementById('step1');
    step1El.innerHTML = `
        <p>日期：${dateInfo}，时辰：${shiChenZhi}时</p>
        <p>${step1.message} <span class="status ${step1.status}">${step1.canFind ? '可寻找' : '难找回'}</span></p>
    `;
    
    // 第二步结果
    const step2El = document.getElementById('step2');
    step2El.innerHTML = `
        <p>当日建星：<strong>${jianXing}日</strong></p>
        <p>${step2.message} <span class="status ${step2.status}">${step2.distance}</span></p>
    `;
    
    // 第三步结果
    const step3El = document.getElementById('step3');
    step3El.innerHTML = `
        <p>${step3.message}</p>
        <p>重点往<strong>${step3.direction}</strong>方向寻找</p>
    `;
    
    // 第四步结果
    const step4El = document.getElementById('step4');
    step4El.innerHTML = `<p>${step4}</p>`;
    
    // 滚动到结果区域
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 绑定事件
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', handleSearch);
    
    // 回车键触发
    document.getElementById('date').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });
    document.getElementById('time').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });
});
