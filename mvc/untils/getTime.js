module.exports = function (kind, choice) {
    console.log(kind, choice);
    let date = new Date();
    if (choice && choice!='周' && choice!='月' && choice!='年' && choice!='支出' && choice!='收入') {
        if (kind == '1') {
            date = new Date(`${date.getFullYear()}-${date.getMonth()+1}-${choice}`);
        }
        if (kind == '2') {
            date = new Date(`${date.getFullYear()}-${choice}-${date.getDate()}`);
        }
        if (kind == '3') {
            date = new Date(`${choice}-${date.getMonth()+1}-${date.getDate()}`);
        }
    }

    let years = date.getFullYear();

    let yeartimeStart = new Date(`${years}-1-1 0:0:0`).getTime();
    let yeartimeEnd = new Date(`${years}-12-31 23:59:59`).getTime();


    let month = date.getMonth() + 1;
    let day = date.getDate();
    let daytimeStart = new Date(`${years}-${month}-${day} 0:0:0`).getTime();
    let daytimeEnd = new Date(`${years}-${month}-${day} 23:59:59`).getTime();

    let y = date.getFullYear()
    let m = date.getMonth() + 1;
    let y1 = y;
    let m1 = m + 1;
    if (m1 == 13) {
        y1++;
        m1 = 1;
    }
    let monthtimeStart = new Date(`${y}-${m}-${1} 0:0:0`).getTime();
    let monthtimeEnd = new Date(`${y1}-${m1}-${1} 0:0:0`).getTime();

     
    let week = date.getDay();
    month = date.getDate();
    let millisecond = 1000 * 60 * 60 * 24;
    let minusDay = week != 0 ? week - 1 : 6;   
    let monday = new Date(date.getTime() - (minusDay * millisecond)); 
    let sunday = new Date(monday.getTime() + (6 * millisecond));

    let swy = monday.getFullYear();
    let swm = monday.getMonth()+1;
    if (swm==13) swm = 1;
    let swd = monday.getDate();

    let ewy = sunday.getFullYear();
    let ewm = sunday.getMonth()+1;
    if (ewm==13) ewm = 1;
    let ewd = sunday.getDate();

    let weektimeStart = new Date(`${swy}-${swm}-${swd} 0:0:0`).getTime(); //本周起始时间   
    let weektimeEnd = new Date(`${ewy}-${ewm}-${ewd} 23:59:59`).getTime(); //本周终止时间    


    return {
        daytimeStart: daytimeStart,
        daytimeEnd: daytimeEnd,
        weektimeStart: weektimeStart,
        weektimeEnd: weektimeEnd,
        monthtimeStart: monthtimeStart,
        monthtimeEnd: monthtimeEnd,
        yeartimeStart: yeartimeStart,
        yeartimeEnd: yeartimeEnd
    }



}