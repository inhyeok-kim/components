import {useImperativeHandle, forwardRef, useEffect,useState} from 'react';
import {CalendarData, CalendarOption,  DateEventMap, Event, createCalendarData} from './model/Calendar';
import { DayGridOfMonth } from './view/DayGridOfMonth';

export interface CalendarApi {
    addEvent : Function
    getEvent : Function
    getCalendarData : Function
}
const Calendar = forwardRef(function({
    type = 'month',
    selectDate,
    selectMonth,
    selectYear,
    events
}:CalendarOption,ref){
    const [calendarData, setCalendarData] = useState({} as CalendarData);
    const [eventMap, setEventMap] = useState({} as DateEventMap);

    useEffect(()=>{
        setCalendarData(createCalendarData({
            type : type,
            selectDate : selectDate,
            selectMonth : selectMonth,
            selectYear : selectYear,
            events
        }));
    },[type,selectDate,selectMonth,selectYear]);

    function addEvent(event : Event){
        calendarData.addEvent(event);
        setEventMap(calendarData.getDateEventMap());
        return true;
    }
    function getEvent(data:string){
        return calendarData.getEvent(data);
    }
    function getCalendarData(){
        return calendarData;
    }

    useImperativeHandle(ref, () => ({
        addEvent,
        getEvent,
        getCalendarData
    }),[calendarData]);

    useEffect(()=>{
        if(Object.keys(calendarData).length > 0){
            setEventMap(calendarData.getDateEventMap());
        }
    },[calendarData]);

    useEffect(()=>{
        console.log(eventMap);
    },[eventMap]);

    useEffect(()=>{
        if(Object.keys(calendarData).length > 0){
            calendarData.setEvent(events);
            setEventMap(calendarData.getDateEventMap());
        }
    },[events]);

    return (
        <div>
            {
                calendarData.type === 'month' ? 
                <DayGridOfMonth 
                    dateList={calendarData.dateList}
                    eventMap={eventMap}
                />
                :
                ''
            }
        </div>
    )
});

export default Calendar;