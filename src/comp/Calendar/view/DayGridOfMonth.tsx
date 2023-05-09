import {useEffect} from 'react';
import { DateData, DateEventMap } from "../model/Calendar";

interface DayGridOfMonthProps {
    dateList : DateData[]
    eventMap : DateEventMap
}

export function DayGridOfMonth({
    dateList,
    eventMap
} : DayGridOfMonthProps){

    useEffect(()=>{
    },[eventMap]);
    
    return (
        <div>
            {
                dateList.map(dateData=>{
                    return (
                        <div key={dateData.text}>
                            <span>{dateData.text}</span>
                            {
                                eventMap[dateData.date!] ? 
                                eventMap[dateData.date!].map(event=>{
                                    return (
                                        <p key={event.id}>{event.time + " - " + event.title}</p>
                                    )
                                })
                                :
                                ''
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}