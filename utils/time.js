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

module.exports = {
    getTimeAgo : getTimeAgo,
    getTimeDetail : getTimeDetail
}