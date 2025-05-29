import { useState } from 'react'
import { Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle, Key } from 'lucide-react'

interface PasswordStepProps {
  onNext: () => void
  onBack: () => void
}

// Styled components using Tailwind classes
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-amber-200/50 backdrop-blur-sm">
    {children}
  </div>
)

const Title = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center flex items-center justify-center gap-3">
    <Shield className="text-amber-600" size={28} />
    {children}
  </h2>
)

const InputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mb-4">
    {children}
  </div>
)

const Input = ({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  hasError,
  onKeyPress 
}: { 
  type: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  placeholder: string,
  hasError?: boolean,
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    onKeyPress={onKeyPress}
    className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 text-lg font-medium ${
      hasError 
        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 text-red-700 placeholder-red-400' 
        : 'border-amber-200 bg-white focus:border-amber-500 focus:ring-amber-200 text-slate-700 placeholder-slate-400'
    }`}
  />
)

const IconButton = ({ onClick, children, className }: { 
  onClick: () => void,
  children: React.ReactNode,
  className?: string
}) => (
  <button
    onClick={onClick}
    className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
)

const Button = ({ onClick, children, disabled = false }: { 
  onClick: () => void,
  children: React.ReactNode,
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-3 text-lg ${
      disabled
        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
        : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-amber-500/25'
    }`}
  >
    {children}
  </button>
)

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-shake">
    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
    <span className="text-red-700 font-medium">{message}</span>
  </div>
)

const SecurityInfo = () => (
  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
    <div className="flex items-center gap-2 mb-2">
      <Lock className="text-amber-600" size={16} />
      <span className="font-semibold text-amber-800 text-sm">Захищений доступ</span>
    </div>
    <p className="text-amber-700 text-sm">
      Введіть пароль для авторизації встановлення системи
    </p>
  </div>
)


const PasswordStep: React.FC<PasswordStepProps> = ({ onNext, onBack }) => {
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isValidating, setIsValidating] = useState<boolean>(false)

  const handleSubmit = async () => {
    setIsValidating(true)
    setError('')
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (password === "123456") { 
      setError('')
      onNext()
    } else {
      setError('Невірний пароль для встановлення')
    }
    
    setIsValidating(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && password && !isValidating) {
      handleSubmit()
    }
  }


  return (
    <Card>
      <Title>Авторизація встановлення</Title>
      
      <SecurityInfo />
      
      <InputContainer>
        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <Input 
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Введіть пароль встановлення"
          hasError={!!error}
          onKeyPress={handleKeyPress}
        />
        <IconButton 
          onClick={() => setShowPassword(!showPassword)}
          className="hover:text-amber-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </IconButton>
      </InputContainer>

      
      {error && <ErrorMessage message={error} />}
      
      <div className="space-y-3">
        <Button 
          onClick={handleSubmit} 
          disabled={!password || isValidating}
        >
          {isValidating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Перевіряю...
            </>
          ) : (
            <>
              <Key size={20} />
              Підтвердити пароль
            </>
          )}
        </Button>
        
      </div>
      
    </Card>
  )
}

export default PasswordStep