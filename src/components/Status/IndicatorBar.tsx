import React from 'react';
import { Progress } from 'reactstrap';

const getColor = (value: number) => {
    if (value < 30) return "danger";
    if (value < 50) return "warning";
    if (value < 80) return "info";
    return "success";
}
export default function IndicatorBar({value}: {value: number}) {
    return (
        <Progress
            animated
            striped
            color={getColor(value)} 
            value={value}
            className="mx-2 my-2"
            style={{width: "100px"}}
        />
    )
}
