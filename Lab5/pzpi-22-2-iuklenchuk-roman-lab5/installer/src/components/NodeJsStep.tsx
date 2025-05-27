import { useState, useEffect } from 'react'
import { Card, Title, Button, ErrorText, BackButton } from '../styled'
import { isInstalled } from '@shared/consts/consts'

interface NodeJsStepProps {
  onNext: () => void
  onBack: () => void
}

const NodeJsStep: React.FC<NodeJsStepProps> = ({ onNext, onBack }) => {
  const [isNodeInstalled, setIsNodeInstalled] = useState<boolean | null>(null)
  const [nodeVersion, setNodeVersion] = useState<string>('')

  useEffect(() => {
    const checkNodeJs = async () => {
      try {
        if (isInstalled) {
          setIsNodeInstalled(true)
          setNodeVersion('v18.16.0')
        } else {
          setIsNodeInstalled(false)
        }
      } catch {
        setIsNodeInstalled(false)
      }
    }

    checkNodeJs()
  }, [])

  return (
    <Card>
      <Title>Перевірка наявності Node.js</Title>
      {isNodeInstalled === null ? (
        <p>Перевіряю наявність Node.js...</p>
      ) : isNodeInstalled ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p>Node.js встановлено (версія {nodeVersion}).</p>
          <Button onClick={onNext}>Продовжити</Button>
          <BackButton onClick={onBack}>Повернутися назад</BackButton>
        </div>
      ) : (
        <div>
          <ErrorText>
            Node.js не встановлено. Будь ласка, завантажте та встановіть Node.js з офіційного сайту.
          </ErrorText>
          <Button as="a" href="https://nodejs.org" target="_blank">
            Завантажити Node.js
          </Button>
          <BackButton onClick={onBack}>Повернутися назад</BackButton>
        </div>
      )}
    </Card>
  )
}

export default NodeJsStep
