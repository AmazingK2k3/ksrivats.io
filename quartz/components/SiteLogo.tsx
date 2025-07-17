import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pathToRoot } from "../util/path"
import style from "./styles/siteLogo.scss"

const SiteLogo: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class="site-logo-container">
      <a href={baseDir} class="logo-link">
        <img 
          src="/static/logo.svg" 
          alt="Kaushik Srivatsan Logo" 
          class="site-logo light-logo" style={{height: '48px', width: 'auto'}}
        />
        <img 
          src="/static/logo_dark.svg" 
          alt="Kaushik Srivatsan Logo" 
          class="site-logo dark-logo" style={{height: '48px', width: 'auto'}}
        />
      </a>
    </div>
  )
}

SiteLogo.css = style

export default (() => SiteLogo) satisfies QuartzComponentConstructor
