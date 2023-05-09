import {useRef, useEffect,useState} from 'react'
import Calendar, { CalendarApi } from "./comp/Calendar";
import { Event } from './comp/Calendar/model/Calendar';

function App() {

  const refer = useRef({} as CalendarApi);

  const inputRef : any = useRef();
  const [selectYear,setSelectYear] = useState();
  const [selectMonth,setSelectMonth] = useState();
  const [num, setNum] = useState(0);
  const [events, setEvents] = useState([{id:"ev1",date:"2023-05-15",title:'evtest2',time:"09:00"}]);

  function fnSelect(){
    console.log(refer.current.getCalendarData());
  }
  function fnSubmit(){
    const val = inputRef.current.value.split("-");
    setSelectYear(val[0]);
    setSelectMonth(val[1]);
  }

  function fnEvent(){
    const newEvents = [...events];
    newEvents.push({
      id : 'id'+num,
      date : '2023-05-09',
      title : 'testest',
      time : '11:00'
    });
    setEvents(newEvents);
    setNum(num+1);
  }

  useEffect(()=>{
    console.log(events);
  },[events]);

  return (
    <div className="App">
      <input type="month" ref={inputRef} />
      <button onClick={fnSubmit}>적용</button>
      <button onClick={fnSelect}>조회</button>
      <button onClick={fnEvent}>이벤트 추가</button>
      <Calendar ref={refer} 
        type='month' 
        selectYear={selectYear} 
        selectMonth={selectMonth}
        events={events}
      />
    </div>
  );
}

export default App;
