import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/loadingScreen.scss"

const LoadingScreen: QuartzComponent = () => {
  return (
    <div class="loading-screen" id="loading-screen">
      <div class="loading-logo">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <text 
            x="50" 
            y="70" 
            font-family="Crimson Text, serif" 
            font-size="60" 
            font-weight="400" 
            text-anchor="middle" 
            fill="var(--secondary)"
          >
            K
          </text>
        </svg>
      </div>
    </div>
  )
}

LoadingScreen.css = style

LoadingScreen.afterDOMLoaded = `
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }, 1500);
`

export default (() => LoadingScreen) satisfies QuartzComponentConstructor
