import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ContactQueryManager = () => {
    const [queries, setQueries] = useState([]);

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const response = await api.get('/ContactQuery');
            setQueries(response.data);
        } catch (error) {
            console.error('Error fetching queries:', error);
            toast.error('Failed to load contact queries');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this query?')) return;
        try {
            await api.delete(`/ContactQuery/${id}`);
            setQueries(queries.filter(q => q.contactQueryId !== id));
            toast.success('Query deleted successfully');
        } catch (error) {
            toast.error('Failed to delete query');
        }
    };

    return (
        <div className="p-3 bg-white rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">📬 Customer Inquiries</h5>
                <Button variant="outline-primary" size="sm" onClick={fetchQueries}>
                    Refresh
                </Button>
            </div>

            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {queries.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">No inquiries found</td>
                        </tr>
                    ) : (
                        queries.map((query) => (
                            <tr key={query.contactQueryId}>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                    {new Date(query.sentAt).toLocaleDateString()}<br />
                                    <small className="text-muted">{new Date(query.sentAt).toLocaleTimeString()}</small>
                                </td>
                                <td>{query.name}</td>
                                <td><a href={`mailto:${query.email}`}>{query.email}</a></td>
                                <td>{query.subject}</td>
                                <td style={{ maxWidth: '300px' }} className="text-truncate" title={query.message}>
                                    {query.message}
                                </td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(query.contactQueryId)}>
                                        🗑️
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ContactQueryManager;
