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
      backgroundColor: blockColor,
    }} className="tooltip day-block">
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
    <section className='habit-section'>
      <h3>{habitData.habitName}</h3>
      <button className='btn' data-habitid={habitData.habitId} onClick={markTodayHandler}>Done</button>
      <table className='habit-table'>
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
      <form className='form' onSubmit={newHabitHandler}>
        <label className='form-label' htmlFor='new-habit-input'>New Habit</label>
        <input className='form-input' id='new-habit-input' type={'text'} onChange={newHabitChangeHandler} value={newHabitInput} />
        <button className='btn' type='submit'>Add</button>
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
      <h1>Habit Tracker</h1>
      <h2>Today: {today.toLocaleDateString()}</h2>
      <NewHabitForm updateAppDataHandler={updateAppDataHandler} appData={appData} />
      {appData.map(habit => <HabitSection key={habit.habitId} habitData={habit} habitName={habit.habitName} today={today} markTodayHandler={markTodayHandler} />)}
      <footer>
        <h2>About this project</h2>
        <p>This project was developed by Juan P Echeverry, you can check my <a href='https://juanpecheverry.com' target={'_blank'}>Portfolio here</a>.
        <br/>
        This is an open source project, you can check out the repository on <a href='https://github.com/jpecheverryp/habit-tracker' target={'_blank'}>GitHub</a></p>
      </footer>
    </main>
  )
}

export default App
