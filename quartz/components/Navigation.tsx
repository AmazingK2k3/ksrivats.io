import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pathToRoot } from "../util/path"
import style from "./styles/navigation.scss"
import Darkmode from "./Darkmode"

const Navigation: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)
  
  const navItems = [
    { name: "About", href: "/about" },
    { name: "What I Do", href: "/work" },
    { name: "Essays", href: "/essays" },
    { name: "Projects", href: "/projects" },
    { name: "Say Hi", href: "/contact" },
  ]

  return (
    <nav class="main-navigation">
      <div class="nav-darkmode">
        <Darkmode />
      </div>
      <ul class="nav-list">
        {navItems.map((item, index) => (
          <li class="nav-item" style={`animation-delay: ${index * 0.1}s`}>
            <a href={item.href} class="nav-link">
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

Navigation.css = style

export default (() => Navigation) satisfies QuartzComponentConstructor
