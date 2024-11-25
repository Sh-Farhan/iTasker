import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 py-10 text-gray-600 font-sans">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-wrap mb-8">
          <div className="flex-1 min-w-[200px] mb-5">
            <h3 className="text-lg font-bold mb-4 text-gray-800">About Us</h3>
            <p className="text-sm leading-6">
              Empowering teams to achieve more through intuitive task management and collaboration tools.
            </p>
          </div>
          <div className="flex-1 min-w-[200px] mb-5">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Links</h3>
            <ul className="list-none p-0 m-0">
              <li><a href="/" className="text-sm text-gray-600 hover:underline leading-8">Dashboard</a></li>
              <li><a href="/tasks" className="text-sm text-gray-600 hover:underline leading-8">My Tasks</a></li>
              <li><a href="/projects" className="text-sm text-gray-600 hover:underline leading-8">Projects</a></li>
              <li><a href="/team" className="text-sm text-gray-600 hover:underline leading-8">Team</a></li>
            </ul>
          </div>
          <div className="flex-1 min-w-[200px] mb-5">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Contact Us</h3>
            <p className="text-sm leading-6 flex items-center">
              <Mail className="mr-2" size={16} /> support@example.com
            </p>
            <p className="text-sm leading-6 flex items-center">
              <Phone className="mr-2" size={16} /> (123) 456-7890
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 pt-5 flex-wrap">
          <p className="text-sm my-2">© {currentYear} Your Company Name. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
