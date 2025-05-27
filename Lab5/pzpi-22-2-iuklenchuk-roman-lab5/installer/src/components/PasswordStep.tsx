import { useState } from 'react'
import { Card, Title, Input, ErrorText, Button } from '../styled'

interface PasswordStepProps {
  onNext: () => void
  onBack: () => void
}

const PasswordStep: React.FC<PasswordStepProps> = ({ onNext }) => {
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = () => {
    if (password === "123456") { 
      setError('')
      onNext()
    } else {
      setError('Невірний пароль')
    }
  }

  return (
    <Card>
      <Title>Введіть пароль для встановлення</Title>
      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" />
      {error && <ErrorText>{error}</ErrorText>}
      <Button onClick={handleSubmit}>Далі</Button>
    </Card>
  )
}

export default PasswordStep
