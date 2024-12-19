import useAuthServer from '@/hooks/useAuthServer'
import React from 'react'

export default async function DashbaordPage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated, user } = await useAuthServer()
  const fullName: string = user?.first_name + ' ' + user?.last_name

  if (!isAuthenticated) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <h1>Welcome {fullName}</h1>
    </div>
  )
}
