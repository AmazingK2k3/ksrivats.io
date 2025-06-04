import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pathToRoot } from "../util/path"
import style from "./styles/siteLogo.scss"

const SiteLogo: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class="site-logo-container">
      <a href={baseDir} class="logo-link">
        <img 
          src={`${baseDir}static/logo.svg`} 
          alt="Kaushik Srivatsan Logo" 
          class="site-logo light-logo" 
        />
        <img 
          src={`${baseDir}static/logo_dark.svg`} 
          alt="Kaushik Srivatsan Logo" 
          class="site-logo dark-logo" 
        />
      </a>
    </div>
  )
}

SiteLogo.css = style

export default (() => SiteLogo) satisfies QuartzComponentConstructor
