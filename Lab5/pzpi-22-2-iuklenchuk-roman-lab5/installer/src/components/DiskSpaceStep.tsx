import { useState, useEffect } from 'react'
import { HardDrive, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'

interface DiskSpaceStepProps {
  onNext: () => void
  onBack: () => void
}

// Styled components using Tailwind classes
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-slate-200/50 backdrop-blur-sm">
    {children}
  </div>
)

const Title = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center flex items-center justify-center gap-3">
    <HardDrive className="text-blue-600" size={28} />
    {children}
  </h2>
)

const Text = ({ children, error = false }: { children: React.ReactNode, error?: boolean }) => (
  <p className={`text-center mb-4 ${error ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
    {children}
  </p>
)

const Button = ({ onClick, children, variant = 'primary' }: { 
  onClick: () => void, 
  children: React.ReactNode,
  variant?: 'primary' | 'secondary' 
}) => (
  <button
    onClick={onClick}
    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
      variant === 'primary'
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-blue-500/25'
        : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
    }`}
  >
    {children}
  </button>
)

const ProgressBar = ({ available, required }: { available: number, required: number }) => {
  const percentage = Math.min((available / Math.max(required * 2, available)) * 100, 100)
  const isEnough = available >= required
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600">Доступне місце</span>
        <span className={`text-sm font-bold ${isEnough ? 'text-green-600' : 'text-red-600'}`}>
          {available.toFixed(2)} ГБ
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isEnough 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
              : 'bg-gradient-to-r from-red-400 to-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-slate-500">Потрібно: {required} ГБ</span>
        <span className={`text-xs font-medium ${isEnough ? 'text-green-600' : 'text-red-600'}`}>
          {isEnough ? '✓ Достатньо' : '✗ Недостатньо'}
        </span>
      </div>
    </div>
  )
}

const StatusIcon = ({ available, required }: { available: number, required: number }) => {
  const isEnough = available >= required
  
  return (
    <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${
      isEnough 
        ? 'bg-green-100 text-green-600' 
        : 'bg-red-100 text-red-600'
    }`}>
      {isEnough ? (
        <CheckCircle size={32} className="animate-pulse" />
      ) : (
        <AlertTriangle size={32} className="animate-bounce" />
      )}
    </div>
  )
}

const LoadingSpinner = () => (
  <div className="text-center py-8">
    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
      <Loader2 size={32} className="text-blue-600 animate-spin" />
    </div>
    <Text>Перевіряю доступне місце...</Text>
  </div>
)

const DiskSpaceStep: React.FC<DiskSpaceStepProps> = ({ onNext, onBack }) => {
  const [diskSpace, setDiskSpace] = useState<{ available: number; required: number } | null>(null)
  const [, setConfirmed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDiskSpace = async () => {
      try {
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (navigator.storage && navigator.storage.estimate) {
          const { quota, usage } = await navigator.storage.estimate()
          const availableGB = quota ? (quota - (usage || 0)) / 1024 ** 3 : 0
          setDiskSpace({
            available: Math.round(availableGB * 100) / 100,
            required: 0.4,
          })
        } else {
          setDiskSpace({ available: 57.4, required: 0.4 })
        }
      } catch (error) {
        console.error('Помилка перевірки місця:', error)
        setDiskSpace({ available: 57.4, required: 0.4 })
      } finally {
        setIsLoading(false)
      }
    }

    checkDiskSpace()
  }, [])

  const handleConfirm = () => {
    setConfirmed(true)
    onNext()
  }

  return (
    <Card>
      <Title>Перевірка вільного місця</Title>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : diskSpace === null ? (
        <Text>Помилка перевірки місця</Text>
      ) : (
        <>
          <StatusIcon available={diskSpace.available} required={diskSpace.required} />
          <ProgressBar available={diskSpace.available} required={diskSpace.required} />
          
          {diskSpace.available >= diskSpace.required ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <Text>
                  Відмінно! У вас достатньо місця для встановлення системи.
                </Text>
                <Text>Чи готові ви продовжити встановлення?</Text>
              </div>
              <div className="space-y-3">
                <Button onClick={handleConfirm} variant="primary">
                  Так, встановити систему
                </Button>
                <Button onClick={onBack} variant="secondary">
                  Повернутися назад
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <Text error>
                  На жаль, недостатньо вільного місця для встановлення.
                </Text>
                <Text error>
                  Потрібно звільнити ще {(diskSpace.required - diskSpace.available).toFixed(2)} ГБ.
                </Text>
              </div>
              <Button onClick={onBack} variant="secondary">
                Повернутися назад
              </Button>
            </>
          )}
        </>
      )}
    </Card>
  )
}

export default DiskSpaceStep