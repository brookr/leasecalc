import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LeaseList({ leases, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Leases</h2>
      {leases.map((lease) => (
        <Card key={lease.id}>
          <CardHeader>
            <CardTitle>{lease.carModel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Cost: ${lease.totalCost}</p>
            <p>Monthly Payment: ${(lease.totalCost / lease.leaseTerm).toFixed(2)}</p>
            <div className="flex justify-between mt-4">
              <Button onClick={() => onEdit(lease)}>Edit</Button>
              <Button variant="destructive" onClick={() => onDelete(lease.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

