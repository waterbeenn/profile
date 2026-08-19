/**
 * Plain natively-looping video.
 *
 * This previously simulated boomerang playback (forward, then reverse) by
 * scrubbing `currentTime` backwards. Browsers can't play video in reverse,
 * so that meant issuing ~40 seeks per second, forever — every one of which
 * forced a decode and a new compositor frame. Because the page also has
 * several large `backdrop-filter` panels, and Chromium re-runs that blur on
 * every compositor frame (with a downsampled approximation that isn't
 * frame-stable), the constant seeking showed up as visible flicker in the
 * header and widget panel.
 *
 * Native `loop` playback hands the whole thing to the compositor's video
 * layer: zero seeks, and smooth playback for free.
 */
export default function ProfileVideo({ className }: { className?: string }) {
  return (
    <video
      src="/profile.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
    />
  );
}
