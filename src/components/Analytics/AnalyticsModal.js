import React from 'react';
import Analytics from './Analytics';
import './Analytics.css';
import '../Dashboard.css';

function AnalyticsModal(props) {
    return (
        <div className="modal analyticsModal">
            <h3 className="modal--title">Analytics</h3>
            <Analytics />
            <button className="btn">Manage Analytics</button>
        </div>
    );
}

export default AnalyticsModal;