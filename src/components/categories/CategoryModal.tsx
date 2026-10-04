import { useState } from "react";
import type { Category } from "../../types/Category";
import { createCategory } from "../../services/categoryService";

interface CategoryModalProps {
    category?: Category;
    open: boolean;
    onClose: () => void;
}

export default function CategoryModal({ open, onClose }: CategoryModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = {
            name,
            description,
        };

        try {
            await createCategory(data);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    if (!open) return null;

    return (
        open && (

            <div className="modal-overlay">
                <div className="modal">
                    <button
                        className="close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>

                    <h2>Add Category</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Category name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button type="submit">
                                Add Category
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        ))
}