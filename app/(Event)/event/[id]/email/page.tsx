import useAuthServer from '@/hooks/useAuthServer'
import { api_endpoint } from '@/lib/utils'
import { EmailTemplateType } from '@/types/email'
import { EDMBuilder } from './(components)/edmBuilder'

async function GetEmailTemplate(token: string, eventID: string) {
  const response = await fetch(
    `${api_endpoint}/api/v1/email_templates/${eventID}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `${token}`,
      },
    }
  )

  if (!response.ok) {
    return undefined
  }

  const emailTemplate = (await response.json()) as Promise<EmailTemplateType>

  return emailTemplate
}

export default async function EmailPage({
  params,
}: {
  params: { id: string }
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { token } = await useAuthServer()

  const data = await GetEmailTemplate(token, params.id)

  return (
    <main>
      <EDMBuilder data={data} />
    </main>
  )
}
