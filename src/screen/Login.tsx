import React from 'react'
import { useForm } from 'react-hook-form'

interface LoginInput {
  nickname: string
}

const Login = () => {
  const { register, handleSubmit } = useForm<LoginInput>()
  const onSetNickname = ({ nickname }: LoginInput) => {}
  return (
    <div>
      <form onSubmit={handleSubmit(onSetNickname)}>
        <input {...register('nickname')} placeholder='Your nickname here' />
        <input type='submit' value='submit' />
      </form>
    </div>
  )
}

export default Login
