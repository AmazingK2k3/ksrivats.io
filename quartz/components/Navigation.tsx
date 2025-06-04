import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pathToRoot } from "../util/path"
import style from "./styles/navigation.scss"

const Navigation: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)
  
  const navItems = [
    { name: "About", href: `${baseDir}about` },
    { name: "What I Do", href: `${baseDir}work` },
    { name: "Essays", href: `${baseDir}essays` },
    { name: "Projects", href: `${baseDir}projects` },
    { name: "Say Hi", href: `${baseDir}contact` },
  ]

  return (
    <nav class="main-navigation">
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
