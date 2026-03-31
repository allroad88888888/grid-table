import { useState } from 'react'
import { useAtom } from '@einfach/react'
import { RouteGroups, currentRouterAtom, type RouteGroup, type RouteItem } from '../router'
import './Navigation.css'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const [currentRoute, setCurrentRoute] = useAtom(currentRouterAtom)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    table: true,
    tree: true,
    other: false,
  })

  const handleRouteClick = (path: string) => {
    setCurrentRoute(path)
    // 更新浏览器地址栏（拼接 base path 以支持 GitHub Pages 部署）
    const baseTag = document.querySelector('base')
    const base = baseTag ? baseTag.getAttribute('href') || '/' : '/'
    const url = base !== '/' ? base.replace(/\/$/, '') + path : path
    window.history.pushState({}, '', url)
  }

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }

  const isRouteActive = (path: string) => {
    return currentRoute === path
  }

  const renderRouteItem = (route: RouteItem) => (
    <li key={route.path} className="nav-route-item">
      <button
        className={`nav-route-button ${isRouteActive(route.path) ? 'active' : ''}`}
        onClick={() => handleRouteClick(route.path)}
        title={route.label}
      >
        <span className="nav-route-label">{route.label}</span>
      </button>
    </li>
  )

  const renderGroup = (groupKey: string, group: RouteGroup) => {
    const isExpanded = expandedGroups[groupKey]

    return (
      <div key={groupKey} className="nav-group">
        <button
          className={`nav-group-header ${isExpanded ? 'expanded' : ''}`}
          onClick={() => toggleGroup(groupKey)}
        >
          <span className="nav-group-icon">{group.icon}</span>
          <span className="nav-group-label">{group.label}</span>
          <span className={`nav-group-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </button>
        {isExpanded && <ul className="nav-route-list">{group.routes.map(renderRouteItem)}</ul>}
      </div>
    )
  }

  return (
    <nav className={`navigation ${className || ''}`}>
      <div className="nav-header">
        <h2 className="nav-title">
          <span className="nav-title-icon">🚀</span>
          Grid Table Demo
        </h2>
        <div className="nav-subtitle">组件演示平台</div>
      </div>

      <div className="nav-content">
        {Object.entries(RouteGroups).map(([groupKey, group]) => renderGroup(groupKey, group))}
      </div>

      <div className="nav-footer">
        <div className="nav-stats">
          共 {Object.values(RouteGroups).reduce((acc, group) => acc + group.routes.length, 0)}{' '}
          个组件
        </div>
      </div>
    </nav>
  )
}
