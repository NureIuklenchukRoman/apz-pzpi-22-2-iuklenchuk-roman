import { useState, useEffect } from 'react'
import { Card, Title, Text, Button } from '../styled'

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
          setIsInstalling(false)
          setIsComplete(true)
          return 100
        }
        
        return newProgress
      })
    }, 30) // 3000ms / 100 = 30ms per 1%

    return () => clearInterval(progressTimer)
  }, [])

  return (
    <Card>
      <Title>Встановлення системи</Title>
      {isInstalling && (
        <>
          <Text>Зачекайте, запускаю скрипти для сервера та клієнта...</Text>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '2px',
            marginTop: '16px'
          }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#4caf50',
                borderRadius: '2px',
                transition: 'width 0.1s ease'
              }}
            />
          </div>
        </>
      )}
      {isComplete && (
        <>
          <Text>Сервер успішно запущено на http://localhost:5000/api</Text>
          <Text>Ви можете почати користуватися системою!</Text>
          <Button as="a" href="http://localhost:5000/api" target="_blank">
            Перейти до системи
          </Button>
        </>
      )}
    </Card>
  )
}

export default InstallStep