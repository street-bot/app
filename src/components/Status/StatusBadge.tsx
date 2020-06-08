import React from 'react'

export const StatusBadge = ({
    connected
}: {
    connected: boolean;
}) => {
    return (
        <span className={`badge badge-${connected ? "success" : "danger"} mx-1 my-2`}>
            {connected ? "Connected" : "Disconnected"}
        </span>
    );
}
