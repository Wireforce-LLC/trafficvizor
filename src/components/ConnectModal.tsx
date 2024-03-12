import React, {Fragment, useEffect, useState} from "react";
import Modal, {$modal} from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";
import _ from "lodash";

function ModalContent() {
  const [host, setHost] = useState('https://api.wireforce.ru')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return <div className="p-4 items-center flex flex-col w-full justify-center">
    <span className="text-3xl bg-gray-100 p-2 rounded-lg h-12 w-12 mt-2 mb-6">🔗</span>
    <h1 className="text-center font-semibold text-xl">Connect with your TrafficLight</h1>
    <p className="text-center text-xs text-gray-500 px-24">Connect this session to your TrafficLight server<br/>and you
      can manage it right away</p>

    <div className="space-y-2 w-full mb-6 mt-4">
      <Input placeholder="https://your-traffic-light-host.com" label="Host" value={host} setValue={setHost}/>
      <div className="grid grid-cols-2 gap-4">
        <Input value={username} setValue={setUsername} placeholder="username" label="Username"/>
        <Input value={password} setValue={setPassword} placeholder="password" label="Password"/>
      </div>
    </div>

    <Button onClick={() => {
      localStorage.setItem('host', host)
      localStorage.setItem('username', username)

      sessionStorage.setItem('password', password)
    }} text="Connect"/>

  </div>
}

export default function ConnectModal() {

  useEffect(() => {
    if (
        _.isEmpty(localStorage.getItem('username')) ||
        _.isEmpty(localStorage.getItem('host')) ||
        _.isEmpty(sessionStorage.getItem('password'))
    ) {
      openModalConnectWithProps({})
    }
  }, []);


  const {component: connectComponent, openModalWithProps: openModalConnectWithProps} = $modal(
      "Connect",
      <ModalContent/>,
      {
        isCanBeClosed: false
      }
  )

  return connectComponent
}