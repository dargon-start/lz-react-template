import { http, HttpResponse } from 'msw'

import { ORG_LIST } from '@/_mock/assets'

const orgList = http.get(`/api/org/list`, () => {
  return HttpResponse.json({
    code: 200,
    message: '',
    data: ORG_LIST
  })
})

export default [orgList]
