import React from 'react';
import JSONPretty from 'react-json-pretty';
import JSONPrettyMon from 'react-json-pretty/dist/monikai';

const RenderJson = ({ data }: {data: any}) => (
     <JSONPretty data={data} theme={JSONPrettyMon}></JSONPretty>
);
export default RenderJson;
