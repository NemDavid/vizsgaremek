import { createFileRoute } from '@tanstack/react-router'

import { MainPage } from './-components'
import { AuthPage } from './-components/Auth'




export const Route = createFileRoute('/')({
  component: HomePage,
})



function HomePage() {

  if(true){
    return ( <AuthPage/>)
  }


  return ( <MainPage/>)
}
