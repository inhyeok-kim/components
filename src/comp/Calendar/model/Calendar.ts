import { compareTime, formatDateString } from "./Utils";

export type CalendarType = 'year' | 'month' | 'week';

export interface CalendarOption {
    type? : CalendarType
    selectDate? : string
    selectYear? : string,
    selectMonth? : string
    range? : number[]
    events? : Event[]
}

export interface CalendarData {
    type : CalendarType
    today : string
    selectDate? : string
    selectYear? : string,
    selectMonth? : string
    dateList : DateData[]
    events? : Event[]
    setEvent : Function
    getEvent : Function
    addEvent : Function
    deleteEvent : Function
    getDateEventMap : Function
    getAllEvent : Function
}

export interface DateData {
    text? : string
    date? : string
    dayOfMonth? : string
    dayOfWeek? :  number
    month? : string
    year? : string
}

export interface Event {
    id : string
    date : string
    time : string
    title : string
}

export interface DateEventMap {
    [key : string] : Event[];
}

export function createCalendarData(calOption : CalendarOption) : CalendarData {
    
    calOption.selectDate = calOption.selectDate ?? formatDateString(new Date());
    calOption.selectYear ||= new Date().getFullYear().toString();
    calOption.selectMonth ||= (new Date().getMonth() +1).toString().padStart(2,'0');
    const calData : CalendarData = {
        type : calOption.type || 'month',
        today : formatDateString(new Date()),
        selectDate : calOption.selectDate,
        selectYear : calOption.selectYear,
        selectMonth : calOption.selectMonth,
        dateList : createDateList(calOption),
        setEvent : function(events : Event[]){
            this.events = [...events];

            const dateEventMap : DateEventMap = {};
            this.dateList.forEach((date)=>{
                dateEventMap[date.date!] = this.events!.filter((v)=>v.date===date.date).sort((a,b)=>compareTime(a.time,b.time));
            });

            this.getDateEventMap = function(){
                return dateEventMap;
            }
            this.getEvent = function(date:string){
                return dateEventMap[date];
            }
            this.addEvent = function(event : Event){
                try {
                    this.events?.push(event);
                    if(dateEventMap[event.date]){
                        const newEvent = [...dateEventMap[event.date],event];
                        dateEventMap[event.date] = newEvent.sort((a,b)=>compareTime(a.time,b.time));
                    } else {
                        dateEventMap[event.date] = [event];
                    }
                    return true;
                } catch (error) {
                    return false;
                }
            }
            this.deleteEvent = function(id : string){
                try {
                    const target = this.events?.find(v=>v.id ===id);
                    const targetIdx = this.events?.findIndex(v=>v.id ===id);
                    if(target){
                        const idx = dateEventMap[target.date].findIndex(v=>v.id ===target.id);
                        dateEventMap[target.date].splice(idx,1);
                        this.events?.splice(targetIdx!,1);
                    } 
                    return true;
                } catch (error) {
                    return false;                    
                }
            }
        },
        getAllEvent : function(){return this.events},
        getEvent : function(){},
        addEvent : function(){},
        deleteEvent : function(){},
        getDateEventMap : function(){}
    };
    calData.setEvent(calOption.events || []);

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
    const selectDate = new Date(calOption.selectYear+"-"+calOption.selectMonth+"-"+'01');
    const startDate = new Date(selectDate.getTime());
    startDate.setDate(-(selectDate.getDay()-1));
    
    const endDate = new Date(startDate.getTime());
    endDate.setDate(startDate.getDate() +41);
    
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

    const range = calOption.range || [1,1];

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
