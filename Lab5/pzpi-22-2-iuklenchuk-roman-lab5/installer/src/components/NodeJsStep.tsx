import { useState, useEffect } from 'react'
import { Package, CheckCircle, XCircle, Loader2, ExternalLink, Download } from 'lucide-react'

interface NodeJsStepProps {
  onNext: () => void
  onBack: () => void
}

// Mock constant for demo - replace with your actual import
const isInstalled = true // Replace with: import { isInstalled } from '@shared/consts/consts'

// Styled components using Tailwind classes
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-green-200/50 backdrop-blur-sm">
    {children}
  </div>
)

const Title = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center flex items-center justify-center gap-3">
    <Package className="text-green-600" size={28} />
    {children}
  </h2>
)

const Text = ({ children, error = false }: { children: React.ReactNode, error?: boolean }) => (
  <p className={`text-center mb-4 ${error ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
    {children}
  </p>
)

const Button = ({ onClick, children, variant = 'primary', href, target }: { 
  onClick?: () => void, 
  children: React.ReactNode,
  variant?: 'primary' | 'secondary' | 'download',
  href?: string,
  target?: string
}) => {
  const baseClasses = "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-green-500/25',
    secondary: 'bg-white text-slate-700 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50',
    download: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/25'
  }

  const Component = href ? 'a' : 'button'
  
  return (
    <Component
      {...(href ? { href, target } : { onClick })}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </Component>
  )
}

const StatusDisplay = ({ isInstalled, version }: { isInstalled: boolean | null, version: string }) => {
  if (isInstalled === null) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          <Loader2 size={36} className="text-slate-600 animate-spin" />
        </div>
        <Text>Перевіряю наявність Node.js...</Text>
      </div>
    )
  }

  return (
    <div className="text-center py-4">
      <div className={`mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
        isInstalled 
          ? 'bg-green-100 text-green-600 animate-pulse' 
          : 'bg-red-100 text-red-600 animate-bounce'
      }`}>
        {isInstalled ? (
          <CheckCircle size={36} />
        ) : (
          <XCircle size={36} />
        )}
      </div>
      
      {isInstalled ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="text-green-600" size={20} />
            <span className="font-semibold text-green-800">Node.js встановлено</span>
          </div>
          <div className="bg-green-100 rounded-lg px-3 py-2 inline-block">
            <code className="text-green-800 font-mono text-sm">Версія {version}</code>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <XCircle className="text-red-600" size={20} />
            <span className="font-semibold text-red-800">Node.js не знайдено</span>
          </div>
          <Text error>
            Для продовження роботи необхідно встановити Node.js з офіційного сайту.
          </Text>
        </div>
      )}
    </div>
  )
}

const VersionBadge = ({ version }: { version: string }) => (
  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
    <Package size={16} />
    <span>Node.js {version}</span>
    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
  </div>
)

const NodeJsStep: React.FC<NodeJsStepProps> = ({ onNext, onBack }) => {
  const [isNodeInstalled, setIsNodeInstalled] = useState<boolean | null>(null)
  const [nodeVersion, setNodeVersion] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkNodeJs = async () => {
      try {
        // Add a realistic delay for better UX
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        if (isInstalled) {
          setIsNodeInstalled(true)
          setNodeVersion('v20.9.0')
        } else {
          setIsNodeInstalled(false)
        }
      } catch {
        setIsNodeInstalled(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkNodeJs()
  }, [])

  return (
    <Card>
      <Title>Перевірка Node.js</Title>
      
      <StatusDisplay isInstalled={isLoading ? null : isNodeInstalled} version={nodeVersion} />
      
      {!isLoading && (
        <>
          {isNodeInstalled ? (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <VersionBadge version={nodeVersion} />
              </div>
              <div className="space-y-3">
                <Button onClick={onNext} variant="primary">
                  <CheckCircle size={20} />
                  Продовжити встановлення
                </Button>
                <Button onClick={onBack} variant="secondary">
                  Повернутися назад
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="text-blue-600" size={20} />
                  <span className="font-semibold text-blue-800">Необхідне встановлення</span>
                </div>
                <Text>
                  Завантажте останню LTS версію Node.js для вашої операційної системи.
                </Text>
              </div>
              
              <div className="space-y-3">
                <Button 
                  href="https://nodejs.org" 
                  target="_blank" 
                  variant="download"
                >
                  <ExternalLink size={20} />
                  Завантажити Node.js
                </Button>
                <Button onClick={onBack} variant="secondary">
                  Повернутися назад
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <Text>
                  Після встановлення перезапустіть програму та спробуйте знову.
                </Text>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}

export default NodeJsStep