
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utlis/image";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Drafts() {
	const [drafts, setDrafts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const user = localStorage.getItem("user");
	const userId = user ? JSON.parse(user)._id : null;
	const role = localStorage.getItem("role");

	const fetchDrafts = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch(`${VITE_API_BASE_URL}/api/blog/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) {
				const txt = await res.text();
				throw new Error(txt || "Failed to fetch drafts");
			}
			const data = await res.json();

			const filtered = (Array.isArray(data) ? data : []).filter(
				(p) => !p.isPublished && (role === "admin" || String(p.authorId) === String(userId))
			);
			setDrafts(filtered);
		} catch (err) {
			console.error("Failed to fetch drafts", err);
			setError(err.message || "Failed to fetch drafts");
			setDrafts([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDrafts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleEdit = (post) => {
		navigate("/blog", { state: { editId: post._id } });
	};

	const handlePublish = async (id) => {
		if (!window.confirm("Publish this draft?")) return;
		try {
			const res = await fetch(`${VITE_API_BASE_URL}/api/blog/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ isDraft: false, scheduledAt: "" }),
			});
			if (!res.ok) throw new Error("Publish failed");
			fetchDrafts();
		} catch (err) {
			console.error("Publish failed", err);
			alert("Publish failed");
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete draft?")) return;
		try {
			const res = await fetch(`${VITE_API_BASE_URL}/api/blog/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error("Delete failed");
			fetchDrafts();
		} catch (err) {
			console.error("Delete failed", err);
			alert("Delete failed");
		}
	};

	if (loading) return <div className="p-8 text-gray-400">Loading drafts...</div>;

	return (
		<div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%)]"></div>
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_40%)]"></div>

			<div className="relative z-10 flex min-h-screen">
				<main className="flex-1 ml-64 p-10 max-w-6xl">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-6">Drafts ({drafts.length})</h1>

					{error && <div className="text-red-400 mb-4">{error}</div>}

					{drafts.length === 0 ? (
						<div className="text-gray-400">No drafts found.</div>
					) : (
						<div className="flex flex-col gap-6">
							{drafts.map((post) => (
								<article key={post._id} className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/50 transition-all duration-300 shadow-md">
									<div className="flex items-start gap-6">
										<img
											src={post.coverImage ? getImageUrl(post.coverImage) : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
											alt="cover"
											className="w-24 h-24 object-cover rounded-md flex-shrink-0"
										/>
										<div className="flex-1">
											<h2 className="text-2xl font-semibold mb-1 text-white">{post.title || "Untitled"}</h2>
											<p className="text-gray-400 text-sm mb-3">@{post.author} • {new Date(post.createdAt).toLocaleDateString()}</p>
											<div className="text-gray-300 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
											<div className="mt-4 flex flex-wrap gap-3">
												<button onClick={() => handleEdit(post)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white">Edit</button>
												<button onClick={() => handlePublish(post._id)} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white">Publish</button>
												<button onClick={() => handleDelete(post._id)} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">Delete</button>
											</div>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

