import React from 'react';

const Tabs = ({ children }) => {
  return (
    <div className="tabs">
      {children}
    </div>
  );
};

const TabItem = ({ title, children, active }) => {
  return (
    <div className={`tab-item ${active ? 'active' : ''}`}>
      <h2>{title}</h2>
      {active && children}
    </div>
  );
};

Tabs.Item = TabItem;

export default Tabs;
