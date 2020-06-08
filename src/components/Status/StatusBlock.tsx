import React from 'react'

import IndicatorBar from '../Status/IndicatorBar';

export default function StatusBlock() {
    return (
        <div style={{transform: "rotate(-90deg)", height: "130px", maxWidth: "130px", marginRight: "-30px"}}>
            <IndicatorBar value={30}/>
            <IndicatorBar value={80}/>
            <IndicatorBar value={10}/>
            <IndicatorBar value={60}/>
        </div>
    )
}
