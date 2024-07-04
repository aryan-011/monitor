import React from 'react'
import TrackingForm from './createMonitor'

interface Props {}

function Page(props: Props) {
    const {} = props

    return (
        <div className='flex flex-col mx-8'>
            <TrackingForm/>
        </div>
    )
}

export default Page
