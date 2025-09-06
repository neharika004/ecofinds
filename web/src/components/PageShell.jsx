import React from 'react';

export default function PageShell({ title, subtitle, children, className = '' }) {
  return (
    <div className={`min-h-[calc(100vh-72px)] flex flex-col py-8 ${className}`}>
      <div className="max-w-4xl w-full mx-auto px-4">
        {title && <div className="mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <div className="kicker mt-1">{subtitle}</div>}
        </div>}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
