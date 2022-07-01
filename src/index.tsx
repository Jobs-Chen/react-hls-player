import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import Hls, { HlsConfig } from 'hls.js';

export interface ReactHlsPlayerProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  hlsConfig?: Partial<HlsConfig>;
  src: string;
}

export interface ReactHlsPlayerRef {
  video: HTMLVideoElement | null;
  getHlsInstance: () => Hls | null;
  initPlayer: () => void;
}

const ReactHlsPlayer = forwardRef<ReactHlsPlayerRef, ReactHlsPlayerProps>(
  ({ hlsConfig, src, autoPlay, ...props }, ref) => {
    const playerRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    /**
     * init player
     */
    const initPlayer = useCallback(() => {
      if(hlsRef.current) {
        hlsRef.current.destroy();
      }

      hlsRef.current = new Hls(hlsConfig);

      if (playerRef.current) {
        hlsRef.current.attachMedia(playerRef.current);

        hlsRef.current.on(Hls.Events.MEDIA_ATTACHED, () => {
          if (hlsRef.current) {
            hlsRef.current.loadSource(src);
          }
        });
      }

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay && playerRef.current) {
          playerRef.current.play().catch((e) => {
            console.error('Unable autoplay with the dom.', e);
          });
        }
      });

      hlsRef.current.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal && hlsRef.current) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hlsRef.current.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hlsRef.current.recoverMediaError();
              break;
            default:
              initPlayer();
              break;
          }
        }
      });
    }, [autoPlay, hlsConfig, src]);

    /**
     * get hls instance
     */
    const getHlsInstance = () => hlsRef.current;

    /**
     * Expose video element, initialization methods and instances
     */
    useImperativeHandle(
      ref,
      () => ({
        video: playerRef.current,
        getHlsInstance,
        initPlayer,
      }),
      [playerRef.current, initPlayer]
    );

    useEffect(() => {
      // Check if the media source supported
      if (Hls.isSupported()) {
        initPlayer();
      }

      return () => {
        if (hlsRef.current != null) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    }, [initPlayer]);

    // If the media source is supported, use hls.js play video
    if (Hls.isSupported()) {
      return <video ref={playerRef} {...props} />;
    }

    // If the browser supports HLS by default, it will be played in the native mode
    return <video ref={playerRef} src={src} autoPlay={autoPlay} {...props} />;
  }
);

export default ReactHlsPlayer;
