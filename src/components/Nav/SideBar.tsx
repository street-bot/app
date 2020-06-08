import React from 'react'
import { NavItem, NavLink, Nav } from "reactstrap";

export default function SideBar() {
    return (
        <Nav vertical className="pb-3">
        <p>Dummy Heading</p>
        <NavItem>
          <NavLink to={"/about"}>
            About
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to={"/pages"}>
            Portfolio
          </NavLink>
        </NavItem>
      </Nav>
    )
}
