import { OrbitControls, PerspectiveCamera, View, Environment } from '@react-three/drei'
import React from 'react'
import { Suspense } from 'react'
import IPhone from './IPhone'
import * as THREE from 'three'

export const ModelView = ({index, modelRef, gsapType, controlRef, setRotationState, size, item}) => {
  return (
    <View index={index} id={gsapType} className={`w-full h-full absolute ${ index==2 ? 'right-[-100%]' : '' }`}>
        <ambientLight intensity={0.3}/>
        <PerspectiveCamera makeDefault position={[0 , 0, 4]}/>
        <Environment preset='warehouse'/>
        <OrbitControls
            makeDefault
            ref={controlRef}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.7}
            target={new THREE.Vector3(0, 0, 0)}
            onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
        />

        <group ref={modelRef} name={`${index == 1 ? 'small' : 'large'}`} position={[0, 0, 0]}>
            <Suspense>
                <IPhone scale={index === 1 ? [15, 15, 15] : [17, 17, 17]} item={item} size={size}/>
            </Suspense>
        </group>
    </View>
  )
}
