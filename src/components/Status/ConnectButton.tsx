import React from 'react'

export const ConnectButton = ({
    connected,
    setConnected
}: {
    connected: boolean;
    setConnected: (connected: boolean) => void;
}) => {

    return (
    <div role="button" className="badge badge-primary mx-1 my-2" onClick={() => setConnected(!connected)}>
        {connected ? "Disconnect" : "Connect"}
    </div>
    )
}
