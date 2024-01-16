import React, { useState } from 'react'
import Loading from '../components/LoadingComponent/Loading'
import InputForm from '../components/InputForm/InputForm'
import { Calendar } from 'antd';
const Date = () => {
    const [petSearch, setPetSearch] = useState("")
    const [Time, setTime] = useState("")
    const [date, setDate] = useState("")
    const onPanelChange = (value, mode) => {
        setDate(value.format('YYYY-MM-DD', mode))
      };
    const handelSubmit = (e) => {
        e.preventDefault();
        console.log("43423", petSearch, Time, date);
    }
  return (
    <div className="container pt-2">
      <div className="bg-white p-6 my-4 rounded-2xl max-w-[700px] mx-auto border-2">
        <div className="bg-[#FF642F] w-[280px] flex items-center justify-center p-2 rounded-lg mb-4">
          <p className="text-lg font-bold text-white">Đặt lịch</p>
        </div>
        <Loading isLoading={false}>
          <form onSubmit={handelSubmit} className="flex flex-col items-center gap-2">
            <InputForm onChange={(e) => setPetSearch(e.target.value)} placeholder='Thú cưng'/>
            <InputForm onChange={(e) => setTime(e.target.value)} placeholder='Time'/>
            <Calendar onPanelChange={onPanelChange} />
            <button className='bg-yellow-300 h-10 text-white font-semibold w-full mt-5' type='submit'>Đặt lịch</button>
          </form>
        </Loading>
      </div>
    </div>
  )
}

export default Date