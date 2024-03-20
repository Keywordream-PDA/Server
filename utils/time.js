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
    } else if(minutes > 0){
        return minutes + '분 전';
    } else {
        return seconds + '초 전';
    }
}

module.exports = getTimeAgo