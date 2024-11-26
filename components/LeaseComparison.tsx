import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/formatters'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'

interface Lease {
  id: number;
  carModel: string;
  totalCost: number;
  leaseTerm: number;
}

interface SortableCardProps {
  lease: Lease;
}

function SortableCard({ lease }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lease.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        <CardHeader>
          <CardTitle>{lease.carModel}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Cost: ${formatCurrency(lease.totalCost)}</p>
          <p>Monthly Payment: ${formatCurrency(lease.totalCost / lease.leaseTerm)}</p>
          <p>Lease Term: {lease.leaseTerm} months</p>
        </CardContent>
      </Card>
    </div>
  )
}

interface LeaseComparisonProps {
  leases: Lease[];
}

export default function LeaseComparison({ leases }: LeaseComparisonProps) {
  const [items, setItems] = useState<Lease[]>(leases)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    const savedOrder = localStorage.getItem('leaseOrder')
    if (savedOrder) {
      const orderIds = JSON.parse(savedOrder) as number[]
      const orderedLeases = orderIds
        .map(id => leases.find(lease => lease.id === id))
        .filter(Boolean) as Lease[]
      const newLeases = leases.filter(lease => !orderIds.includes(lease.id))
      setItems([...orderedLeases, ...newLeases])
    } else {
      setItems(leases)
    }
  }, [leases])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        const orderIds = newItems.map(item => item.id)
        localStorage.setItem('leaseOrder', JSON.stringify(orderIds))
        return newItems
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Lease Comparison</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((lease) => (
              <SortableCard key={lease.id} lease={lease} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  )
}
