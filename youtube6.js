// 🔧 CONFIG: Put your YouTube video ID here.
    // Example YouTube URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
    // The video ID is the part after "v=" → "dQw4w9WgXcQ"
    const YT_VIDEO_ID = "EzMdDue3AjQ";

    let player;

    // Show the modal immediately on page load
    document.addEventListener("DOMContentLoaded", function () {
      openVideoModal();
      loadYouTubeAPI();
    });

    function openVideoModal() {
      const overlay = document.getElementById("videoModalOverlay");
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }

    function closeVideoModal() {
      const overlay = document.getElementById("videoModalOverlay");
      overlay.classList.add("hidden");
      document.body.style.overflow = "scroll";

      if (player && typeof player.stopVideo === "function") {
        player.stopVideo();
      }
    }

    // Dynamically load the YouTube IFrame Player API
    function loadYouTubeAPI() {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // This function is called automatically by the YouTube API when it's ready
    function onYouTubeIframeAPIReady() {
      player = new YT.Player("videoPlayer", {
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 1,       // Try to autoplay
          controls: 0,       // Hide controls so users can't skip
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          disablekb: 1       // Disable keyboard controls (no skipping)
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    }

    function onPlayerReady(event) {
      // Many browsers only allow autoplay if the video is muted
      // You can remove mute() if you prefer, but autoplay may not work everywhere.
      event.target.unMute();
      event.target.setVolume(100); // full volume, optional

      // Try to autoplay
      event.target.playVideo();
    }

    function onPlayerStateChange(event) {
      // YT.PlayerState.ENDED === 0
      if (event.data === YT.PlayerState.ENDED) {
        // Close the modal ONLY after the video finishes
        closeVideoModal();
      }
    }
