import React, { useState, useRef, useEffect } from 'react';

import ReactHlsPlayer, { ReactHlsPlayerRef } from '../../src';
import './index.scss';

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hlsUrl, setHlsUrl] = useState(
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  );

  const [config, setConfig] = useState({debug: false});

  const handleLoad = () => {
    setHlsUrl(inputRef.current?.value ?? '');
  };

  const handleSwitch = () => {
    setConfig((c) => ({...c, debug: !c.debug}));
  };

  const hlsRef = useRef<ReactHlsPlayerRef>(null);

  useEffect(() => {
    console.log(hlsRef.current);
  }, []);

  return (
    <div className="example-container">
      <div className="example-input">
        url: <input ref={inputRef} defaultValue={hlsUrl} />
        <button onClick={handleLoad}>load</button>
        <button onClick={handleSwitch}>switch debug</button>
      </div>
      <ReactHlsPlayer
        ref={hlsRef}
        muted
        autoPlay
        controls
        hlsConfig={config}
        className="example-hls-player"
        src={hlsUrl}
      />
    </div>
  );
};

export default App;
