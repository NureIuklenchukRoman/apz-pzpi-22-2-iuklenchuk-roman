import { useState, useEffect } from 'react'
import { Settings, CheckCircle, Server, Loader2, ExternalLink, Zap, Database, Globe } from 'lucide-react'

// Styled components using Tailwind classes
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-2xl p-8 max-w-lg mx-auto border border-purple-200/50 backdrop-blur-sm">
    {children}
  </div>
)

const Title = ({ children, isComplete = false }: { children: React.ReactNode, isComplete?: boolean }) => (
  <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center flex items-center justify-center gap-3">
    {isComplete ? (
      <CheckCircle className="text-green-600 animate-pulse" size={28} />
    ) : (
      <Settings className="text-purple-600 animate-spin" size={28} />
    )}
    {children}
  </h2>
)

const Text = ({ children }: { children: React.ReactNode }) => (
  <p className="text-center mb-4 text-slate-600">
    {children}
  </p>
)

const Button = ({ href, target, children }: { 
  href: string,
  target: string,
  children: React.ReactNode
}) => (
  <a
    href={href}
    target={target}
    className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-green-500/25 flex items-center justify-center gap-3 text-lg"
  >
    {children}
  </a>
)

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-medium text-slate-600">Прогрес встановлення</span>
      <span className="text-sm font-bold text-purple-600">{progress}%</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
      <div 
        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 transition-all duration-300 ease-out relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 animate-shimmer" />
      </div>
    </div>
    <div className="mt-2 text-center">
      <span className="text-xs text-slate-500">
        {progress < 30 ? 'Ініціалізація...' : 
         progress < 60 ? 'Встановлення залежностей...' :
         progress < 90 ? 'Налаштування сервера...' : 'Завершення...'}
      </span>
    </div>
  </div>
)

const InstallationSteps = ({ progress }: { progress: number }) => {
  const steps = [
    { icon: Database, label: 'Ініціалізація бази даних', threshold: 0 },
    { icon: Settings, label: 'Встановлення залежностей', threshold: 25 },
    { icon: Server, label: 'Налаштування сервера', threshold: 50 },
    { icon: Globe, label: 'Запуск системи', threshold: 75 }
  ]

  return (
    <div className="mb-6">
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = progress >= step.threshold
          const isComplete = progress > step.threshold + 20
          const Icon = step.icon
          
          return (
            <div 
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                isComplete 
                  ? 'bg-green-100 text-green-700' 
                  : isActive 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isComplete 
                  ? 'bg-green-200' 
                  : isActive 
                    ? 'bg-purple-200' 
                    : 'bg-slate-200'
              }`}>
                {isComplete ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
                )}
              </div>
              <span className="font-medium">{step.label}</span>
              {isActive && !isComplete && (
                <Loader2 size={16} className="ml-auto animate-spin" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SuccessDisplay = () => (
  <div className="text-center">
    <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
      <CheckCircle size={48} className="text-green-600 animate-bounce" />
    </div>
    
    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Zap className="text-green-600" size={24} />
        <span className="font-bold text-green-800 text-lg">Система готова!</span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-center gap-2">
          <Server className="text-green-600" size={16} />
          <a className="text-green-700 font-mono text-sm" href="http://localhost:8000/docs">http://localhost:8000/docs</a>
        </div>
        <Text>Сервер успішно запущено та готовий до роботи</Text>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-center gap-2">
          <Server className="text-green-600" size={16} />
          <a className="text-green-700 font-mono text-sm" href="http://localhost:3000">http://localhost:3000</a>
        </div>
        <Text>Користувацький інтерфейс успішно запущено та готовий до роботи</Text>
      </div>

    </div>
    
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6">
      <Text>🎉 Вітаємо! Тепер ви можете почати користуватися системою</Text>
    </div>
  </div>
)

const InstallStep: React.FC = () => {
  const [isInstalling, setIsInstalling] = useState<boolean>(true)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1
        
        if (newProgress >= 100) {
          clearInterval(progressTimer)
          setTimeout(() => {
            setIsInstalling(false)
            setIsComplete(true)
          }, 500) // Small delay for better UX
          return 100
        }
        
        return newProgress
      })
    }, 50) // Slightly slower for better visual experience

    return () => clearInterval(progressTimer)
  }, [])

  return (
    <Card>
      <Title isComplete={isComplete}>
        {isComplete ? 'Встановлення завершено' : 'Встановлення системи'}
      </Title>
      
      {isInstalling && (
        <>
          <div className="mb-6">
            <Text>Зачекайте, виконую встановлення та налаштування системи...</Text>
          </div>
          
          <InstallationSteps progress={progress} />
          <ProgressBar progress={progress} />
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              <Loader2 size={16} className="animate-spin" />
              <span>Виконується встановлення...</span>
            </div>
          </div>
        </>
      )}
      
      {isComplete && (
        <>
          <SuccessDisplay />
          <Button href="http://localhost:5000/api" target="_blank">
            <ExternalLink size={24} />
            Перейти до системи
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          </Button>
        </>
      )}
    </Card>
  )
}

export default InstallStep