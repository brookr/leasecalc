import { Plus, User, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dispatch, SetStateAction } from 'react'
import { TabType } from '@/types/navigation'

interface BottomNavBarProps {
  activeTab: TabType;
  setActiveTab: Dispatch<SetStateAction<TabType>>;
}

export default function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab('profile')}
            className={activeTab === 'profile' ? 'text-primary' : 'text-gray-500'}
          >
            <User className="h-6 w-6" />
          </Button>
          <Button
            onClick={() => setActiveTab('calculator')}
            size="icon"
            className="bg-primary text-white rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab('comparison')}
            className={activeTab === 'comparison' ? 'text-primary' : 'text-gray-500'}
          >
            <BarChart2 className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
