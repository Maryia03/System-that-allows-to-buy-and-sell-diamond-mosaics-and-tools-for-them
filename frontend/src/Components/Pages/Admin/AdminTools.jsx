import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';
import './AdminTools.css';

const AdminTools = () => {
    const { getAllTools, addTool, updateTool, deleteTool } = useContext(AuthContext);
    const [tools, setTools] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [editImageFile, setEditImageFile] = useState(null);

    const [newTool, setNewTool] = useState({
        name: '',
        description: '',
        price: ''
    });

    const [editModal, setEditModal] = useState(false);
    const [editingTool, setEditingTool] = useState(null);

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        const data = await getAllTools();
        if (Array.isArray(data)) {
            setTools(data);
        } else {
            console.error("getAllTools did not return an array:", data);
            setTools([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTool(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("The file must be an image!");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("The image is too large! The maximum size is 5 MB.");
            e.target.value = "";
            return;
        }

        const img = new Image();
        img.onload = () => {
            if (img.width > 850 || img.height > 600) {
                alert("The image is too big.The maximum size is 850x600.");
                e.target.value = "";
            } else {
                setImageFile(file);
            }
        };
        img.src = URL.createObjectURL(file);
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("The file must be an image!");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("The image is too large! The maximum size is 5 MB.");
            e.target.value = "";
            return;
        }

        const img = new Image();
        img.onload = () => {
            if (img.width > 850 || img.height > 600) {
                alert("The image is too big.The maximum size is 850x600.");
                e.target.value = "";
            } else {
                setEditImageFile(file);
            }
        };
        img.src = URL.createObjectURL(file);
    };

    const handleAdd = async () => {
        const { name, description, price } = newTool;
        if (!name || !description || !price || !imageFile) {
            alert("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch('http://localhost:8080/upload', {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) {
            alert('Image transfer error.');
            return;
        }

        const imageUrl = await uploadRes.text();

        await addTool({ ...newTool, price: parseFloat(price), imageLink: imageUrl });
        setNewTool({ name: '', description: '', price: '' });
        setImageFile(null);
        setShowForm(false);
        fetchTools();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this tool?")) {
            await deleteTool(id);
            fetchTools();
        }
    };

    const openEditModal = (tool) => {
        setEditingTool({ ...tool });
        setEditImageFile(null);
        setEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingTool(prev => ({ ...prev, [name]: value }));
    };

    const saveEdit = async () => {
        const { id, name, description, price } = editingTool;
        if (!name || !description || !price) {
            alert("All fields are required.");
            return;
        }

        let imageLink = editingTool.imageLink;
        if (editImageFile) {
            const formData = new FormData();
            formData.append('file', editImageFile);

            const uploadRes = await fetch('http://localhost:8080/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) {
                alert('Error uploading new image.');
                return;
            }

            imageLink = await uploadRes.text();
        }

        await updateTool({ id, name, description, price: parseFloat(price), imageLink });
        setEditModal(false);
        setEditImageFile(null);
        fetchTools();
    };

    return (
        <div className="admin-tools-container">
            <h2>Tool management</h2>

            <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
                {showForm ? 'Cancel' : 'Add a new tool'}
            </button>

            {showForm && (
                <div className="admin-form">
                    <input type="text" name="name" placeholder="Name" value={newTool.name} onChange={handleChange} />
                    <input type="text" name="description" placeholder="Description" value={newTool.description} onChange={handleChange} />
                    <input type="number" name="price" placeholder="Price" value={newTool.price} onChange={handleChange} />
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ maxWidth: 200, marginTop: 10 }} />}
                    <button onClick={handleAdd}>Dodaj</button>
                </div>
            )}

            <div className="tool-grid admin">
                {tools.map((tool) => (
                    <div key={tool.id} className="tool-card">
                        <img src={tool.imageLink} alt={tool.name} />
                        <h4>{tool.name}</h4>
                        <p>{tool.price} PLN</p>
                        <p>{tool.description}</p>
                        <button onClick={() => openEditModal(tool)}>Edit</button>
                        <button onClick={() => handleDelete(tool.id)}>Delete</button>
                    </div>
                ))}
            </div>

            <Modal show={editModal} onHide={() => setEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit tool</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingTool && (
                        <div className="admin-form">
                            <input type="text" name="name" value={editingTool.name} onChange={handleEditChange} />
                            <input type="text" name="description" value={editingTool.description} onChange={handleEditChange} />
                            <input type="number" name="price" value={editingTool.price} onChange={handleEditChange} />
                            <input type="file" accept="image/*" onChange={handleEditFileChange} />
                            {editImageFile ? (
                                <img src={URL.createObjectURL(editImageFile)} alt="New preview" style={{ maxWidth: 200, marginTop: 10 }} />
                            ) : (
                                editingTool.imageLink && <img src={editingTool.imageLink} alt="Preview" style={{ maxWidth: 200, marginTop: 10 }} />
                            )}
                            <button onClick={saveEdit}>Save</button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminTools;
