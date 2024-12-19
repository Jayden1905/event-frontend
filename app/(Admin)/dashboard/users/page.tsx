import useAuthServer from '@/hooks/useAuthServer'
import { api_endpoint } from '@/lib/utils'
import { User } from '@/types/user'
import React from 'react'
import { UserTable } from './(components)/table/UserTable'

export default async function DashboardUserPage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { token } = await useAuthServer()

  const users: User[] = await fetch(`${api_endpoint}/api/v1/users`, {
    headers: {
      Authorization: `${token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
  })

  return (
    <div>
      <UserTable data={users} />
    </div>
  )
}
