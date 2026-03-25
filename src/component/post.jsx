
export default function PostCard({ post }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-400 mb-3">{post.excerpt}</p>

      <div className="text-sm text-gray-500">
        {post.author} • {post.date}
      </div>
    </div>
  )
}