import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Profile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a placeholder for the user profile.</p>
        <p>In a real app, you would display user information and settings here.</p>
      </CardContent>
    </Card>
  )
}

