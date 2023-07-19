import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { type Information } from './type'

function App() {
  const [count, setCount] = useState<Information[]>([])

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const { data }: { data: Information[]} = await axios.get(`/api/information`);
        setCount(data);
      } catch (err) {
        console.error(err);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchCategories()
  }, [])
  

  return (
    <ul>
      {
        count.map(user => (
          <li key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.message}</p>
          </li>
        ))
      }
    </ul>
  )
}

export default App
