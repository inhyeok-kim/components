import {useEffect,useState} from 'react';
import {createCalendarData} from './model/Calendar';

interface CalendarOption {

}
export default function Calendar({

}:CalendarOption){
    const [calendarData, setCalendarData] = useState(createCalendarData({type:'month'}));

    useEffect(()=>{
        calendarData.addSchedule({
            id : 'id2',
            date : '2023-05-06',
            time : '11:00',
            title : '테스트2'
        });
    },[]);

    return (
        <div>

        </div>
    )
}

