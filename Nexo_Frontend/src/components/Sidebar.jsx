import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import nexoLogo from '../assets/nexo-logo.png';
import '../styles/sidebar.css';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Evaluaciones', icon: <AssessmentIcon />, path: '/evaluaciones' },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/usuarios' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/configuracion' },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <Drawer
      variant="permanent"
      className={`sidebar ${expanded ? 'open' : 'closed'}`}
      classes={{
        paper: `sidebar-paper ${expanded ? 'open' : 'closed'}`,
      }}
    >
      <Box className="sidebar-header">
        <Typography variant="h6" className="sidebar-title">
          Nexo
        </Typography>
        <IconButton
          className="toggle-button"
          onClick={toggleExpand}
          size="small"
        >
          <img src={nexoLogo} alt="Nexo Logo" className="sidebar-logo-icon" />
        </IconButton>
      </Box>
      <Divider />
      <List className="sidebar-list">
        {menuItems.map((item) => (
          <Tooltip
            key={item.text}
            title={!expanded ? item.text : ''}
            placement="right"
            arrow
          >
            <ListItem
              component={Link}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <ListItemIcon className="sidebar-icon">{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                className="sidebar-text"
                sx={{ opacity: expanded ? 1 : 0 }}
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;