import { redirect } from 'next/navigation'

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

export default function SignInRedirect() {
  redirect('/signin')
}
