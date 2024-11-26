import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/utils/formatters';
import { Lease } from '@/types/lease'

interface LeaseInput {
  negotiatedPrice: number;
  residualValue: number;
  moneyFactor: number;
  leaseTerm: number;
  taxRate: number;
  downPayment: number;
  fees: number;
  acquisitionFee: number;
  expectedInsurance: number;
}

interface LeaseCalculations {
  depreciationCost: number;
  financeCharges: number;
  totalTaxes: number;
  adjustedCapCost: number;
  apr: number;
  monthlyPayment: number;
  totalMonthlyPayment: number;
  totalCost: number;
}

interface LeaseCalculatorProps {
  onSave: (lease: Partial<Lease>) => void;
  editingLease: Lease | null;
  leases: Lease[];
  onEdit: (lease: Lease) => void;
  onDelete: (id: number) => void;
}

export default function LeaseCalculator({ onSave, editingLease, leases, onEdit, onDelete }: LeaseCalculatorProps) {
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
  const [activeField, setActiveField] = useState<string | null>(null)

  useEffect(() => {
    if (editingLease) {
      setLease(editingLease)
      setMonthlyCost(calculateLeaseDetails(editingLease).monthlyPayment)
    }
  }, [editingLease])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedLease = { ...lease, [name]: parseFloat(value) || value }
    setLease(updatedLease)
    const { monthlyPayment } = calculateLeaseDetails(updatedLease)
    setMonthlyCost(monthlyPayment)
  }

  const calculateLeaseDetails = (leaseData: LeaseInput): LeaseCalculations => {
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitLease()
  }

  const submitLease = () => {
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
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl font-bold">
            {editingLease ? 'Edit Lease' : 'Calculate Lease'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label className="text-lg font-semibold">Estimated Monthly Payment (excl. insurance)</Label>
            <div className="gradient-text text-3xl font-bold">
              ${formatCurrency(monthlyCost)}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label 
                htmlFor="carModel" 
                className={`font-medium ${activeField === 'carModel' ? 'label-active' : ''}`}
              >
                Car Model
              </Label>
              <Input
                className="input-modern"
                id="carModel"
                name="carModel"
                value={lease.carModel}
                onChange={handleChange}
                onFocus={() => setActiveField('carModel')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="msrp" 
                className={`font-medium ${activeField === 'msrp' ? 'label-active' : ''}`}
              >
                MSRP
              </Label>
              <Input
                className="input-modern"
                id="msrp"
                name="msrp"
                type="number"
                value={lease.msrp}
                onChange={handleChange}
                onFocus={() => setActiveField('msrp')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="negotiatedPrice" 
                className={`font-medium ${activeField === 'negotiatedPrice' ? 'label-active' : ''}`}
              >
                Negotiated Price
              </Label>
              <Input
                className="input-modern"
                id="negotiatedPrice"
                name="negotiatedPrice"
                type="number"
                value={lease.negotiatedPrice}
                onChange={handleChange}
                onFocus={() => setActiveField('negotiatedPrice')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="residualValue" 
                className={`font-medium ${activeField === 'residualValue' ? 'label-active' : ''}`}
              >
                Residual Value
              </Label>
              <Input
                className="input-modern"
                id="residualValue"
                name="residualValue"
                type="number"
                value={lease.residualValue}
                onChange={handleChange}
                onFocus={() => setActiveField('residualValue')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="moneyFactor" 
                className={`font-medium ${activeField === 'moneyFactor' ? 'label-active' : ''}`}
              >
                Money Factor
              </Label>
              <Input
                className="input-modern"
                id="moneyFactor"
                name="moneyFactor"
                type="number"
                step="0.0001"
                value={lease.moneyFactor}
                onChange={handleChange}
                onFocus={() => setActiveField('moneyFactor')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="leaseTerm" 
                className={`font-medium ${activeField === 'leaseTerm' ? 'label-active' : ''}`}
              >
                Lease Term (months)
              </Label>
              <Input
                className="input-modern"
                id="leaseTerm"
                name="leaseTerm"
                type="number"
                value={lease.leaseTerm}
                onChange={handleChange}
                onFocus={() => setActiveField('leaseTerm')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="downPayment" 
                className={`font-medium ${activeField === 'downPayment' ? 'label-active' : ''}`}
              >
                Down Payment
              </Label>
              <Input
                className="input-modern"
                id="downPayment"
                name="downPayment"
                type="number"
                value={lease.downPayment}
                onChange={handleChange}
                onFocus={() => setActiveField('downPayment')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="taxRate" 
                className={`font-medium ${activeField === 'taxRate' ? 'label-active' : ''}`}
              >
                Tax Rate (%)
              </Label>
              <Input
                className="input-modern"
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.01"
                value={lease.taxRate}
                onChange={handleChange}
                onFocus={() => setActiveField('taxRate')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="fees" 
                className={`font-medium ${activeField === 'fees' ? 'label-active' : ''}`}
              >
                Fees
              </Label>
              <Input
                className="input-modern"
                id="fees"
                name="fees"
                type="number"
                value={lease.fees}
                onChange={handleChange}
                onFocus={() => setActiveField('fees')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="acquisitionFee" 
                className={`font-medium ${activeField === 'acquisitionFee' ? 'label-active' : ''}`}
              >
                Acquisition Fee
              </Label>
              <Input
                className="input-modern"
                id="acquisitionFee"
                name="acquisitionFee"
                type="number"
                value={lease.acquisitionFee}
                onChange={handleChange}
                onFocus={() => setActiveField('acquisitionFee')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <div>
              <Label 
                htmlFor="expectedInsurance" 
                className={`font-medium ${activeField === 'expectedInsurance' ? 'label-active' : ''}`}
              >
                Expected Monthly Insurance
              </Label>
              <Input
                className="input-modern"
                id="expectedInsurance"
                name="expectedInsurance"
                type="number"
                value={lease.expectedInsurance}
                onChange={handleChange}
                onFocus={() => setActiveField('expectedInsurance')}
                onBlur={() => setActiveField(null)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="button-modern w-full"
            >
              {editingLease ? 'Update Lease' : 'Save Lease'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Saved Leases</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {leases.map((savedLease) => (
              <Card key={savedLease.id} className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{savedLease.carModel}</CardTitle>
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
