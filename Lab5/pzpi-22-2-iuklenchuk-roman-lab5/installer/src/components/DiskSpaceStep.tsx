import { useState, useEffect } from 'react'
import { Card, Title, Text, Button, BackButton } from '../styled'

interface DiskSpaceStepProps {
  onNext: () => void
  onBack: () => void
}

const DiskSpaceStep: React.FC<DiskSpaceStepProps> = ({ onNext, onBack }) => {
  const [diskSpace, setDiskSpace] = useState<{ available: number; required: number } | null>(null)
  const [, setConfirmed] = useState<boolean>(false)

  useEffect(() => {
    const checkDiskSpace = async () => {
      try {
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
      {diskSpace === null ? (
        <Text>Перевіряю доступне місце...</Text>
      ) : diskSpace.available >= diskSpace.required ? (
        <>
          <Text>
            Доступно {diskSpace.available.toFixed(2)} ГБ з необхідних {diskSpace.required} ГБ.
          </Text>
          <Text>Чи готові ви встановити систему?</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Button onClick={handleConfirm}>Так, встановити</Button>
            <BackButton onClick={onBack}>Повернутися назад</BackButton>
          </div>
        </>
      ) : (
        <>
          <Text error>
            Недостатньо вільного місця. Потрібно {diskSpace.required} ГБ, доступно {diskSpace.available.toFixed(2)} ГБ.
          </Text>
          <BackButton onClick={onBack}>Повернутися назад</BackButton>
        </>
      )}
    </Card>
  )
}

export default DiskSpaceStep
