import React from 'react'

import { StatusBadge, ConnectButton } from '../Status';
import { VideoFrame, PointMap } from '../MediaBlocks';
import StatusBlock from '../Status/StatusBlock';
import { NavigationMap } from '../MediaBlocks/NavigationMap';

export const MainBody = ({
    connected,
    setConnected
}: {
    connected: boolean;
    setConnected: (connected: boolean) => void;
}) => {
    return (
        <div className="container py-2">
            <div className="row">
                <div className="col px-0">
                    <div className="col px-0 align-items-center my-2">
                        <StatusBadge connected={connected} />
                        <ConnectButton 
                            connected={connected} 
                            setConnected={setConnected} 
                        />
                    </div>
                    <div className="w-100" />
                    <div className="col px-0">
                        <VideoFrame/>
                    </div>
                </div>
                <div className="col px-0 d-flex justify-content-center align-items-center">
                    <StatusBlock />
                </div>
                <div className="col px-0 d-flex flex-column align-items-center">
                    <div className="de-inline-block my-3">
                        Point Map:
                    </div>
                    <div className="col px-0">
                        <PointMap />
                    </div>
                </div>
            </div>
            <div className="row">
            <div className="col px-0 d-flex flex-column">
                    <div className="text-left my-3">
                        Navigation Map:
                    </div>
                    <div className="col px-0 align-items-center">
                        <NavigationMap />
                    </div>
                </div>
            </div>
        </div>
    )
}
