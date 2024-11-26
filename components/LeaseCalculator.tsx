import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/utils/formatters';

export default function LeaseCalculator({ onSave, editingLease, leases, onEdit, onDelete }) {
  const [lease, setLease] = useState({
    carModel: '',
    msrp: 0,
    negotiatedPrice: 0,
    residualValue: 0,
    moneyFactor: 0,
    leaseTerm: 36,
    downPayment: 0,
    taxRate: 0,
    fees: 0,
    acquisitionFee: 0,
    expectedInsurance: 0,
  })
  const [monthlyCost, setMonthlyCost] = useState(0)

  useEffect(() => {
    if (editingLease) {
      setLease(editingLease)
      setMonthlyCost(calculateLeaseDetails(editingLease).monthlyPayment)
    }
  }, [editingLease])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedLease = { ...lease, [name]: parseFloat(value) || value }
    setLease(updatedLease)
    const { monthlyPayment } = calculateLeaseDetails(updatedLease)
    setMonthlyCost(monthlyPayment)
  }

  const calculateLeaseDetails = (leaseData) => {
    const {
      negotiatedPrice,
      residualValue,
      moneyFactor,
      leaseTerm,
      taxRate,
      downPayment,
      fees,
      acquisitionFee,
      expectedInsurance
    } = leaseData

    const depreciationCost = negotiatedPrice - residualValue
    const adjustedCapCost = negotiatedPrice + acquisitionFee - downPayment
    const baseMonthlyPayment = (depreciationCost + adjustedCapCost * moneyFactor * leaseTerm) / leaseTerm
    const monthlyTax = baseMonthlyPayment * (taxRate / 100)
    const monthlyPayment = baseMonthlyPayment + monthlyTax
    const totalMonthlyPayment = monthlyPayment + expectedInsurance

    const financeCharges = adjustedCapCost * moneyFactor * leaseTerm
    const totalTaxes = monthlyTax * leaseTerm
    const apr = moneyFactor * 2400

    const totalCost = (monthlyPayment * leaseTerm) + downPayment + fees + acquisitionFee

    return {
      depreciationCost,
      financeCharges,
      totalTaxes,
      adjustedCapCost,
      apr,
      monthlyPayment,
      totalMonthlyPayment,
      totalCost
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const leaseDetails = calculateLeaseDetails(lease)
    onSave({ ...lease, ...leaseDetails })
    setLease({
      carModel: '',
      msrp: 0,
      negotiatedPrice: 0,
      residualValue: 0,
      moneyFactor: 0,
      leaseTerm: 36,
      downPayment: 0,
      taxRate: 0,
      fees: 0,
      acquisitionFee: 0,
      expectedInsurance: 0,
    })
    setMonthlyCost(0)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingLease ? 'Edit Lease' : 'Calculate Lease'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Estimated Monthly Payment (excl. insurance)</Label>
            <div className="text-2xl font-bold">${formatCurrency(monthlyCost)}</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="carModel">Car Model</Label>
              <Input
                id="carModel"
                name="carModel"
                value={lease.carModel}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="msrp">MSRP</Label>
              <Input
                id="msrp"
                name="msrp"
                type="number"
                value={lease.msrp}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="negotiatedPrice">Negotiated Price</Label>
              <Input
                id="negotiatedPrice"
                name="negotiatedPrice"
                type="number"
                value={lease.negotiatedPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="residualValue">Residual Value</Label>
              <Input
                id="residualValue"
                name="residualValue"
                type="number"
                value={lease.residualValue}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="moneyFactor">Money Factor</Label>
              <Input
                id="moneyFactor"
                name="moneyFactor"
                type="number"
                step="0.0001"
                value={lease.moneyFactor}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="leaseTerm">Lease Term (months)</Label>
              <Input
                id="leaseTerm"
                name="leaseTerm"
                type="number"
                value={lease.leaseTerm}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="downPayment">Down Payment</Label>
              <Input
                id="downPayment"
                name="downPayment"
                type="number"
                value={lease.downPayment}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.01"
                value={lease.taxRate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="fees">Fees</Label>
              <Input
                id="fees"
                name="fees"
                type="number"
                value={lease.fees}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="acquisitionFee">Acquisition Fee</Label>
              <Input
                id="acquisitionFee"
                name="acquisitionFee"
                type="number"
                value={lease.acquisitionFee}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="expectedInsurance">Expected Monthly Insurance</Label>
              <Input
                id="expectedInsurance"
                name="expectedInsurance"
                type="number"
                value={lease.expectedInsurance}
                onChange={handleChange}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            {editingLease ? 'Update' : 'Save'} Lease
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Saved Leases</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {leases.map((savedLease) => (
              <Card key={savedLease.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{savedLease.carModel}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>MSRP: ${formatCurrency(savedLease.msrp)}</p>
                    <p>Total Cost: ${formatCurrency(savedLease.totalCost)}</p>
                    <p>Monthly Payment (excl. insurance): ${formatCurrency(savedLease.monthlyPayment)}</p>
                    <p>Total Monthly Payment (incl. insurance): ${formatCurrency(savedLease.totalMonthlyPayment)}</p>
                    <p>Depreciation Cost: ${formatCurrency(savedLease.depreciationCost)}</p>
                    <p>Finance Charges: ${formatCurrency(savedLease.financeCharges)}</p>
                    <p>Total Taxes: ${formatCurrency(savedLease.totalTaxes)}</p>
                    <p>Adjusted Cap Cost: ${formatCurrency(savedLease.adjustedCapCost)}</p>
                    <p>APR: {savedLease.apr.toFixed(2)}%</p>
                    <p>Acquisition Fee: ${formatCurrency(savedLease.acquisitionFee)}</p>
                    <p>Expected Monthly Insurance: ${formatCurrency(savedLease.expectedInsurance)}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between w-full">
                    <Button onClick={() => onEdit(savedLease)}>Edit</Button>
                    <Button variant="destructive" onClick={() => onDelete(savedLease.id)}>Delete</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
