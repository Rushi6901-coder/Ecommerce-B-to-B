import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
