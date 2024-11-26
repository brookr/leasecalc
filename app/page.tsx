'use client'

import { useState, useEffect } from 'react'
import BottomNavBar from '../components/BottomNavBar'
import LeaseCalculator from '../components/LeaseCalculator'
import LeaseComparison from '../components/LeaseComparison'
import Profile from '../components/Profile'
import LeaseList from '../components/LeaseList'

export default function Home() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [leases, setLeases] = useState([])
  const [editingLease, setEditingLease] = useState(null)

  useEffect(() => {
    const savedLeases = JSON.parse(localStorage.getItem('leases') || '[]')
    setLeases(savedLeases)
  }, [])

  const saveLease = (lease) => {
    if (!lease.carModel.trim()) {
      return; // Don't save if car model is empty or just whitespace
    }
    
    const updatedLeases = editingLease
      ? leases.map((l) => (l.id === editingLease.id ? lease : l))
      : [{ ...lease, id: Date.now() }, ...leases]
    setLeases(updatedLeases)
    localStorage.setItem('leases', JSON.stringify(updatedLeases))
    setEditingLease(null)
  }

  const deleteLease = (id) => {
    const updatedLeases = leases.filter((lease) => lease.id !== id)
    setLeases(updatedLeases)
    localStorage.setItem('leases', JSON.stringify(updatedLeases))
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto p-4">
        {activeTab === 'calculator' && (
          <LeaseCalculator
            onSave={saveLease}
            editingLease={editingLease}
            leases={leases}
            onEdit={setEditingLease}
            onDelete={(id) => {
              const updatedLeases = leases.filter((lease) => lease.id !== id);
              setLeases(updatedLeases);
              localStorage.setItem('leases', JSON.stringify(updatedLeases));
            }}
          />
        )}
        {activeTab === 'comparison' && <LeaseComparison leases={leases} />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'list' && (
          <LeaseList
            leases={leases}
            onEdit={setEditingLease}
            onDelete={deleteLease}
          />
        )}
      </main>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
