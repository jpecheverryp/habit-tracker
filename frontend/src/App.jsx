import { useEffect, useState } from 'react'
import './App.css'

function getUUID() {
  return crypto.randomUUID()
}

function dateFromDay(dayNum, year) {
  const date = new Date();

  if (year) {
    date.setFullYear(year);
  }
  date.setMonth(0);
  date.setDate(0);
  const timeOfFirst = date.getTime();
  const dayMilli = 1000 * 60 * 60 * 24
  const dayNumMilli = (dayNum + 1)* dayMilli;
  date.setTime(timeOfFirst + dayNumMilli);
  return date;
}

function Block({x, y, calendarData}) {
  const DAYSWEEK = 7
  const dayOfYear = ( x * DAYSWEEK ) + y
  const blockDate = dateFromDay(dayOfYear).toDateString()

  const wasDone = calendarData[dayOfYear]
  const blockColor = wasDone ? 'blueviolet' : 'lightgray'
  return (
    <td style={{
      width: '11px',
      height: '11px',
      backgroundColor: blockColor,
    }} className="tooltip">
    <span className='tooltiptext'>{blockDate}</span>
    </td>)
}

function RowOfBlocks({y, calendarData}) {
  const myArr = new Array(52).fill(0)
  return (
    <tr>{myArr.map((_, i) => <Block calendarData={calendarData} key={i} x={i} y={y} />)}</tr>
  )
}

function TableBody({calendarData }) {
  const myArr = new Array(7).fill(0)
  return (
    <tbody>
      {myArr.map((_, i) => <RowOfBlocks calendarData={calendarData} key={i} y={i} />)}
    </tbody>
  )
}

function HabitSection({ habitData, markTodayHandler }) {

  return (
    <section style={{display: 'block', margin: '0 auto', width:'fit-content'}}>
      <h3 style={{display: 'inline', marginRight: '1rem'}}>{habitData.habitName}</h3>
      <button data-habitid={habitData.habitId} onClick={markTodayHandler}>Mark as Done</button>
      <table>
        <thead>
        </thead>
        <TableBody calendarData={habitData.habitCalendar} />
      </table>
    </section>
  )
}

function NewHabitForm({updateAppDataHandler, appData}) {

  const [newHabitInput, setNewHabitInput] = useState('')

  function newHabitHandler(e) {
    e.preventDefault()
    const newHabit = {
      habitId: getUUID(),
      habitName: newHabitInput,
      habitCalendar: new Array(365).fill(0)
    }
    const appDataCopy = [...appData]
    appDataCopy.push(newHabit)
    updateAppDataHandler(appDataCopy)
    localStorage.setItem('app-data', JSON.stringify(appDataCopy))
    setNewHabitInput('')
  }

  const newHabitChangeHandler = e => {
    setNewHabitInput(e.target.value)
  }


  return (
      <form onSubmit={newHabitHandler}>
        <label htmlFor='new-habit-input'>New Habit</label>
        <input id='new-habit-input' type={'text'} onChange={newHabitChangeHandler} value={newHabitInput} />
        <button type='submit'>Create New Habit</button>
      </form>
  )
}

function App() {
  const today = new Date()
  const [appData, setAppData] = useState([]) 
  

  

  useEffect(() => {
    if(localStorage.getItem('app-data') === null) {
      setAppData([])
    } else {
      setAppData(JSON.parse(localStorage.getItem('app-data'))) 
    }
  }, [])

  function markTodayHandler(e) {
    const dayOfYear = Math.ceil((today - new Date(today.getFullYear(),0,1)) / 86400000 )
    const currentHabitId = e.target.dataset.habitid
    const appDataCopy = [...appData];
    const habitCopy = appDataCopy.find(h => h.habitId === currentHabitId)
    habitCopy.habitCalendar[dayOfYear - 1] = 1;
    setAppData(appDataCopy)
    localStorage.setItem('app-data', JSON.stringify(appDataCopy))
  }

  function updateAppDataHandler(newValue) {
    setAppData(newValue)
  }

  return (
    <main>
      <h1 style={{marginTop: '6rem'}}>Habit Tracker</h1>
      <h2>Today: {today.toLocaleDateString()}</h2>
      <NewHabitForm updateAppDataHandler={updateAppDataHandler} appData={appData} />
      <hr />
      {appData.map(habit => <HabitSection key={habit.habitId} habitData={habit} habitName={habit.habitName} today={today} markTodayHandler={markTodayHandler} />)}
    </main>
  )
}

export default App
