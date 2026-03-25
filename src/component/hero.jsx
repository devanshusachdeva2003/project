import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleStartBlog = () => {
    navigate("/blog");
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white min-h-screen flex items-center">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.2),_transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.2),_transparent_40%)]" />

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-16 items-center w-full">
        <div>
          <span className="inline-block mb-6 px-4 py-1 text-sm bg-gradient-to-r from-indigo-600/20 to-blue-600/20 text-indigo-300 rounded-full backdrop-blur border border-indigo-500/30">
            For builders, engineers & tech leaders
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Write to think.
            <br />
            <span className="text-gray-300">Publish to connect.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
            AI can generate a thousand articles a minute. But it can't do your
            thinking for you. Share what you've learned, sharpen your ideas,
            and grow alongside people who care about the craft.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStartBlog}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105"
            >
              Start Blogging
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl blur-3xl opacity-30 animate-pulse" />

            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-2 rounded-2xl">
              <img
                src="/h.webp"
                alt="Person typing on a keyboard"
                className="w-full max-w-md rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}