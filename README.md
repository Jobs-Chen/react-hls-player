# react-hls-player
A simple React HTTP Live Streaming player. It uses [hls.js](https://github.com/video-dev/hls.js) to play your hls live stream if your browser supports `html 5 video` and `MediaSource Extension`.

## Examples

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import ReactHlsPlayer from 'react-hls-player';

ReactDOM.render(
  <ReactHlsPlayer
    controls
    src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  />,
  document.getElementById('app')
);
```

## Props

All [video properties](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) are supported and pass to the video element.

| Prop                 | Type                 | Description                                                  |
| -------------------- | -------------------- | ------------------------------------------------------------ |
| src                  | `String`, `required` | The hls url that you want to play                            |
| hlsConfig `Object`   | `Object`             | `hls.js` config, you can see all config [here](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning) |
| autoPlay             | `Boolean`            | Autoplay when component is ready. Defaults to `false` (Sometimes it may not work. You need to check this) |
| ...other video props |                      | All video properties are supported.                          |

## Ref
You can access video element,  hls instances and initPlayer function through ref.

```javascript
import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import ReactHlsPlayer from 'react-hls-player';

const App = () => {
  const hlsRef = useRef(null);

  useEffect(() => {
    console.log(hlsRef.current); // {getHlsInstance: ƒ (), initPlayer: ƒ (), video: video}
  }, []);

  return (
    <ReactHlsPlayer
      ref={hlsRef}
      controls
      src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    />
  );
};
```