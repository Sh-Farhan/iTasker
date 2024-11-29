"use client"

import React, { useState } from 'react';
import { Bell, CheckCircle, FolderKanban, Home, PlusCircle, Settings, Users, ChevronDown } from 'lucide-react';

const NavItem = ({ href, icon: Icon, children }) => (
  <a href={href} style={styles.navItem}>
    <Icon style={styles.icon} />
    <span style={styles.navItemText}>{children}</span>
  </a>
);

const DropdownItem = ({ href, title, description }) => (
  <li>
    <a href={href} style={styles.dropdownItem}>
      <div style={styles.dropdownItemTitle}>{title}</div>
      <p style={styles.dropdownItemDescription}>{description}</p>
    </a>
  </li>
);

export default function NavBar() {
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.navItems}>
          <NavItem href="/dashboard" icon={Home}>Dashboard</NavItem>
          <NavItem href="/tasks" icon={CheckCircle}>Tasks</NavItem>
          <NavItem href="/projects" icon={FolderKanban}>Projects</NavItem>
          <div 
            style={styles.navItem} 
            onMouseEnter={() => setIsTeamDropdownOpen(true)}
            onMouseLeave={() => setIsTeamDropdownOpen(false)}
          >
            <Users style={styles.icon} />
            <span style={styles.navItemText}>Team</span>
            <ChevronDown style={styles.icon} />
            {isTeamDropdownOpen && (
              <div style={styles.dropdownContent}>
                <ul style={styles.dropdownList}>
                  <DropdownItem 
                    href="/team/members" 
                    title="Members" 
                    description="View and manage team members"
                  />
                  <DropdownItem 
                    href="/team/roles" 
                    title="Roles" 
                    description="Manage team roles and permissions"
                  />
                </ul>
              </div>
            )}
          </div>
        </div>
        <div style={styles.navActions}>
          <button style={styles.iconButton} aria-label="Notifications">
            <Bell style={styles.icon} />
          </button>
          <button style={styles.iconButton} aria-label="Settings">
            <Settings style={styles.icon} />
          </button>
          {/* Remove the New Task button */}
        </div>
        <div style={styles.userProfile}>
          <img src="/placeholder.svg?height=32&width=32" alt="User Avatar" style={styles.avatar} />
          <span style={styles.userName}>Alex Johnson</span>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    width: '100%',
    // background: 'linear-gradient(to right, #8B5CF6, #6366F1)',
    background: 'linear-gradient(to right, black, black)',
    padding: '12px 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItems: {
    display: 'flex',
    alignItems: 'center',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    textDecoration: 'none',
    marginRight: '24px',
    position: 'relative',
    cursor: 'pointer',
  },
  navItemText: {
    fontWeight: '600',
  },
  icon: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    marginRight: '16px',
    padding: '4px',
  },
  newTaskButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    color: '#8B5CF6',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: '0',
    background: 'white',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    minWidth: '200px',
    zIndex: 10,
  },
  dropdownList: {
    listStyle: 'none',
    padding: '8px 0',
    margin: 0,
  },
  dropdownItem: {
    display: 'block',
    padding: '12px 16px',
    textDecoration: 'none',
    color: '#333',
  },
  dropdownItemTitle: {
    fontWeight: '600',
    marginBottom: '4px',
  },
  dropdownItemDescription: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '16px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '8px',
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
};