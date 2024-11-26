'use client'

import { useState, useEffect } from 'react'
import BottomNavBar from '../components/BottomNavBar'
import LeaseCalculator from '../components/LeaseCalculator'
import LeaseComparison from '../components/LeaseComparison'
import Profile from '../components/Profile'
import { Lease } from '@/types/lease'
import { TabType } from '@/types/navigation'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('calculator')
  const [leases, setLeases] = useState<Lease[]>([])
  const [editingLease, setEditingLease] = useState<Lease | null>(null)

  useEffect(() => {
    const savedLeases = JSON.parse(localStorage.getItem('leases') || '[]') as Lease[]
    setLeases(savedLeases)
  }, [])

  const saveLease = (lease: Partial<Lease>) => {
    if (!lease.carModel?.trim()) {
      return;
    }
    
    const updatedLeases = editingLease
      ? leases.map((l) => (l.id === editingLease.id ? { ...lease, id: editingLease.id } : l))
      : [{ ...lease, id: Date.now() }, ...leases]
    setLeases(updatedLeases as Lease[])
    localStorage.setItem('leases', JSON.stringify(updatedLeases))
    setEditingLease(null)
  }

  const deleteLease = (id: number) => {
    const updatedLeases = leases.filter((lease) => lease.id !== id)
    setLeases(updatedLeases)
    localStorage.setItem('leases', JSON.stringify(updatedLeases))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto p-4 pb-24">
        {activeTab === 'calculator' && (
          <LeaseCalculator
            onSave={saveLease}
            editingLease={editingLease}
            leases={leases}
            onEdit={setEditingLease}
            onDelete={deleteLease}
          />
        )}
        {activeTab === 'comparison' && <LeaseComparison leases={leases} />}
        {activeTab === 'profile' && <Profile />}
      </main>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
