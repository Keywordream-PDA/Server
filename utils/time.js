const getTimeAgo = (newsDate) => {
    const currentDate = new Date();
    const newsDateTime = new Date(newsDate);

    const timeDiff = currentDate - newsDateTime;

    const seconds = Math.floor(timeDiff/1000);
    const minutes = Math.floor(seconds/60);
    const hours = Math.floor(minutes/60);
    const days = Math.floor(hours/24);

    if(days > 0 ){
        return days + '일 전';
    } else if(hours > 0){
        return hours + '시간 전';
    } else {
        return minutes + '분 전';
    } 
}

const getTimeDetail = (newsDate) => {
    const date = new Date(newsDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

const getTodayDay = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = today.getDate();
    day = day < 10 ? '0' + day : day;
    return `${year}${month}${day}`
}

const isOpenMarketTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // 시작 시간과 종료 시간 설정
    const startHour = 8;
    const startMinute = 55;
    const endHour = 15;
    const endMinute = 35;

    // 현재 시간이 시작 시간보다 늦거나 같고 종료 시간보다 이른 경우에는 범위 내에 있다고 판단
    if ((hour > startHour || (hour === startHour && minute >= startMinute)) &&
        (hour < endHour || (hour === endHour && minute <= endMinute))) {
        return true
    } else {
        return false
    }
}

module.exports = {
    getTimeAgo : getTimeAgo,
    getTimeDetail : getTimeDetail,
    getTodayDay : getTodayDay,
    isOpenMarketTime : isOpenMarketTime
}