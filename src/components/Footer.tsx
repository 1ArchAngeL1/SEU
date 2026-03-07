'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';

export default function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', phone: '' });
  };

  return (
    <footer id="contact" className="bg-[#060d16] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About SEU Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left - About */}
          <div>
            <p className="text-[#c9a962] text-seu-caption-sm uppercase tracking-[0.3em] mb-4">
              About SEU
            </p>
            <h3 className="text-seu-heading md:text-seu-heading-lg font-light text-white mb-6">
              About SEU.
            </h3>
            <p className="text-[#9ca3af] text-seu-caption leading-relaxed mb-6">
              SEU Development has been operating in the real estate market since
              2016. The company&apos;s mission is to create high-quality,
              comfortable, and modern residential spaces that meet the highest
              standards. We combine innovative construction technologies with
              thoughtful architectural design.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <Link
                href="https://facebook.com"
                className="w-10 h-10 bg-[#0c1829] rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#c9a962] hover:bg-[#0d2e2e] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href="https://instagram.com"
                className="w-10 h-10 bg-[#0c1829] rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#c9a962] hover:bg-[#0d2e2e] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                className="w-10 h-10 bg-[#0c1829] rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#c9a962] hover:bg-[#0d2e2e] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right - Logo and Map */}
          <div className="flex flex-col items-end">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/logo-large.png"
                alt="SEU Logo"
                width={200}
                height={100}
                className="h-24 w-auto"
              />
            </div>

            {/* Map placeholder */}
            <div className="w-full h-48 bg-[#0c1829] rounded-lg overflow-hidden relative">
              <Image
                src="/map.jpg"
                alt="Location Map"
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-[#c9a962] rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#0c1829]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request a Call Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-t border-white/10">
          <div>
            <h3 className="text-seu-subheading font-light text-white mb-2">
              Request a Call.
            </h3>
            <p className="text-[#9ca3af] text-seu-caption">
              Leave your contact information and our team will reach out to you.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="flex-1 bg-[#0c1829] border border-white/10 rounded px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c9a962]"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="flex-1 bg-[#0c1829] border border-white/10 rounded px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c9a962]"
            />
            <button
              type="submit"
              className="bg-[#c9a962] text-[#0c1829] px-8 py-3 rounded font-medium hover:bg-[#d4b872] transition-colors whitespace-nowrap"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="SEU Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-white font-medium">SEU</span>
              <span className="text-[#9ca3af] text-seu-caption">
                development
              </span>
            </div>

            <nav className="flex flex-wrap justify-center gap-6 text-seu-caption text-[#9ca3af]">
              <Link
                href="#projects"
                className="hover:text-[#c9a962] transition-colors"
              >
                Projects
              </Link>
              <Link
                href="#seu-card"
                className="hover:text-[#c9a962] transition-colors"
              >
                SEU Card
              </Link>
              <Link
                href="/privacy"
                className="hover:text-[#c9a962] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#news"
                className="hover:text-[#c9a962] transition-colors"
              >
                News
              </Link>
              <Link
                href="#about"
                className="hover:text-[#c9a962] transition-colors"
              >
                About
              </Link>
            </nav>

            <p className="text-[#6b7280] text-seu-caption">
              &copy; {new Date().getFullYear()} SEU Development
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
