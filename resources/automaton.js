const twoCharLength = (num) => num<10 ? String("0"+num) : String(num);

/**
 * @returns sec, min, hour [ ]
 */
 const time = () => {
    const now = new Date;
    
    const sec = twoCharLength(now.getSeconds());
    const min = twoCharLength(now.getMinutes());
    const hour = twoCharLength(now.getHours());
    
    return [sec, min, hour];
}

export { time }