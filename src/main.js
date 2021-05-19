import React from 'react'

const { ipcRenderer } = window.require('electron')

export const Main = () => {

    setInterval(() => {
        ipcRenderer.send('balls', 'stuff')
    }, 5000)
    return (
        <div>
            main
        </div>
    )
}
