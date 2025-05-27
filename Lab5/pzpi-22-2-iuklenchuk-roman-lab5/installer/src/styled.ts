import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 1rem;
`

export const Card = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 28rem;
  width: 100%;
`

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
`

export const Text = styled.p<{ error?: boolean }>`
  margin-bottom: 1rem;
  color: ${props => (props.error ? '#ef4444' : '#374151')};
`

export const ErrorText = styled(Text)`
  color: #ef4444;
`

export const Button = styled.button<{ $secondary?: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: white;
  background-color: ${props => (props.$secondary ? '#ef4444' : '#3b82f6')};
  &:hover {
    background-color: ${props => (props.$secondary ? '#dc2626' : '#2563eb')};
  }
`

export const BackButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: #374151;
  background-color: #d1d5db;
  border: 1px solid #9ca3af;
  &:hover {
    background-color: #b9bfc7;
  }
`
