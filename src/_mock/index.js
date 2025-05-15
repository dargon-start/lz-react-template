import { setupWorker } from 'msw/browser'
import { http, delay } from 'msw'
import orgMockApi from './handlers/_org'

const wait = http.all('*', async () => {
  await delay(1000)
})

const handlers = [wait, ...orgMockApi]
const worker = setupWorker(...handlers)

export default worker
