import { useState } from 'react'
import PasswordStep from './components/PasswordStep'
import NodeJsStep from './components/NodeJsStep'
import DiskSpaceStep from './components/DiskSpaceStep'
import InstallStep from './components/InstallStep'
import { Container } from './styled'

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0)

  const handleNext = () => {
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  return (
    <Container>
      {step === 0 && <PasswordStep onNext={handleNext} onBack={handleBack} />}
      {step === 1 && <NodeJsStep onNext={handleNext} onBack={handleBack} />}
      {step === 2 && <DiskSpaceStep onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <InstallStep />}
    </Container>
  )
}

export default App
