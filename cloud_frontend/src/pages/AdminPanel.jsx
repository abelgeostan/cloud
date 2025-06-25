
import AdminTopBar from '../components/TopBar/AdminTopBar';
import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newLimit, setNewLimit] = useState(15);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, userId: null });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.listAllUsers();
            setUsers(data);
        } catch (err) {
            alert('Failed to fetch users');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (id) => {
        setConfirmDelete({ show: true, userId: id });
    };

    const confirmDeleteUser = async () => {
        try {
            await adminService.deleteUserById(confirmDelete.userId);
            fetchUsers();
        } catch {
            alert('Failed to delete user');
        }
        setConfirmDelete({ show: false, userId: null });
    };

    const handleVerify = (user) => {
        setSelectedUser(user);
        setNewLimit(15);
        setModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            await adminService.updateUserStorageLimit(selectedUser.id, newLimit);
            alert('User verified and storage limit updated');
            setModalVisible(false);
            setSelectedUser(null);
            fetchUsers();
        } catch {
            alert('Failed to update storage limit');
        }
    };

    return (
        <div className="bg-dark min-vh-100 text-light" style={{ minHeight: '100vh' }}>
            <AdminTopBar />
            <div className="container mt-4">
                <h2>User List</h2>
                {loading ? (
                    <div className="text-center my-4">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Table striped bordered hover responsive className='table-dark'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Storage Used (MB)</th>
                                <th>Storage Limit (MB)</th>
                                <th>Verified</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{(user.storageUsed / (1024 * 1024)).toFixed(2)}</td>
                                    <td>{(user.storageLimit / (1024 * 1024)).toFixed(2)}</td>
                                    <td>{user.verified ? 'Yes' : 'No'}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            disabled={user.verified}
                                            onClick={() => handleVerify(user)}
                                        >
                                            Verify
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
            {/* Verify Modal */}
            <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
                <Modal.Header closeButton className='bg-primary text-white'>
                    <Modal.Title>Verify User &amp; Set Storage Limit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>New Storage Limit (GB):</Form.Label>
                            <Form.Control
                                type="number"
                                min={1}
                                value={newLimit}
                                onChange={e => setNewLimit(Number(e.target.value))}
                                style={{ width: 120 }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalVisible(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleModalOk}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal show={confirmDelete.show} onHide={() => setConfirmDelete({ show: false, userId: null })}>
                <Modal.Header closeButton className='bg-primary text-white'>
                    <Modal.Title>
                        <span className="text-danger me-2" style={{ fontSize: 20 }}>
                            <i className="bi bi-exclamation-circle-fill"></i>
                        </span>
                        Confirm Delete
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmDelete({ show: false, userId: null })}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminPanel;