import { Button } from 'antd'
import Counter from './components/counter'
import TodoList from './components/todolist'

export default function Test() {
  return (
    <div>
      <h1>test</h1>
      <Counter initialValue={10} step={2}></Counter>
      <TodoList></TodoList>
    </div>
  )
}
