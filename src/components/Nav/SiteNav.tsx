import React from 'react'

export default function SiteNav() {
    return (
        <nav className="navbar navbar-dark bg-primary">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href=".">
                Street Bot
                <span className="sr-only">(current)</span>
              </a>
            </li>
          </ul>
        </nav>
    )
}
