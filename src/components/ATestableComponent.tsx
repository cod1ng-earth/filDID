import React, { useState } from 'react';

type ITestableComponentProps = {
  newName: string;
}

const ATestableComponent = ({ newName }: ITestableComponentProps) => {
  const [name, setName] = useState<string>('donald');
  const changeMyName = () => {
    setName(newName);
  };

  return (
    <div>
      <div className="name-display">Your name is {name}</div>
      <button onClick={changeMyName}>change name</button>
    </div>
  );
};

export default ATestableComponent;
