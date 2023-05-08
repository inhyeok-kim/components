import { compareTime, formatDateString } from "./Utils";

type CalendarType = 'year' | 'month' | 'week';

interface CalendarOption {
    type? : CalendarType
    selectDate? : string
    selectYear? : string,
    selectMonth? : string
    range? : number[]
    schedules? : Schedule[]
}

interface CalendarData {
    type : CalendarType
    today : string
    selectDate? : string
    selectYear? : string,
    selectMonth? : string
    dateList : DateData[]
    schedules? : Schedule[]
    setSchedule : Function
    getSchedule : Function
    addSchedule : Function
    deleteSchedule : Function
}

interface DateData {
    text? : string
    date? : string
    dayOfMonth? : string
    dayOfWeek? :  number
    month? : string
    year? : string
}

interface Schedule {
    id : string
    date : string
    time : string
    title : string
}

interface DateScheduleMap {
    [key : string] : Schedule[];
}

export function createCalendarData(calOption : CalendarOption) : CalendarData {
    
    calOption.selectDate = calOption.selectDate ?? formatDateString(new Date());
    calOption.selectYear = calOption.selectYear ?? new Date().getFullYear().toString();
    calOption.selectMonth = calOption.selectMonth ?? (new Date().getMonth() +1).toString().padStart(2,'0');
    const calData : CalendarData = {
        type : calOption.type ?? 'month',
        today : formatDateString(new Date()),
        selectDate : calOption.selectDate,
        selectYear : calOption.selectYear,
        selectMonth : calOption.selectMonth,
        dateList : createDateList(calOption),
        setSchedule : function(schedules : Schedule[]){
            this.schedules = schedules;

            const dateScheduleMap : DateScheduleMap = {};
            this.dateList.forEach((date)=>{
                dateScheduleMap[date.date!] = schedules.filter((v)=>v.date===date.date).sort((a,b)=>compareTime(a.time,b.time));
            });
            this.getSchedule = function(date:string){
                return dateScheduleMap[date];
            }
            this.addSchedule = function(schedule : Schedule){
                try {
                    this.schedules?.push(schedule);
                    if(dateScheduleMap[schedule.date]){
                        const newSchedule = [...dateScheduleMap[schedule.date],schedule];
                        dateScheduleMap[schedule.date] = newSchedule.sort((a,b)=>compareTime(a.time,b.time));
                    } else {
                        dateScheduleMap[schedule.date] = [schedule];
                    }
                    return true;
                } catch (error) {
                    return false;
                }
            }
            this.deleteSchedule = function(id : string){
                try {
                    const target = this.schedules?.find(v=>v.id ===id);
                    const targetIdx = this.schedules?.findIndex(v=>v.id ===id);
                    if(target){
                        const idx = dateScheduleMap[target.date].findIndex(v=>v.id ===target.id);
                        dateScheduleMap[target.date].splice(idx,1);
                        this.schedules?.splice(targetIdx!,1);
                    } 
                    return true;
                } catch (error) {
                    return false;                    
                }
            }
        },
        getSchedule : function(){},
        addSchedule : function(){},
        deleteSchedule : function(){}
    };
    calData.setSchedule(calOption.schedules ?? []);

    return calData;
}

function createDateList(calOption:CalendarOption) : DateData[]{
    let dateList : DateData[] = [];
    switch (calOption.type){
        case 'year' :
            dateList = createYearDateList(calOption);
            break
        case 'month' :
            dateList = createMonthDateList(calOption);
            break
        case 'week' :
            dateList = createWeekDateList(calOption);
            break
    }
    return dateList;
}

function createYearDateList(calOption:CalendarOption){
    const dateList : DateData[] = [];

    for(let i=1;i<=12;i++){
        const data : DateData = {};
        const year = calOption.selectYear; 
        const month = i.toString().padStart(2,'0');
        data.year = year;
        data.date = year+'-'+month+"-"+"01";
        data.month = month;
        data.text = year;
        dateList.push(data);
    }

    return dateList;
}

function createMonthDateList(calOption:CalendarOption){
    const dateList : DateData[] = [];

    const range = calOption.range ?? [1,1];

    const selectDate = new Date(calOption.selectYear+"-"+calOption.selectMonth+"-"+'01');
    const startDate = new Date(selectDate.getTime());
    startDate.setMonth(selectDate.getMonth()-range[0]);
    
    const endDate = new Date(selectDate.getTime());
    endDate.setMonth(selectDate.getMonth()+range[1]+1);
    endDate.setDate(0);
    
    for(let date = startDate; date.getTime() <= endDate.getTime(); date.setDate(date.getDate()+1)){
        const dateText = formatDateString(date);
        const dateData : DateData = {
            text : dateText,
            date : dateText,
            dayOfMonth : date.getDate().toString().padStart(2,'0'),
            dayOfWeek :  date.getDay(),
            month : (date.getMonth()+1).toString().padStart(2,'0'),
            year : date.getFullYear().toString()
        };
        dateList.push(dateData);
    }
    
    return dateList;
}

function createWeekDateList(calOption:CalendarOption){
    const dateList : DateData[] = [];

    const range = calOption.range ?? [1,1];

    const selectDate = new Date(calOption.selectDate!);
    const startDate = new Date(selectDate.getTime());
    startDate.setDate(selectDate.getDate()-selectDate.getDay() - (range[0] * 7));
    
    const endDate = new Date(selectDate.getTime());
    endDate.setDate(selectDate.getDate()+(6-selectDate.getDay()) + (range[0] * 7));
    
    for(let date = startDate; date.getTime() <= endDate.getTime(); date.setDate(date.getDate()+1)){
        const dateText = formatDateString(date);
        const dateData : DateData = {
            text : dateText,
            date : dateText,
            dayOfMonth : date.getDate().toString().padStart(2,'0'),
            dayOfWeek :  date.getDay(),
            month : (date.getMonth()+1).toString().padStart(2,'0'),
            year : date.getFullYear().toString()
        };
        dateList.push(dateData);
    }

    return dateList;
}
